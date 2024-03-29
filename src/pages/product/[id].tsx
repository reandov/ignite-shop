import { useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Stripe from 'stripe'
import axios from 'axios'

import { stripe } from '@/lib/stripe'

import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '@/styles/pages/product'

interface ProductProps {
  product: {
    id: string
    name: string
    imageURL: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post<{ checkoutURL: string }>(
        '/api/checkout',
        {
          priceId: product.defaultPriceId,
        }
      )

      const { checkoutURL } = response.data

      window.location.href = checkoutURL
    } catch (error) {
      setIsCreatingCheckoutSession(false)
      alert('Failed while redirecting to checkout page.')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageURL}
            width={520}
            height={480}
            alt="Product image"
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyProduct}
          >
            Buy now
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params!!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageURL: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount!! / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 24,
  }
}
