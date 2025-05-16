import { Request } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
  }
}

export const verifyJwt = (req: AuthRequest, token: string): boolean => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = {
      id: decoded.data,
      email: decoded.email
    }

    return true
  } catch (error) {
    return false
  }
}

export const createJwtToken = (id: number, email: string): string => {
  return jwt.sign(
    {
      data: id,
      email,
    },
    secret,
    { expiresIn: '1h' }
  )
}