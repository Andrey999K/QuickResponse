"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";

type AuthButtonProps = {
  text?: string;
  primary?: boolean;
  arrow?: boolean;
};

export const AuthButton = ({
                             text,
                             primary = true,
                             arrow,
                           }: AuthButtonProps) => {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const handleClick = () => {
    if (user) {
      router.push("/dashboard/search");
    } else {
      router.push("/login");
    }
  };

  const buttonText = text || (user ? "Перейти к откликам" : "Войти");

  return (
    <Button
      type={primary ? "primary" : "default"}
      className="!font-semibold"
      size="large"
      onClick={handleClick}
      loading={loading}
    >
      {buttonText}
      {arrow && <span className="text-2xl"> &rarr;</span>}
    </Button>
  );
};
