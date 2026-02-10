"use client";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { SubmitEvent } from "react";

export default function LoginPage() {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <form className="flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
        <Input name="login" placeholder="Введите логин" />
        <Input name="password" placeholder="Введите пароль" type="password" />
        <Button>Войти</Button>
      </form>
    </div>
  );
}
