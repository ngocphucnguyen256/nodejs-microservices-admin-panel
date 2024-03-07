import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn
} from 'typeorm'
import User from './User'

@Entity('chat_rooms')
export default class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  name: string

  @ManyToMany(() => User)
  @JoinTable({
    name: 'chat_room_users', // Table name for the join table
    joinColumn: {
      name: 'chat_room_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  users: User[]

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
