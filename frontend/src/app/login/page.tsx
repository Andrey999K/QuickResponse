"use client";

import { Input } from "@/app/components/common/Input";
import { Button } from "@/app/components/common/Button";
import { SubmitEvent } from "react";

export default function LoginPage() {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <form className="flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
        <Input placeholder="Введите логин" />
        <Input placeholder="Введите пароль" type="password" />
        <Button />
      </form>
    </div>
  );
}
