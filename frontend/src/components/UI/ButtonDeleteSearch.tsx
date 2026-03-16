import { Button, Popconfirm } from "antd";

type ButtonDeleteSearchProps = {
  userId: number;
  searchId: number;
  title: string;
  onConfirm: () => void;
};

export const ButtonDeleteSearch = ({ userId, searchId, title, onConfirm }: ButtonDeleteSearchProps) => {
  return (
    <Popconfirm
      title="Удалить поиск"
      description={`Вы уверены, что хотите удалить "${title}"?`}
      onConfirm={onConfirm}
      okText="Да"
      cancelText="Отмена"
    >
      <Button type="text" danger className="w-full text-left">
        Удалить
      </Button>
    </Popconfirm>
  );
};
