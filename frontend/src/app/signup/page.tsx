"use client";

import { SyntheticEvent, useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { apiClient } from "@/lib/api-client";
import { SignUpResponse } from "@/types/signUpResponse";

const signUpSchema = z.object({
  email: z.email("Введите корректный email"),
  username: z
    .string()
    .min(3, "Имя пользователя должно быть не менее 3 символов"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type SignUpErrors = Partial<Record<keyof z.infer<typeof signUpSchema>, string>>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = signUpSchema.safeParse({
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const fieldErrors: SignUpErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignUpErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    apiClient
      .post<SignUpResponse>("/api/auth/signup", result.data)
      .then((res) => {
        if (res.user) {
          router.push("/dashboard");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthCard
      title="Создать аккаунт"
      subtitle="Начните находить работу быстрее"
      footer={
        <p className="text-center text-sm text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            href={"/login"}
            className="text-primary-500 font-semibold hover:underline transition-colors"
          >
            Войти
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthFormField id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Введите email"
            size="large"
            className="!rounded-xl"
            status={errors.email ? "error" : ""}
          />
        </AuthFormField>

        <AuthFormField
          id="username"
          label="Имя пользователя"
          error={errors.username}
        >
          <Input
            id="username"
            name="username"
            placeholder="Введите username"
            size="large"
            className="!rounded-xl"
            status={errors.username ? "error" : ""}
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
          Зарегистрироваться
        </Button>
      </form>
    </AuthCard>
  );
}
