import { stripe } from "../../utils/stripe"


export const subscribeAction = async({userId}) => {
    const {url} = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: "price_1RLsHjPufkxpdRkoDdiBp1Sc",
                quantity: 1
            }
        ],
        metadata: {
            userId
        },
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_URL}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}`
    })

    return url
}