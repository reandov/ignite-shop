import { ImageContainer } from '@/styles/pages/success'
import { SuccessContainer } from '@/styles/pages/success'
import Link from 'next/link'

export default function Success() {
  return (
    <SuccessContainer>
      <h1>Success! The transaction was successfull</h1>

      <ImageContainer></ImageContainer>

      <p>
        Uhuul <strong>John Doe</strong>, your <strong>Product X</strong>{' '}
        it&apos;s already on the way!
      </p>

      <Link href="/">Back to the catalog</Link>
    </SuccessContainer>
  )
}
