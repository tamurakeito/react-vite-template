import { AuthRepository } from "@domain/repository/auth";
import { AuthHandler } from "@handler/auth";
import { client } from "@infra/axios";
import { AuthRepositoryImpl } from "@infra/repository-impl/auth";

export class AuthInjector {
  static injectAuthRepository(): AuthRepository {
    return new AuthRepositoryImpl(client);
  }

  static injectAuthHandler(): AuthHandler {
    const repository = this.injectAuthRepository();
    return new AuthHandler(repository);
  }
}
