import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { getFromContainer, MetadataStorage } from 'class-validator'

// Ensure the Message class is loaded
import '../db/entities/User'

// Generate the schemas
const schemas = validationMetadatasToSchemas()

export const userSchema = schemas.User
