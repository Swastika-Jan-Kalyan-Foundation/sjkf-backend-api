import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RZP_PROD_KEY_ID,
    key_secret: process.env.RZP_PROD_SECRET
})

export default razorpay