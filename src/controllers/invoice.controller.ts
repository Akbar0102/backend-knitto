import { NextFunction, Request, Response } from "express"
import db from "../helper/DBUtil"

export default {
  async generateInvoice(req: Request, res: Response) {
    try {
      const { customer_name } = req.body
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '')

      const result = await db.tx(async tx => {
        const counter = await tx.oneOrNone(
          `SELECT * FROM invoice_counters WHERE invoice_date = $1 FOR UPDATE`,
          [today]
        )

        let nextNumber: number

        if (counter) {
          nextNumber = counter.last_number + 1
          await tx.none(
            `UPDATE invoice_counters SET last_number = $1 WHERE invoice_date = $2`,
            [nextNumber, today]
          )
        } else {
          nextNumber = 1
          await tx.none(
            `INSERT INTO invoice_counters (invoice_date, last_number) VALUES ($1, $2)`,
            [today, nextNumber]
          )
        }

        const runningNumber = nextNumber.toString().padStart(4, '0')
        const code = `INV-${today}-${runningNumber}`

        await tx.none(
          `INSERT INTO invoices (code, customer_name) VALUES ($1, $2)`,
          [code, customer_name]
        )

        return code
      })
      res.status(200).json({ message: 'Invoice created', data: result })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  },
}