import { HttpErr } from "@/domain/errors";
import { HelloWorld } from "@/domain/entity/example";
import { Result } from "@/utils/result";

export interface HelloWorldRepository {
  helloWorldDetail(id: number): Promise<Result<HelloWorld, HttpErr>>;
}
