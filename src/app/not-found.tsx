import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-border/70 bg-card/90 p-8 text-center shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          الرابط الذي تحاول الوصول إليه غير متاح حاليًا. يمكنك العودة للواجهة
          الرئيسية ومتابعة العمل من هناك.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
