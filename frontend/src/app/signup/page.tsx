"use client";

import { Button, Input } from "antd";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { SignUpResponse } from "@/types/signUpResponse";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    apiClient
      .post<SignUpResponse>("/api/auth/signup", {
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("authToken", res.token);
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
        <AuthFormField id="email" label="Email">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Введите email"
            size="large"
            className="!rounded-xl"
          />
        </AuthFormField>

        <AuthFormField id="username" label="Имя пользователя">
          <Input
            id="username"
            name="username"
            placeholder="Введите username"
            size="large"
            className="!rounded-xl"
          />
        </AuthFormField>

        <AuthFormField id="password" label="Пароль">
          <Input.Password
            id="password"
            name="password"
            placeholder="Введите пароль"
            size="large"
            className="!rounded-xl"
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
