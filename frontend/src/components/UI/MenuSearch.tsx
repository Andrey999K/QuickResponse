import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { MoreVertical } from "@deemlol/next-icons";

type MenuSearchProps = {
  userId: number;
  searchId: number;
  title: string;
};

export const MenuSearch = ({ userId, searchId, title }: MenuSearchProps) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <Link href={{ pathname: `/dashboard/search/edit/${searchId}` }}>
          Редактировать
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
      key: "1",
    },
    // {
    //   label: (
    //     <ButtonDeleteSearch userId={userId} searchId={searchId} title={title} />
    //   ),
    //   key: "2",
    //   disabled: true,
    // },
  ];

  return (
    <Dropdown menu={{ items }} className="hover:cursor-pointer">
      <MoreVertical size={24} />
    </Dropdown>
  );
};
