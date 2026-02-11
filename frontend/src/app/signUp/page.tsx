"use client";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { SubmitEvent } from "react";
import { apiClient } from "@/lib/api-client";
import { SignUpResponse } from "@/types/signUpResponse";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    console.log("Sending data:", data);
    apiClient.post<SignUpResponse>("/api/auth/signup", data).then((res) => {
      if (res.token) {
        localStorage.setItem("authToken", res.token);
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Input name="email" placeholder="Введите email" />
        <Input name="username" placeholder="Введите username" />
        <Input name="password" placeholder="Введите пароль" type="password" />
        <Button type="submit">Зарегистрироваться</Button>
      </form>
    </div>
  );
}
