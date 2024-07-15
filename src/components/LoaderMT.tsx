import { cn } from '@/lib/utils'
import { Loader2Icon, LoaderPinwheel, LucideLoader } from 'lucide-react'
import React from 'react'
import { LoaderIcon } from 'react-hot-toast'
type LoaderMTProps = {
    iconClassName?:string
    wrapperClassName?:string
}
const LoaderMT = (props:LoaderMTProps) => {
  return (
    <div className={cn('grid place-items-center h-screen',props.wrapperClassName,{

    })}>
        <span className='animate-spin'>
            <LucideLoader className={cn('w-10 h-10',props.iconClassName)}/>
        </span>
    </div>
  )
}

export default LoaderMT