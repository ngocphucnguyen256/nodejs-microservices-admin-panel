import { Arg, Mutation, Resolver } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { MajorRepository } from "../../repositories/MajorRepository";

import { Major } from "../../models/Major";
import { CreateMajorInput } from "./CreateMajorInput";

@Resolver((_type) => Major)
export class CreateMajor {
  @Mutation((_type) => Major)
  public async createMajor(
    @Arg("data") inputData: CreateMajorInput
  ): Promise<Major> {
    const majorRepository = getCustomRepository(MajorRepository);
    const major = majorRepository.create({
      name: inputData.name,
      category: inputData.category,
    });

    await majorRepository.save(major);
    return major;
  }
}