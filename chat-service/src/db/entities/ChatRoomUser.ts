import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import ChatRoom from './ChatRoom'
import User from './User'

@Entity()
export default class ChatRoomUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date

  @ManyToOne(() => ChatRoom)
  chatRoom: ChatRoom

  @ManyToOne(() => User, (user) => user.chatRoomUsers)
  user: User

  @Column({ default: true })
  active: boolean
}
