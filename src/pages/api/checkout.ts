import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { priceId } = req.body

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!priceId) {
    return res.status(400).json({ error: 'Price not found.' })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_URL}/success`,
    cancel_url: `${process.env.NEXT_URL}/`,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  })

  return res.status(201).json({
    checkoutURL: checkoutSession.url,
  })
}
