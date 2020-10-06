import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Liana',
    email: 'liana@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
  {
    name: 'Andre',
    email: 'andre@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  }
]

export default users