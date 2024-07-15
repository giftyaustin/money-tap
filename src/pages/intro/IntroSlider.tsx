import React, { useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import {IntroPage, SkipNext } from "./Intro";
import { cn } from "@/lib/utils";

type IntroSliderProps = {
  setPage: React.Dispatch<React.SetStateAction<IntroPage>>;
};
const IntroSlider = (props: IntroSliderProps) => {
  const pages: IntroPage[] = ["levels", "referrals", "social-media"];
  const [activeIndex, setActiveIndex] = useState(0);
  let sliderRef: any = useRef<any>(null);
  var settings: Settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (currentSlide: number) => {
      setActiveIndex(currentSlide);
    },
  };

  const handleNextClick = () => {
    if (activeIndex < 2) {
      
      sliderRef.slickNext();
    } else {
      props.setPage("money-tap");
    }
  };

  return (
    <div className="py-4 flex flex-col justify-between min-h-screen gap-y-4 pb-[110px] h-sm-max:pb-4 ">
      <div>
        <Slider
          ref={(slider: any) => {
            sliderRef = slider;
          }}
          {...settings}
        >
          {pages.map((page, index) => (
            <div key={index}>
              <div className="rounded-xl bg-gradient-to-tr from-[#5a5dff] shadow-lg via-blue-p to-blue-p justify-center items-center flex aspect-square w-full max-w-[500px]">
                <img
                  src={`/intro/${page}.png`}
                  className="w-2/3 max-w-[250px]"
                  alt=""
                />
              </div>
            </div>
          ))}
        </Slider>
          <Dots sliderRef={sliderRef} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        {activeIndex === 0 && <TextContent page={"levels"} />}
        {activeIndex === 1 && <TextContent page={"referrals"} />}
        {activeIndex === 2 && <TextContent page={"social-media"} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-blue-p shadow-top-lg">
        <button
          onClick={handleNextClick}
          className="bg-white text-blue-p rounded-lg py-4 font-semibold w-full text-lg "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IntroSlider;

type TextContentProps = {
  page: IntroPage;
};
const TextContent = (props: TextContentProps) => {
  switch (props.page) {
    case "levels":
      return (
        <div className="mt-8">
          <h1 className="font-bold text-2xl lt:text-3xl text-center">
            Conquer levels, Claim rewards.
          </h1>
          <p className="text-center mt-4 text-base lt:text-lg leading-[1.2rem]">
            Click the claim button to surpass a level. The required amount will
            be deducted from your earned coins, and you will move to the next
            level.
          </p>
        </div>
      );

      break;
    case "referrals":
      return (
        <div className="mt-8">
          <h1 className="font-bold text-2xl text-center lt:text-3xl">
            Refer and Earn
          </h1>
          <p className=" lt:text-lg mt-4 text-center leading-[1.2rem]">
            Earn even more coins! Refer to your friends and family now!
          </p>
        </div>
      );

      break;
    case "social-media":
      return (
        <div className="mt-8">
          <h1 className="font-bold text-center text-2xl lt:text-3xl">
            Collect coins for social media follows
          </h1>
          <p className="text-center text-base lt:text-lg mt-4 leading-[1.2rem]">
            Get ready to earn more coins! Follow, subscribe, like, share, and
            comment on all our social media channels. Don't miss out on the fun
            and rewards!
          </p>
        </div>
      );

      break;

    default:
      break;
  }
};


type DotsProps = {
  activeIndex: number;
  setActiveIndex: (activeIndex: number) => void;
  sliderRef: any;
};
export const Dots = (props: DotsProps) => {
  
  return (
    <div className="flex justify-center items-center gap-x-3 mt-8">
      <button
      onClick={()=>{props.sliderRef.slickGoTo(0)}}
        className={cn("w-2 aspect-square rounded-full bg-white opacity-50", {
          "opacity-100 bg-yellow-p w-2.5": props.activeIndex === 0,
        })}
      ></button>
      <button
         onClick={()=>{props.sliderRef.slickGoTo(1)}}
        className={cn("w-2 aspect-square rounded-full bg-white opacity-50", {
          "opacity-100 bg-yellow-p w-2.5": props.activeIndex === 1,
        })}
      ></button>
      <button
         onClick={()=>{props.sliderRef.slickGoTo(2)}}
        className={cn("w-2 aspect-square  rounded-full bg-white opacity-50", {
          "opacity-100 bg-yellow-p w-2.5": props.activeIndex === 2,
        })}
      ></button>
    </div>
  );
};