import React, { TouchEventHandler, useState } from "react";
import PaycioPage from "./PaycioPage";
import ReferralsIntro from "./ReferralsIntro";
import SocialMediaIntro from "./SocialMediaIntro";
import MoneyTapIntro from "./MoneyTapIntro";
import { cn } from "@/lib/utils";
import IntroSlider from "./IntroSlider";

export type IntroPage = "money-tap" | "levels" | "referrals" | "social-media";
const Intro = () => {
  const [page, setPage] = React.useState<IntroPage>("levels");
  const [startX, setStartX] = useState(0);
  const handleTouchEnd = (e:React.TouchEvent<HTMLElement>)=>{
    const {pageX} = e.changedTouches[0];
    // if(pageX > startX) setPage("social-media");
    // if(pageX < startX) setPage("referrals");
  }
  return (
    <main onTouchStart={(e) => setStartX(e.touches[0].clientX)} onTouchEnd={handleTouchEnd} className="mpx py-4">
      {/* {page === "paycio" && <PaycioPage page={page} setPage={setPage} />}
      {page === "referrals" && <ReferralsIntro page={page} setPage={setPage} />}
      {page === "social-media" && (
        <SocialMediaIntro page={page} setPage={setPage} />
      )} */}
      {
        page !== "money-tap" && <IntroSlider setPage={setPage}/>
      }
      {page === "money-tap" && <MoneyTapIntro page={page} setPage={setPage} />}
    </main>
  );
};

export default Intro;

type SkipNextProps = {
  page: IntroPage;
  setPage: (page: IntroPage) => void;
  next: IntroPage;
};
export const SkipNext = (props: SkipNextProps) => {
  return (
    <div className=" w-full">
      <div className="flex gap-x-2 w-full">
        {/* <button
          onClick={() => props.setPage("money-tap")}
          className="text-white border w-full rounded-lg py-2 border-white font-semibold"
        >
          Skip
        </button> */}
        <button
          onClick={() => props.setPage(props.next)}
          className="bg-white rounded-lg py-2.5 w-full text-black font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
};


