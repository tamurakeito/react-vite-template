import { HelloWorld } from "@/domain/entity/example";
import { HelloWorldRepository } from "@/domain/repository/example";
import { HttpErr, HttpError } from "@/domain/errors";
import { Result } from "@/utils/result";
import { client } from "@/infra/axios";

export class HelloWorldRepositoryImpl implements HelloWorldRepository {
  async helloWorldDetail(id: number): Promise<Result<HelloWorld, HttpErr>> {
    try {
      const url = `/hello-world/${id}`;
      const response = await client.get(url);
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
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        // ネットワークエラーの場合
        return new Result<HelloWorld, HttpErr>({
          data: undefined,
          error: HttpError.networkUnavailable,
        });
      } else if (error.code === "ECONNABORTED") {
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
