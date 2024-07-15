import React from "react";
import {  IntroPage, SkipNext } from "./Intro";
type PaycioPageProps = {
  page: IntroPage;
  setPage: (page: IntroPage) => void;
};
const PaycioPage = (props: PaycioPageProps) => {
  return (
    <div className="min-h-[100svh] flex flex-col justify-between">
      <div>
      <div className="rounded-xl bg-gradient-to-tr from-[#5a5dff] shadow-lg via-blue-p to-blue-p justify-center items-center flex aspect-square w-full max-w-[500px]">
        <img src="/intro/levels.png" className="max-w-[500px]" alt="" />
      </div>
      {/* <Dots page={props.page} setPage={props.setPage} next="referrals"/> */}
      <div className="mt-8">
        <h1 className="font-bold text-2xl lt:text-3xl text-center">Conquer levels, Claim rewards.</h1>
        <p className="text-center mt-4 text-base lt:text-lg">
        Click the claim button to surpass a level. The required amount will be deducted from your earned coins, and you will move to the next level.
        </p>
      </div>
      </div>
     
      <SkipNext next="referrals" page={props.page} setPage={props.setPage} />
    </div>
  );
};

export default PaycioPage;
