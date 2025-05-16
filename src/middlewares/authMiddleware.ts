import { Response, NextFunction } from "express"
import { AuthRequest, verifyJwt } from "../helper/JwtUtil"

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  const isValid = verifyJwt(req, token)

  if (!isValid || !req.user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }

  next()
}

export default authMiddleware