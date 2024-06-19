import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { getFromContainer, MetadataStorage } from 'class-validator'

// Ensure the Message class is loaded
import '../db/entities/Message'
import '../db/entities/ChatRoom'
import '../db/entities/User'
import '../db/entities/ChatRoomUser'

// Generate the schemas
const schemas = validationMetadatasToSchemas()

export const messageSchema = schemas.Message
export const chatRoomSchema = schemas.ChatRoom
export const userSchema = schemas.User
export const chatRoomUserSchema = schemas.ChatRoomUser
