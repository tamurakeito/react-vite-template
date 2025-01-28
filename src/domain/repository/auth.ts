import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/domain/entity/auth";
import { Result } from "@/utils/result";
import { HttpErr } from "@/domain/errors";

export interface AuthRepository {
  signIn(data: SignInRequest): Promise<Result<SignInResponse, HttpErr>>;
  signUp(data: SignUpRequest): Promise<Result<SignUpResponse, HttpErr>>;
}
