import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import ChatRoomUser from './ChatRoomUser'

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

  @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.user)
  chatRoomUsers: ChatRoomUser[]
}
