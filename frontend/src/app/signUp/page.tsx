"use client";

import { Input } from "@/app/components/common/Input";
import { Button } from "@/app/components/common/Button";
import { SubmitEvent } from "react";
import { apiClient } from "@/app/lib/api-client";

export default function SignUpPage() {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSubmit");
    apiClient
      .get("/api/users")
      .then((response) => console.log("response", response));
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <form className="flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
        <Input placeholder="Введите email" />
        <Input placeholder="Введите username" />
        <Input placeholder="Введите пароль" type="password" />
        <Button />
      </form>
    </div>
  );
}
