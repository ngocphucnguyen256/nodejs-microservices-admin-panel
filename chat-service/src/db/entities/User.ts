import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm'

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

  @Column({ nullable: true })
  lastSeen: Date
}
