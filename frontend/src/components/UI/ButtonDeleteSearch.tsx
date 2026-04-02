import { Button, Popconfirm } from "antd";

type ButtonDeleteSearchProps = {
  title: string;
  onConfirm: () => void;
};

export const ButtonDeleteSearch = ({ title, onConfirm }: ButtonDeleteSearchProps) => {
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
