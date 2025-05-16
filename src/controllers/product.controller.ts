import { Request, Response } from "express"
import db from "../helper/DBUtil"

export default {
  async stockReport(req: Request, res: Response) {
    try {
      const stockReport = await db.any(`
      select 
        id,
        name,
        price,
        stock,
        (price * stock) AS total_value
      from products
      order by name ASC
    `)

      res.status(200).json({ message: 'Product stock report retrieved successfully', data: stockReport })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  },
  // scheduler restock
  async restockAllProducts(): Promise<void> {
    try {
      const result = await db.result(`
        UPDATE products
        SET stock = stock + 10
      `)
      console.log(`[${new Date().toLocaleString('id-ID')}] Restocked ${result.rowCount} products.`)
    } catch (err) {
      console.error("Failed to restock products:", err)
    }
  }
}