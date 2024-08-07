import React from "react"
import Confetti from "react-confetti"
import { Link, useSearchParams } from "react-router-dom"
import useWindowSize from "react-use/lib/useWindowSize"
const PaymentResult = () => {
  const { width, height } = useWindowSize()
  const [searchParams] = useSearchParams()
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center flex-col gap-2 items-center">
      {searchParams.get("success") && (
        <Confetti width={width} height={height} />
      )}
      {searchParams.get("success") ? (
        <img src="/dolar.gif" alt="" className="w-80 h-80 object-cover" />
      ) : (
        <img src="/404.svg" alt="" className="w-80 h-80 object-cover" />
      )}
      <p className="text-2xl">{searchParams.get("message")}</p>
      <Link className="text-emerald-700 font-bold hover:underline" to="/">
        Quay lại
      </Link>
    </div>
  )
}

export default PaymentResult
