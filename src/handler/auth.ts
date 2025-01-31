import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/domain/entity/auth";
import { HttpErr } from "@/domain/errors";
import { AuthRepository } from "@/domain/repository/auth";
import { Result } from "@/utils/result";

export class AuthHandler {
  private repository: AuthRepository;
  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async signIn(data: SignInRequest): Promise<Result<SignInResponse, HttpErr>> {
    return this.repository.signIn(data);
  }

  async signUp(data: SignUpRequest): Promise<Result<SignUpResponse, HttpErr>> {
    return this.repository.signUp(data);
  }
}
