import { EntityRepository, Repository } from "typeorm";
import { Major } from "../models/Major";

@EntityRepository(Major)
export class MajorRepository extends Repository<Major> {}