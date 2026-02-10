"use client";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { SubmitEvent } from "react";
import { apiClient } from "@/lib/api-client";

export default function SignUpPage() {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    console.log("Sending data:", data);
    // console.log("handleSubmit");
    // apiClient.post("api/auth/signup", {}).then(res => console.log(res));
    // apiClient
    //   .get("/api/users")
    //   .then((response) => console.log("response", response));
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <Input name="email" placeholder="Введите email" />
        <Input name="username" placeholder="Введите username" />
        <Input name="password" placeholder="Введите пароль" type="password" />
        <Button>Зарегистрироваться</Button>
      </form>
    </div>
  );
}
