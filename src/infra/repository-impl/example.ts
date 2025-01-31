import { HelloWorld } from "@domain/entity/example";
import { HelloWorldRepository } from "@domain/repository/example";
import { HttpErr, HttpError } from "@domain/errors";
import { Result } from "@utils/result";
import { AxiosInstance, isAxiosError } from "axios";

export class HelloWorldRepositoryImpl implements HelloWorldRepository {
  private client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async helloWorldDetail(id: number): Promise<Result<HelloWorld, HttpErr>> {
    try {
      const url = `/hello-world/${id}`;
      const response = await this.client.get(url);
      if (response.status === 200) {
        return new Result<HelloWorld, HttpErr>({
          data: response.data,
          error: undefined,
        });
      } else if (response.status === 400) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.badRequest,
        });
      } else if (response.status === 401) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.unauthorized,
        });
      } else if (response.status === 404) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.notFound,
        });
      } else if (response.status === 500) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.internalError,
        });
      } else if (response.status === 503) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.serviceUnavailable,
        });
      } else {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    } catch (error: unknown) {
      if (!navigator.onLine) {
        // ネットワークエラーの場合
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.networkUnavailable,
        });
      } else if (
        isAxiosError(error) &&
        (error.code === "ECONNREFUSED" || // サーバーがダウン
          error.code === "ENOTFOUND" || // DNS 解決失敗
          error.message.includes("Network Error")) // CORS や DNS 失敗
      ) {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.serverUnreachable,
        });
      } else if (isAxiosError(error) && error.code === "ECONNABORTED") {
        // タイムアウトの場合（axiosのタイムアウトエラーの例）
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.timeout,
        });
      } else if (error instanceof SyntaxError) {
        // レスポンスのフォーマットが無効な場合
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.invalidResponseFormat,
        });
      } else {
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    }
  }
}
