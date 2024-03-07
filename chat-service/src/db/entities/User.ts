import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import ChatRoom from './ChatRoom'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Column({ unique: true })
  username: string

  @Column()
  email: string

  @Column()
  lastSeen: Date

  @ManyToMany(() => ChatRoom, (chatRoom) => chatRoom.users)
  chatRooms: ChatRoom[]
}
