import { Request, Response } from "express"
import axios from "axios"

const RAJA_ONGKIR_BASE_URL = process.env.RAJA_ONGKIR_BASE_URL as string
const RAJA_ONGKIR_API_DELIVERY = process.env.RAJA_ONGKIR_API_DELIVERY as string

interface ShippingOption {
  shipping_name: string
  service_name: string
  weight: number
  is_cod: boolean
  shipping_cost: number
  shipping_cashback: number
  shipping_cost_net: number
  grandtotal: number
  service_fee: number
  net_income: number
  etd: string
}

interface CalculateShippingResponse {
  meta: {
    message: string
    code: number
    status: string
  }
  data: {
    calculate_reguler: ShippingOption[]
    calculate_cargo: ShippingOption[]
    calculate_instant: ShippingOption[]
  }
}

export default {
  async calculateShipping(req: Request, res: Response) {
    try {
      const {
        shipper_destination_id,
        receiver_destination_id,
        weight,
        item_value
      } = req.query

      const response = await axios.get<CalculateShippingResponse>(
        RAJA_ONGKIR_BASE_URL + '/calculate',
        {
          params: {
            shipper_destination_id,
            receiver_destination_id,
            weight,
            item_value
          },
          headers: {
            'x-api-key': RAJA_ONGKIR_API_DELIVERY,
          }
        }
      )

      res.status(200).json({
        message: 'Shipping cost retrieved successfully',
        data: response.data.data,
      })

    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Server error" })
      }
    }
  }
}