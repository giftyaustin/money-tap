import { PYCCoinIcon } from "@/pages/tap/Click";
import React from "react";
type CoinsDisplayCardProps = {
  coins: number;
};
const CoinsDisplayCard = (props: CoinsDisplayCardProps) => {
  return (
    <div className="bg-blue-d2 mpx py-8 rounded-b-3xl">
      <div className="bg-blue-d rounded-lg px-4 py-4 flexitems-center">
        <div className="flex gap-x-2 items-center">
          <PYCCoinIcon className="w-10" />
          <div className="text-4xl font-bold">{props.coins}</div>
        </div>
      </div>
    </div>
  );
};

export default CoinsDisplayCard;
