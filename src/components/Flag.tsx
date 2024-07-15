import { cn } from '@/lib/utils';
import React from 'react'
import { Af, Fr, Gb, In, Us } from 'react-flags-select';
type FlagProps = {
    country: string
    className?: string
}
const Flag = (props: FlagProps) => {
  return(
    <img src={`/flags/${props.country}.png`} alt="" className='w-6' />
  )
}

export default Flag