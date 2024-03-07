import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import User from './User'
import ChatRoom from './ChatRoom'

export enum MessagesStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  DELETED = 'deleted'
}

@Entity('messages')
export default class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: MessagesStatus,
    default: MessagesStatus.SENT
  })
  status: MessagesStatus

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User

  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom

  @Column('text')
  content: string

  @CreateDateColumn()
  createdAt: string
}
