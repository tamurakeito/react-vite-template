import { HelloWorldRepository } from "@/domain/repository/example";
import { HelloWorldHandler } from "@/handler/example";
import { client } from "@/infra/axios";
import { HelloWorldRepositoryImpl } from "@/infra/repository-impl/example";

export class HelloWorldInjector {
  static injectHelloRepository(): HelloWorldRepository {
    return new HelloWorldRepositoryImpl(client);
  }

  static injectHelloWorldHandler(): HelloWorldHandler {
    const repository = this.injectHelloRepository();
    return new HelloWorldHandler(repository);
  }
}
