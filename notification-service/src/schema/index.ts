import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { getFromContainer, MetadataStorage } from 'class-validator'

// Ensure the Message class is loaded
import '../db/entities/Notification'
import '../db/entities/NotificationLog'
import '../db/entities/Service'
import '../db/entities/User'

// Generate the schemas
const schemas = validationMetadatasToSchemas()

export const notificationSchema = schemas.Notification
export const notificationLogSchema = schemas.NotificationLog
export const serviceSchema = schemas.Service
export const userSchema = schemas.User
