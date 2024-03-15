import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn } from 'typeorm'

import ChatRoomUser from './ChatRoomUser'

@Entity('chat_rooms')
export default class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  name: string

  @OneToMany(() => ChatRoomUser, (chatRoomUser: ChatRoomUser) => chatRoomUser.chatRoomId)
  chatRoomUsers: ChatRoomUser[]

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
