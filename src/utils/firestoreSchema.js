const orderSchema = {
  items: [
    {
      id: String,
      name: String,
      price: Number,
      finalPrice: Number,
      quantity: Number,
      customizations: {
        // Dynamic object based on selected options
        option_category: {
          name: String,
          price: Number
        }
      }
    }
  ],
  restaurantName: String,
  restaurantId: String,
  total: Number,
  status: String, // "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"
  createdAt: Timestamp,
  orderNumber: String,
  userDetails: {
    name: String,
    phone: String,
    address: String,
    message: String
  },
  userId: String, // If user is authenticated
  paymentStatus: String, // "pending", "paid", "failed"
  paymentMethod: String, // "cash", "card", etc.
}
