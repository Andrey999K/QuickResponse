import { Button } from "antd";
import Link from "next/link";

type AuthButtonProps = {
  text?: string;
  primary?: boolean;
  arrow?: boolean;
};

export const AuthButton = async ({
  text,
  primary = true,
  arrow,
}: AuthButtonProps) => {
  // const user = await getCurrentUser();
  const user = null;
  const textButton = text || (user ? "Перейти к откликам" : "Войти");

  return (
    <>
      <Link href={"/login"}>
        {/*<Link href={"/dashboard/search"}>*/}
        {/*<Link href={user ? "/dashboard/search" : generateAuthUrl()}>*/}
        <Button
          type={primary ? "primary" : "default"}
          className="!font-semibold"
          size="large"
        >
          {textButton}
          {arrow && <span className="text-2xl"> &rarr;</span>}
        </Button>
      </Link>
    </>
  );
};
