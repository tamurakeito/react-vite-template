import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/domain/entity/auth";
import { AuthRepository } from "@/domain/repository/auth";
import { client } from "@/infra/axios";
import { HttpErr, HttpError } from "@/domain/errors";
import { Result } from "@/utils/result";

export class AuthRepositoryImpl implements AuthRepository {
  async signIn(data: SignInRequest): Promise<Result<SignInResponse, HttpErr>> {
    try {
      const url = "/sign-in";
      const response = await client.post(url, data);
      if (response.status === 200) {
        return new Result<SignInResponse, HttpErr>({
          data: response.data,
          error: undefined,
        });
      } else if (response.status === 400) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.badRequest,
        });
      } else if (response.status === 404) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.notFound,
        });
      } else if (response.status === 500) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.internalError,
        });
      } else if (response.status === 503) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.serviceUnavailable,
        });
      } else {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        // ネットワークエラーの場合
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.networkUnavailable,
        });
      } else if (error.code === "ECONNABORTED") {
        // タイムアウトの場合（axiosのタイムアウトエラーの例）
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.timeout,
        });
      } else if (error instanceof SyntaxError) {
        // レスポンスのフォーマットが無効な場合
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.invalidResponseFormat,
        });
      } else {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    }
  }
  async signUp(data: SignUpRequest): Promise<Result<SignUpResponse, HttpErr>> {
    try {
      const url = "/sign-up";
      const response = await client.post(url, data);
      if (response.status === 200) {
        return new Result<SignInResponse, HttpErr>({
          data: response.data,
          error: undefined,
        });
      } else if (response.status === 400) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.badRequest,
        });
      } else if (response.status === 409) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.conflict,
        });
      } else if (response.status === 500) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.internalError,
        });
      } else if (response.status === 503) {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.serviceUnavailable,
        });
      } else {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("Network Error")) {
        // ネットワークエラーの場合
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.networkUnavailable,
        });
      } else if (error.code === "ECONNABORTED") {
        // タイムアウトの場合（axiosのタイムアウトエラーの例）
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.timeout,
        });
      } else if (error instanceof SyntaxError) {
        // レスポンスのフォーマットが無効な場合
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.invalidResponseFormat,
        });
      } else {
        return new Result<SignInResponse, HttpErr>({
          data: undefined,
          error: HttpError.unknownError,
        });
      }
    }
  }
}
