import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const PageLoader = () => {
  return (
    <div
      className="flex items-center justify-center w-full h-full min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
    </div>
  );
};