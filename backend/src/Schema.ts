import { buildSchema } from "type-graphql";

import { CreateCategory } from "./modules/category/CreateCategory";
import { GetCategories } from "./modules/category/GetCategories";
import {CreateMajor} from "./modules/major/CreateMajor";
import {GetMajors} from "./modules/major/GetMajors";

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [CreateCategory, GetCategories, CreateMajor, GetMajors],
  });
};