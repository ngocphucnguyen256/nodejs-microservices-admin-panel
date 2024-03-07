import bcrypt from 'bcryptjs'

const passwordHashSync = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export default passwordHashSync
