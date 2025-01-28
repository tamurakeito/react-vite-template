import axios from "axios";
import { tokenStorageKey } from "@/view/hooks/useLocalStrage";

export const client = axios.create({
  // baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
  baseURL: "http://localhost:3004",
  timeout: 15000,
});

// トークンをインターセプターで設定
client.interceptors.request.use(
  (config) => {
    // カスタムプロパティを確認
    if (config.headers && config.headers["Add-Authorization"] === "true") {
      // const token = localStorage.getItem(tokenStorageKey);
      const token = localStorage
        .getItem(tokenStorageKey)
        ?.replace(/^"|"$/g, "");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Requires-Auth"] = "true";
      }
      // カスタムプロパティを削除（不要なヘッダーを送らないように）
      delete config.headers["Add-Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプターでJWTエラーを共通ハンドリング
client.interceptors.response.use(
  (response) => {
    // 正常なレスポンスはそのまま返す
    return response;
  },
  (error) => {
    // // エラーレスポンスのデータを確認してJWTエラーハンドリング
    // if (
    //   error.config &&
    //   error.config.headers &&
    //   error.config.headers["Requires-Auth"] === "true" &&
    //   error.response &&
    //   error.response.data &&
    //   error.response.data.message === "invalid or expired jwt"
    // ) {
    //   console.error("Token is invalid or expired.");
    //   // ここで必要な処理を追加（例: ログアウト、リダイレクト、通知の表示など）
    //   alert("Your session has expired. Please log in again.");
    //   localStorage.removeItem(tokenStorageKey); // ログアウトの例としてトークンを削除

    //   // 例えば、ログインページへのリダイレクト
    //   window.location.href = "/sign-in";
    // }

    // 他のエラーはそのまま返す
    return Promise.reject(error);
  }
);
