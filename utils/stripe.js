import Stripe from "stripe"

const key = "sk_test_51RLoYKPufkxpdRkozkqjz4EGU8ksfMsLKmSR2La6svJz7KYTV5LnCbqqfxm4RdBZTBAcVpLLkO5lXeAQdUa6zg9h008Qf5PSeQ"

export const stripe = new Stripe(key)