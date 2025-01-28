import { HelloWorld } from "@/domain/entity/example";
import { HttpErr } from "@/domain/errors";
import type { HelloWorldRepository } from "@/domain/repository/example";
import { Result } from "@/utils/result";
import { injectable, inject } from "tsyringe";

@injectable()
export class HelloWorldUsecase {
  constructor(
    @inject("HelloWorldRepository")
    private helloWorldRepository: HelloWorldRepository
  ) {}

  async fetchHelloWorldDetail(
    id: number
  ): Promise<Result<HelloWorld, HttpErr>> {
    return await this.helloWorldRepository.helloWorldDetail(id);
  }
}
