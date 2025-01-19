import toast from "react-hot-toast";

export const handleUnexpectedError = () => {
  toast.error("システムに予期しないエラーが発生しました", { duration: 1000 });
  return;
};
