import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type DeleteSearchButtonProps = {
  searchId: number;
  onConfirm: () => void;
};

export const DeleteSearchButton = ({ searchId, onConfirm }: DeleteSearchButtonProps) => {
  return (
    <Popconfirm
      title="Удалить поиск"
      description="Вы уверены, что хотите удалить этот поиск?"
      onConfirm={onConfirm}
      okText="Да"
      cancelText="Отмена"
    >
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        size="small"
      />
    </Popconfirm>
  );
};
