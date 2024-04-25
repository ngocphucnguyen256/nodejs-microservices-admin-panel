import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  googleId: string

  @Column()
  @Column({ unique: true })
  username: string

  @Column({ select: false, nullable: true })
  passwordHash: string

  @Column({ unique: true })
  email: string

  @CreateDateColumn()
  createdAt: string

  @Column({ type: 'longblob', nullable: true, select: false })
  avatar: Buffer
}
