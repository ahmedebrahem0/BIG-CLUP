import http from "node:http";
import https from "node:https";

import { NextResponse, type NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildTargetUrl(path: string[], request: NextRequest) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const normalizedBaseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const targetUrl = new URL(`${normalizedBaseUrl}/${path.join("/")}/`);
  targetUrl.search = request.nextUrl.search;

  return targetUrl;
}

async function forwardRequest(
  targetUrl: URL,
  method: string,
  contentType: string | null,
  body?: string
) {
  const transport = targetUrl.protocol === "https:" ? https : http;
  const bodyBuffer = body ? Buffer.from(body, "utf8") : undefined;

  return new Promise<{
    statusCode: number;
    body: string;
    contentType: string | null;
  }>((resolve, reject) => {
    const req = transport.request(
      targetUrl,
      {
        method,
        headers: {
          ...(contentType ? { "content-type": contentType } : {}),
          ...(bodyBuffer ? { "content-length": String(bodyBuffer.byteLength) } : {}),
          "ngrok-skip-browser-warning": "true",
        },
        rejectUnauthorized: false,
      },
      (res) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk) => {
          chunks.push(Buffer.from(chunk));
        });

        res.on("end", () => {
          const responseContentType = res.headers["content-type"];

          resolve({
            statusCode: res.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
            contentType: Array.isArray(responseContentType)
              ? responseContentType[0] ?? null
              : responseContentType ?? null,
          });
        });
      }
    );

    req.on("error", reject);

    if (bodyBuffer?.byteLength) {
      req.write(bodyBuffer);
    }

    req.end();
  });
}

async function proxyRequest(request: NextRequest, path: string[]) {
  try {
    const targetUrl = buildTargetUrl(path, request);
    const contentType = request.headers.get("content-type");
    const rawBody =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const response = await forwardRequest(
      targetUrl,
      request.method,
      contentType,
      rawBody
    );

    if (response.statusCode === 204 || !response.body.length) {
      return new NextResponse(null, {
        status: response.statusCode,
        headers: response.contentType ? { "content-type": response.contentType } : undefined,
      });
    }

    return new NextResponse(response.body, {
      status: response.statusCode,
      headers: response.contentType ? { "content-type": response.contentType } : undefined,
    });
  } catch (error) {
    console.error("API proxy error", error);

    return NextResponse.json(
      {
        message: "تعذر الاتصال بالباك اند من خلال البروكسي المحلية.",
      },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}