import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Column({ unique: true })
  username: string

  @Column({ select: false })
  passwordHash: string

  @Column({ unique: true })
  email: string

  @CreateDateColumn()
  createdAt: string
}
