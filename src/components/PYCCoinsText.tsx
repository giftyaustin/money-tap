import { cn } from '@/lib/utils'
import { PYCCoinIcon } from '@/pages/tap/Click'
import React from 'react'
type PYCTokensTextProps = {
    tokens: number,
    imageClassName?: string
    textClassName?: string
}
const PYCCoinsText = (props: PYCTokensTextProps) => {
  return (
    <div className="flex gap-x-1 items-center text-yellow-p mt-1">
    <PYCCoinIcon className={cn(`w-3`,props.imageClassName)}/>
    <div className={cn(`text-xs font-bold`,props.textClassName)}>
      +<span >{props.tokens}</span>
    </div>
  </div>
  )
}

export default PYCCoinsText