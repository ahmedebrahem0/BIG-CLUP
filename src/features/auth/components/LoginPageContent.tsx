"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { handleApiError } from "@/lib/api/handleApiError";
import { useAppDispatch } from "@/store/hooks";

import { useLoginMutation } from "../authApi";
import { setCredentials } from "../authSlice";
import { loginSchema, type LoginSchemaValues } from "../schema/login.schema";

export function LoginPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, loginState] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const usernameField = register("username");

  async function onSubmit(values: LoginSchemaValues) {
    try {
      const response = await login({
        username: values.username.toLowerCase().trim(),
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(response));
      toast.success("تم تسجيل الدخول بنجاح.");
      router.replace(response.role === "supplier" ? ROUTES.suppliers : ROUTES.clubs);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_16%,rgba(36,112,96,0.16),transparent_30%),linear-gradient(135deg,#f8faf9_0%,#edf4f1_54%,#dce8e4_100%)] px-4 py-6 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/88 shadow-[0_26px_80px_rgba(22,48,41,0.15)] backdrop-blur lg:grid-cols-[0.9fr_1fr]">
          <aside className="hidden min-h-[560px] flex-col justify-between bg-[linear-gradient(145deg,#123e36_0%,#247464_100%)] p-9 text-white lg:flex">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/14">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm text-white/68">Big Club</p>
                <h1 className="text-2xl font-semibold">لوحة التحكم</h1>
              </div>
            </div>

            <div className="space-y-4">
              <p className="max-w-sm text-4xl font-semibold leading-[1.25]">
                دخول سريع وآمن للنظام.
              </p>
              <p className="max-w-sm text-base leading-8 text-white/74">
                صلاحيات admin و supplier هتتحدد بعد تسجيل الدخول      .
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/12 p-4">
                <p className="text-white/60">admin</p>
                <p className="mt-2 font-medium">كل الصفحات</p>
              </div>
              <div className="rounded-2xl bg-white/12 p-4">
                <p className="text-white/60">supplier</p>
                <p className="mt-2 font-medium">الموردين فقط</p>
              </div>
            </div>
          </aside>

          <div className="flex min-h-[560px] items-center justify-center p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-sm">
              <div className="mb-8 space-y-3 text-right">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:hidden">
                  <ShieldCheck className="size-6" />
                </span>
                <p className="text-sm font-medium text-primary">تسجيل الدخول</p>
                <h2 className="text-3xl font-semibold tracking-normal">أهلًا بيك</h2>
                <p className="leading-7 text-muted-foreground">
                  اكتب اسم المستخدم وكلمة المرور للدخول للوحة التحكم.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      autoComplete="username"
                      className="h-12 pr-10 lowercase"
                      placeholder=" اسم المستخدم"
                      {...usernameField}
                      onChange={(event) => {
                        event.target.value = event.target.value.toLowerCase();
                        void usernameField.onChange(event);
                      }}
                    />
                  </div>
                  {errors.username ? (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      autoComplete="current-password"
                      className="h-12 px-10"
                      placeholder="اكتب كلمة المرور"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                    />
                    <Button
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      className="absolute left-1.5 top-1/2 size-9 -translate-y-1/2"
                      onClick={() => setShowPassword((current) => !current)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  {errors.password ? (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  ) : null}
                </div>

                <Button className="h-12 w-full text-base" disabled={loginState.isLoading} type="submit">
                  {loginState.isLoading ? "جاري الدخول..." : "دخول"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}