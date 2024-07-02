import React from 'react'
type PYCTokensTextProps = {
    tokens: number
}
const PYCTokensText = (props: PYCTokensTextProps) => {
  return (
    <div className="flex gap-x-1 items-center text-xs mt-1">
    <img src="/assets/pyc-token.png" className="w-4 pb-[2px]" alt="" />
    <span className="text-yellow-d font-semibold">
      <span>{props.tokens}</span> PYC
    </span>
  </div>
  )
}

export default PYCTokensText