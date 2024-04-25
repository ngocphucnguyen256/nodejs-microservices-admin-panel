declare namespace Express {
  // must be namespace, and not declare module "Express" {
  export interface Request {
    user: any
  }
  interface User {
    id: string // Assuming 'id' is a string
    // Add other properties that your User entity has and are used in your application
    username?: string
    email?: string
  }
}
