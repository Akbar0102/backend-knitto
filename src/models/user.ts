import db from "../helper/DBUtil"

const searchQuery = (withPassword = false) => {
  let query =
    ' select  ' +
    '   u.id,  ' +
    '   u.name,  '

  if (withPassword) {
    query += '  u.password,  '
  }

  query +=
    '   u.email  ' +
    ' from users u ' +
    ' where 1=1 '

  return query
}

export default {
  async createUser(param: object) {
    let query = `
      insert into users (name, email, password)
      values (\${name}, \${email}, \${password})
      returning id, email, name
    `

    return await db.one(query, param)
  },
  async getOneUserCaseInsensitive(param: object) {
    let query = searchQuery(true)
    query += ` and lower(u.email) = lower(\${email}) `

    return await db.oneOrNone(query, param)
  }
}