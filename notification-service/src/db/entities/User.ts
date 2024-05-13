import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm'

export enum referenceTypes {
  push = 'push',
  chat = 'email',
  all = 'all'
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Column({ unique: true })
  username: string

  @Column()
  email: string

  @Column({ type: 'blob', nullable: true })
  avatar: Buffer

  @Column({
    type: 'enum',
    enum: referenceTypes,
    default: referenceTypes.push
  })
  reference: referenceTypes

  @Column({ nullable: true })
  lastSeen: Date
}
