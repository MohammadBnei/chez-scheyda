import { useState } from "react"

import { Elements } from "@stripe/react-stripe-js"
import Form from "./Form"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

export default function Container() {
  const [clientSecret, setClientSecret] = useState()

  // TODO set clientSecret

  return (
    <div>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <Form clientSecret={clientSecret} cartId={cartId} />
        </Elements>
      )}
    </div>
  )
}
