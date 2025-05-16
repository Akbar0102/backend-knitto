import schedule from "node-schedule"
import productController from "./src/controllers/product.controller"

export default {
  // soal 5
  jobRestockProduct() {
    // Restocking product every Sunday at 04:00
    console.log(`Job restock product start with timing 0 4 * * 0`)
    schedule.scheduleJob('0 4 * * 0', async () => {
      await productController.restockAllProducts()
    })
  }
}