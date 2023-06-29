import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

// la de la izquierda la envia el user
// la de la derecha es la que existe en la base de datos
export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

const password = "coderhouse"
const cryp = createHash(password)
//console.log(createHash(password))

console.log(validatePassword(password, cryp))