import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { ImageContainer } from '@/styles/pages/success'
import { SuccessContainer } from '@/styles/pages/success'

interface SuccessProps {
  customerName: string
  product: {
    name: string
    imageURL: string
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Success | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <h1>Success! The transaction was successfull</h1>

        <ImageContainer>
          <Image
            src={product.imageURL}
            alt="Product image"
            width={120}
            height={110}
          />
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, your{' '}
          <strong>{product.name}</strong> it&apos;s already on the way!
        </p>

        <Link href="/">Back to the catalog</Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  })

  const customerName = session.customer_details?.name
  const product = session.line_items?.data[0].price?.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageURL: product.images[0],
      },
    },
  }
}
