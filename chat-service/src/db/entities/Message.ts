import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import ChatRoom from './ChatRoom'
import User from './User'

export enum MessagesStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  DELETED = 'deleted'
}

@Entity()
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
  user: User

  @ManyToOne(() => ChatRoom, (chatRoom: ChatRoom) => chatRoom.messages)
  chatRoom: ChatRoom

  @Column('text')
  content: string

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
