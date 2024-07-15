import Navbar from "@/components/Navbar";
import { useFetch } from "@/hooks/useFetch";
import { LevelInfo, Stats, UserInfo } from "@/lib/ResponseTypes";
import WebApp from "@twa-dev/sdk";
import React, { useState } from "react";
import { PYCCoinIcon } from "../tap/Click";
import { FingerprintIcon, LoaderPinwheel } from "lucide-react";
import PYCCoinsText from "@/components/PYCCoinsText";
import toast, { Toaster } from "react-hot-toast";
import { sendPostRequest } from "@/lib/sendRequest";
import CoinsDisplayCard from "@/components/CoinsDisplayCard";
import { getTGID } from "@/lib/getTGID";
import { errorToastStyles } from "@/styles/styles";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Error from "@/components/Error";
import LoaderMT from "@/components/LoaderMT";

const Levels = () => {
  const tg_id = getTGID();
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => window.history.back());
  const {
    isLoading: user_isLoading,
    data: userData,
    refetch: refetchUserInfo,
  } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });

  const userInfo = userData?.data;

  if (user_isLoading) return <LoaderMT />;
  if (!userInfo) return <Error />;
  return (
    <>
      <main className="mpx pb-24">
        <LevelsList refetchUserInfo={refetchUserInfo} userInfo={userInfo} />
      </main>
      <Navbar />
    </>
  );
};

export default Levels;

type LevelsListProps = {
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const LevelsList = (props: LevelsListProps) => {
  const tg_id = getTGID();
  const { isLoading: stats_isLoading, data: statsData } = useFetch<Stats>({
    serverPath: `/api/v1/stats`,
  });
  const levels = statsData?.data?.levels;
  const handleClaimAll = async () => {
    toast.loading("Claiming all levels...");
    const response = await sendPostRequest(`/api/v1/boost-level/${tg_id}`, {
      to_level: 10,
    });
    if (response.status) {
      toast.dismiss();
      toast.success("Claimed all levels");
      window.location.reload();
    } else {
      toast.dismiss();
      if (response.response_code === 100) {
        toast.error("😞 Insufficient coins");
        return;
      } else {
        toast.error(response.message);
      }
    }
  };
  if (stats_isLoading) return <LoaderMT />;
  if (!levels) return <Error />;
  return (
    <>
      <LevelsSlider levels={levels} />
      <section className="mt-8">
        <div className="flex justify-between items-center">
          <h3>Levels</h3>
          <button
            onClick={handleClaimAll}
            className="text-yellow-p underline font-light"
          >
            Claim all
          </button>
        </div>

        <div className="flex gap-y-2 flex-col mt-4">
          {levels.map((level) => (
            <LevelCard
              key={level._id}
              level={level}
              userInfo={props.userInfo}
              refetchUserInfo={props.refetchUserInfo}
            />
          ))}
        </div>
      </section>
    </>
  );
};
type LevelCardProps = {
  userInfo: UserInfo;
  level: LevelInfo;
  refetchUserInfo: () => void;
};
const LevelCard = (props: LevelCardProps) => {
  return (
    <div className="rounded-md bg-blue-l px-4 py-2 flex justify-between items-center">
      <div className="flex gap-x-2 items-center">
        <img
          src={`/level-globes/${props.level.level_number}.png`}
          className="w-8"
          alt=""
        />
        <div>
          <span className="font-medium">{props.level.level_name}</span>
          <PYCCoinsText tokens={props.level.coins_to_claim} />
        </div>
      </div>
      {props.level.level_number <= props.userInfo.level_info.level_number ? (
        <span className="text-white font-medium px-3 py-1.5 text-sm bg-blue-d rounded-lg">
          Reached
        </span>
      ) : (
        <ClaimButton
          refetchUserInfo={props.refetchUserInfo}
          userInfo={props.userInfo}
          level={props.level}
        />
      )}
    </div>
  );
};

type ClaimButtonProps = {
  userInfo: UserInfo;
  level: LevelInfo;
  refetchUserInfo: () => void;
};
const ClaimButton = (props: ClaimButtonProps) => {
  const tg_id = getTGID();
  const [submitting, setSubmitting] = useState(false);
  const handleClick = async () => {
    setSubmitting(true);
    toast.loading("Claiming...");
    if (props.userInfo.pyc_coins < props.level.coins_to_claim) {
      toast.dismiss();
      setSubmitting(false);
      toast.error("Not enough coins");
      return;
    }
    const response = await sendPostRequest(`/api/v1/boost-level/${tg_id}`, {
      to_level: props.level.level_number,
    });
    if (response.status) {
      toast.dismiss();
      setSubmitting(false);
      props.refetchUserInfo();
      toast.success("Claimed");
    } else {
      setSubmitting(false);
      toast.dismiss();
      if (response.response_code === 100) {
        toast.error("😞 Insufficient coins");
        return;
      } else {
        toast.error(response.message);
      }
    }
  };
  return (
    <button
      disabled={submitting}
      onClick={handleClick}
      className="text-black disabled:opacity-50 font-medium px-3 py-1.5 text-sm bg-yellow-p rounded-lg"
    >
      Claim
    </button>
  );
};

type LevelsSliderProps = {
  levels: LevelInfo[];
};
export function LevelsSlider(props: LevelsSliderProps) {
  const [activeGlobe, setActiveGlobe] = useState(0);
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (currentSlide: number) => {
      setActiveGlobe(currentSlide);
    },
  };
  return (
    <>
      {/* <div className="overflow-x-hidden">
        <div className="flex gap-x-4 overflow-x-scroll snap-x snap-mandatory no-scrollbar">
          {props.levels.map((level) => (
            <Globe key={level.level_number} level={level} />
          ))}
        </div>
      </div> */}
      <div className="px-6">
        <Slider slide="" {...settings}>
          {props.levels.map((level) => (
            <Globe key={level.level_number} level={level} />
          ))}
        </Slider>
      </div>

      <div className="flex flex-col gap-y-3 justify-center mt-4">
        <div className="flex justify-between gap-x-4">
          <span>{props.levels[activeGlobe].level_name}</span>
          <div>
            <span className="font-medium">
              {props.levels[activeGlobe].level_number}{" "}
            </span>
            <span className="opacity-50">/10</span>
          </div>
        </div>
        <div className="w-full h-3 bg-[#ffffff49] relative rounded-full">
          <div
            style={{ width: `${props.levels[activeGlobe].level_number * 10}%` }}
            className="absolute transition-all bg-gradient-to-r from-yellow-p to-[#00000069] rounded-full h-full"
          ></div>
        </div>
      </div>
    </>
  );
}

type GlobeProps = {
  level: LevelInfo;
};
const Globe = (props: GlobeProps) => {
  return (
    <div
      className="shrink-0 snap-start pyc-globe-img snap-always w-full max-w-[100vw] flex justify-center py-8"
      key={props.level.level_number}
    >
      <img
        src={`/level-globes/${props.level.level_number}.png`}
        className="relative w-2/3 max-w-[300px]"
        alt=""
      />
    </div>
  );
};
