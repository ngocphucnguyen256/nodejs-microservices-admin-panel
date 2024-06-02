export class EntityNotFoundException extends Error {
  constructor(entity = 'Entity not found') {
    super(entity)
    this.name = 'EntityNotFoundException'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class UnauthorizedException extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedException'
    Error.captureStackTrace(this, this.constructor)
  }
}
