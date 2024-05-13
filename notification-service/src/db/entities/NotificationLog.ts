import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne
} from 'typeorm'
import Notification from './Notification'

export enum ChangeTypes {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

@Entity()
export default class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Notification)
  notification: Notification

  @Column({
    type: 'enum',
    enum: ChangeTypes,
    nullable: true
  })
  changeType: ChangeTypes

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
