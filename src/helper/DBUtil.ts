import pgPromise from 'pg-promise'

const pgp = pgPromise({
  schema: ['public'],
})

const opt = {
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string
}

const db = pgp(opt)

export default db