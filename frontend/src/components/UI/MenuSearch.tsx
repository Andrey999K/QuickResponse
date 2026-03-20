import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { MoreVertical } from "@deemlol/next-icons";
import { ButtonDeleteSearch } from "@/components/UI/ButtonDeleteSearch";

type MenuSearchProps = {
  userId: number;
  searchId: number;
  title: string;
  onDelete: (searchId: number) => void;
};

export const MenuSearch = ({ userId, searchId, title, onDelete }: MenuSearchProps) => {
  const handleDelete = () => {
    onDelete(searchId);
  };

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
    {
      label: (
        <ButtonDeleteSearch
          userId={userId}
          searchId={searchId}
          title={title}
          onConfirm={handleDelete}
        />
      ),
      key: "2",
    },
  ];

  return (
    <div className="cursor-pointer">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <MoreVertical size={24} />
      </Dropdown>
    </div>
  );
};
