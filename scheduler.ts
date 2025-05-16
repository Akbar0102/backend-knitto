import schedule from "node-schedule"
import productController from "./src/controllers/product.controller"

export default {
  jobRestockProduct() {
    // Restocking produk setiap hari Minggu jam 04:00 pagi
    console.log(`Job restock product start with timing 0 4 * * 0`)
    schedule.scheduleJob('0 4 * * 0', async () => {
      await productController.restockAllProducts()
    })
  }
}