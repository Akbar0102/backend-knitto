import { Request, Response } from "express"
import bcrypt from "bcrypt"
import user from "../models/user"
import { createJwtToken } from "../helper/JwtUtil"
import { google } from "googleapis"

const SALT_ROUNDS = 10

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.BASE_URL + '/api/v1/auth/google/callback'
)

export default {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' })
      }

      const existingUser = await user.getOneUserCaseInsensitive({ email })
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' })
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

      const savedUser = await user.createUser({
        name,
        email,
        password: hashedPassword,
      })

      res.status(201).json({
        message: 'User registered successfully',
        data: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const existingUser: any = await user.getOneUserCaseInsensitive({ email })
      if (!existingUser) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const passwordMatch = await bcrypt.compare(password, existingUser.password)

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // token
      const token = createJwtToken(existingUser.id, existingUser.email)

      res.status(200).json({
        message: 'Login successful',
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          token: token
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  },
  async loginOauth(req: Request, res: Response) {
    try {
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ]

      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
      })

      res.redirect(authorizationUrl)
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  },
  async loginOauthCallback(req: Request, res: Response) {
    try {
      const { code } = req.query
      const { tokens } = await oauth2Client.getToken(code as string)

      oauth2Client.setCredentials(tokens)

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      })

      const { data } = await oauth2.userinfo.get()

      if (!data.email || !data.name) {
        return res.status(200).json({
          message: "Oauth google",
          data: data
        })
      }

      const existingUser: any = await user.getOneUserCaseInsensitive({ email: data.email })
      if (!existingUser) {
        const savedUser = await user.createUser({
          name: data.name,
          email: data.email,
          password: null,
        })

        const token = createJwtToken(savedUser.id, savedUser.email)

        res.status(200).json({
          message: 'Login successful',
          data: {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            token: token
          },
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  }
}