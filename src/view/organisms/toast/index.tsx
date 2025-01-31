import toast, { Toaster } from "react-hot-toast";

export const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        // 全体のスタイル
        style: {
          background: "#333",
          color: "#fff",
        },
        // 成功メッセージのスタイル
        success: {
          style: {
            background: "cadetblue",
            color: "white",
          },
          iconTheme: {
            primary: "white",
            secondary: "cadetblue",
          },
        },
        // エラーメッセージのスタイル
        error: {
          style: {
            background: "crimson",
            color: "white",
          },
          iconTheme: {
            primary: "white",
            secondary: "crimson",
          },
        },
      }}
    />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const setToast = (message: string, type?: ToastTypes) => {
  switch (type) {
    case toastTypes.success:
      toast.success(message, { duration: 1000 });
      return;
    case toastTypes.error:
      toast.error(message, { duration: 1000 });
      return;
    default:
      toast(message, { duration: 1000 });
      return;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const toastTypes = {
  default: "default",
  success: "success",
  error: "error",
} as const;
export type ToastTypes = (typeof toastTypes)[keyof typeof toastTypes];
