"use client";

import { SyntheticEvent, useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-toastify";
import { log } from "@/utils/log";

const loginSchema = z.object({
  email: z.email("Некорректный формат email").min(1, "Введите email"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    apiClient
      .post<{ token: string }>("/api/auth/login", {
        email: result.data.email,
        password: result.data.password,
      })
      .then((res) => {
        if (res.token) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        log("error", error);
        toast.error(error?.message ?? "Произошла непредвиденная ошибка");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthCard
      title="Войти в Auto Offer"
      subtitle="Введите свои данные, чтобы продолжить"
      footer={
        <p className="text-center text-sm text-gray-400">
          Нет аккаунта?{" "}
          <Link
            href={"/signup"}
            className="text-primary-500 font-semibold hover:underline transition-colors"
          >
            Зарегистрироваться
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthFormField id="login" label="Логин" error={errors.email}>
          <Input
            id="email"
            name="email"
            placeholder="Введите логин"
            size="large"
            className="!rounded-xl"
            status={errors.email ? "error" : ""}
          />
        </AuthFormField>

        <AuthFormField id="password" label="Пароль" error={errors.password}>
          <Input.Password
            id="password"
            name="password"
            placeholder="Введите пароль"
            size="large"
            className="!rounded-xl"
            status={errors.password ? "error" : ""}
          />
        </AuthFormField>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="!font-semibold !rounded-xl !mt-2"
          block
        >
          Войти
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400">или</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <Button size="large" className="!font-semibold !rounded-xl" block>
        Войти через <span className="text-primary-500 font-bold">hh.ru</span>
      </Button>
    </AuthCard>
  );
}
