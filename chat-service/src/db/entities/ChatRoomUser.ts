import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('chat_room_users')
export default class ChatRoomUser {
  @PrimaryColumn()
  chatRoomId: string

  @PrimaryColumn()
  userId: string // Assuming user IDs are UUIDs or strings

  // Additional fields like joinedAt can be added here
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date
}
