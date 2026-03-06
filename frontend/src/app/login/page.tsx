"use client";

import { useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFormField } from "@/components/auth/AuthFormField";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: логика авторизации
    setTimeout(() => setLoading(false), 1500);
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
        <AuthFormField id="login" label="Логин">
          <Input
            id="login"
            name="login"
            placeholder="Введите логин"
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
