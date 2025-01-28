import { AuthRepository } from "@/domain/repository/auth";
import { AuthRepositoryImpl } from "@/infra/repository_impl/auth";
import { HelloWorldRepository } from "@/domain/repository/example";
import { HelloWorldRepositoryImpl } from "@/infra/repository_impl/example";
import { container } from "tsyringe";

container.register<HelloWorldRepository>("HelloWorldRepository", {
  useClass: HelloWorldRepositoryImpl,
});

container.register<AuthRepository>("AuthRepository", {
  useClass: AuthRepositoryImpl,
});
