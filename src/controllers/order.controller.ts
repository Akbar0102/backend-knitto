import { Request, Response } from "express"
import db from "../helper/DBUtil"

export default {
  async createOrder(req: Request, res: Response) {
    try {
      const { customer_id, items } = req.body

      const result = await db.tx(async (tx) => {
        let totalAmount = 0

        for (const item of items) {
          const product = await tx.one(
            `select price from products where id = $1`,
            [item.id]
          )
          totalAmount += product.price * item.qty
        }

        const order = await tx.one(
          `insert into orders (customer_id, total_amount, created_at) values ($1, $2, now()) returning id`,
          [customer_id, totalAmount]
        )

        for (const item of items) {
          await tx.none(
            `insert into order_items (order_id, product_id, quantity) values ($1, $2, $3)`,
            [order.id, item.id, item.qty]
          )

          await tx.none(
            `update products set stock = stock - $1 where id = $2`,
            [item.qty, item.id]
          )
        }

        return { orderId: order.id, totalAmount }
      })

      res.status(200).json({ message: 'Order created successfully', data: result })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  }
}