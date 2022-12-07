import { Field, InputType } from "type-graphql";
import { Major } from "../../models/Major";
import { Category } from "../../models/Category";

@InputType()
export class CreateMajorInput implements Partial<Major> {
  @Field()
  public name!: string;

  @Field((_type) => [Category])
  public category!: Category;
}