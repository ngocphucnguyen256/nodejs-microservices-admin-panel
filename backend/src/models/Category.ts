import { Field, ObjectType } from "type-graphql";

import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  
  import { Major } from "./Major";

  @ObjectType()
  @Entity()
  export class Category {
    @Field((_type) => Number)
    @PrimaryGeneratedColumn()
    public readonly id!: number;
  
    @Field()
    @Column({ type: "boolean" })
    public active: boolean = false;
  
    @Field()
    @Column({ type: "varchar" })
    public name!: string
  
    @Field()
    @CreateDateColumn()
    public createdAt!: Date;
  
    @Field()
    @UpdateDateColumn()
    public updatedAt!: Date;

    @Field((_type) => [Major])
    @OneToMany((_type) => Major, (major: Major) => major.category)
    public major?: Major[];
  }