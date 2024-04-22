import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import Message from './Message'

@Entity()
export default class ChatRoom {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
