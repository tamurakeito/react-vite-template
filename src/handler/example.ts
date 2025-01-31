import { HelloWorld } from "@/domain/entity/example";
import { HttpErr } from "@/domain/errors";
import { HelloWorldRepository } from "@/domain/repository/example";
import { Result } from "@/utils/result";

export class HelloWorldHandler {
  private repository: HelloWorldRepository;
  constructor(repository: HelloWorldRepository) {
    this.repository = repository;
  }

  async helloWorldDetail(id: number): Promise<Result<HelloWorld, HttpErr>> {
    return this.repository.helloWorldDetail(id);
  }
}
