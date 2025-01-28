import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/domain/entity/auth";
import { HttpErr } from "@/domain/errors";
import type { AuthRepository } from "@/domain/repository/auth";
import { Result } from "@/utils/result";
import { injectable, inject } from "tsyringe";

@injectable()
export class AuthUsecase {
  constructor(
    @inject("AuthRepository")
    private authRepository: AuthRepository
  ) {}

  async signIn(req: SignInRequest): Promise<Result<SignInResponse, HttpErr>> {
    return await this.authRepository.signIn(req);
  }

  async signUp(req: SignUpRequest): Promise<Result<SignUpResponse, HttpErr>> {
    return await this.authRepository.signUp(req);
  }
}
