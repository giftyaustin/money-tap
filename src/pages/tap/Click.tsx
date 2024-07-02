import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const Click = () => {
  const [coinsToDisplay, setCoinsToDisplay] = useState(346);
  const [clickCount, setClickCount] = useState(0);


  const handleClick = ()=>{
    setClickCount(prev=>prev+1)
  }
  useEffect(() => {
      setCoinsToDisplay(prev=> prev + 1)
  }, [clickCount])
  return (
    <section className="flex flex-col gap-y-4 items-center justify-center mt-4">
      {/* Coins are displayed here */}
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="flex gap-x-2 items-center">
          <PYCCoinIcon />
          <span className="text-4xl font-bold">{coinsToDisplay}</span>
        </div>
        <Level />
      </div>

      {/* Clicking happens here */}
      <div className="flex justify-center w-full">
        <div className="w-fit border" onClick={handleClick}>
          <img src="/assets/tap-globe.png" alt="" className="w-96 shadow-2xl" />
        </div>
      </div>
    </section>
  );
};

export default Click;

const Level = () => {
  return (
    <div className="border border-gray-200 rounded-md bg-blue-900 text-xs px-4 py-2">
      <span>Level 1:</span>
      <span>Intern</span>
    </div>
  );
};

// ICons
type PYCCoinIconProps = {
  className?: string;
};
export const PYCCoinIcon = (props: PYCCoinIconProps) => {
  return (
    <img
      src="/logos/pyc-coin.png"
      className={cn(`w-12 aspect-square rounded-full`, props.className)}
      alt=""
    />
  );
};
