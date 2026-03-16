import { Button } from "antd";
import Link from "next/link";

export const CreateSearchButton = () => {
  return (
    <Link href={"/dashboard/search/create"}>
      <Button size="large" type="primary">
        Создать поиск
      </Button>
    </Link>
  );
};
