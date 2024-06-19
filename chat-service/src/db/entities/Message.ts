import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { IsEnum, IsString, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
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
  @IsUUID()
  id: string

  @Column({
    type: 'enum',
    enum: MessagesStatus,
    default: MessagesStatus.SENT
  })
  @IsEnum(MessagesStatus)
  status: MessagesStatus

  @ManyToOne(() => User)
  @Type(() => User)
  user: User

  @ManyToOne(() => ChatRoom, (chatRoom: ChatRoom) => chatRoom.messages)
  @Type(() => ChatRoom)
  chatRoom: ChatRoom

  @Column('text')
  @IsString()
  content: string

  @UpdateDateColumn()
  @IsString()
  updatedAt: string

  @CreateDateColumn()
  @IsString()
  createdAt: string
}
