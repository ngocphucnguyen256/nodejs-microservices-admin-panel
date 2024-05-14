import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('text', { nullable: true })
  description: string
}
