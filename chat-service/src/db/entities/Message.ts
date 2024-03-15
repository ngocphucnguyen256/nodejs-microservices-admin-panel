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

  @Column('uuid')
  senderId: string

  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom

  @Column('text')
  content: string

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
