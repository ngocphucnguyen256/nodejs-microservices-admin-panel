import { Resolver, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Major } from "../../models/Major";
import { MajorRepository } from "../../repositories/MajorRepository";

@Resolver((_type) => Major)
export class GetMajors {
  constructor(
    @InjectRepository()
    private readonly MajorRepository: MajorRepository
  ) {}

  @Query((_type) => [Major])
  public async getMajor(): Promise<Major[]> {
    const major = await this.MajorRepository.find();

    return major;
  }
}