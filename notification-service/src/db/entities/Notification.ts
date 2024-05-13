import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm'
import User from './User'
import Service from './Service'

export enum StatusTypes {
  READ = 'read',
  UNREAD = 'unread'
}

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Service)
  service: Service

  @Column({
    type: 'enum',
    enum: StatusTypes,
    default: StatusTypes.UNREAD
  })
  status: StatusTypes

  @Column('text')
  payload: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
