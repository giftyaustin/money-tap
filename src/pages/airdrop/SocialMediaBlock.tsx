import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DrawerModal from "@/components/modals/DrawerModal";
import { cn, logoPath } from "@/lib/utils";
import WebApp from "@twa-dev/sdk";
import { sendPostRequest } from "@/lib/sendRequest";
import toast from "react-hot-toast";
import { Activity, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import PYCCoinsText from "@/components/PYCCoinsText";
import YoutubeVideos from "./YoutubeVideos";
import CoinConfetti from "@/components/CoinConfetti";
import YoutubeAccordian from "./YoutubeAccordian";
import { useBlast } from "@/components/CoinBlast";
type SocialMediaBlockProps = {
  socialMedia: Activity[];
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const SocialMediaBlock = (props: SocialMediaBlockProps) => {
  return (
    <section className="mt-8">
      <h2 className="relative font-semibold">Join our socials</h2>
      <div className="flex flex-col gap-y-2 mt-2">
        {/* Telegram */}
        {props.socialMedia.map((socialMedia, i) => {
          return (
            <SocialCard
              refetchUserInfo={props.refetchUserInfo}
              userInfo={props.userInfo}
              key={i}
              media={socialMedia}
            />
          );
        })}
        {/* <YoutubeVideos /> */}
        <YoutubeAccordian
          refetchUserInfo={props.refetchUserInfo}
          userInfo={props.userInfo}
        />
      </div>
    </section>
  );
};

export default SocialMediaBlock;

type SocialCardProps = {
  media: Activity;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const SocialCard = (props: SocialCardProps) => {
  const [haveSubscribed, setHaveSubscribed] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const handleButtonClick = () => {
    setShowInfoModal(true);
  };
  useEffect(() => {
    if (!props.userInfo || !props.media) return;
    if (props.userInfo.following_social_media.includes(props.media._id)) {
      setHaveSubscribed(true);
    }
  }, [props.userInfo.following_social_media, props.media]);
  return (
    <>
      <button
        disabled={
          haveSubscribed ||
          props.userInfo.following_social_media.includes(props.media._id)
        }
        onClick={handleButtonClick}
        className="pyc-sm-c"
      >
        <div className="flex gap-x-2 items-center">
          <img
            src={logoPath(props.media.logo)}
            alt=""
            className="w-12 rounded-full aspect-square"
          />
          <div className="flex flex-col items-start">
            <span className="capitalize">{props.media.name}</span>
            <div className="flex gap-x-1 items-center mt-1">
              <PYCCoinsText tokens={props.media.coins} />
              {haveSubscribed && <span className="text-sm"> coins earned</span>}
            </div>
          </div>
        </div>
        <div>
          <span>{haveSubscribed && <CheckMark />}</span>
        </div>
      </button>
      <SocialCardInfoModal
        userInfo={props.userInfo}
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
        haveSubscribed={haveSubscribed}
        setHaveSubscribed={setHaveSubscribed}
        siteInfo={props.media}
        refetchUserInfo={props.refetchUserInfo}
      />
    </>
  );
};
type SocialCardInfoModalProps = {
  showInfoModal: boolean;
  setShowInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
  haveSubscribed: boolean;
  setHaveSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  siteInfo: Activity;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const SocialCardInfoModal = (props: SocialCardInfoModalProps) => {
  const { blast } = useBlast();
  const tg_id = getTGID();
  const [sawLink, setSawLink] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const updateUserInfo = async () => {
    if (!tg_id) return;
    setIsSubmitting(true);
    toast.loading("Please wait...");
    const coinsToAdd = props.siteInfo.coins;
    const response = await sendPostRequest(`/api/v1/update-user/${tg_id}`, {
      following_social_media: [props.siteInfo._id],
      pyc_coins: coinsToAdd,
    });
    if (response.status) {
      toast.dismiss();
      props.refetchUserInfo();
      props.setHaveSubscribed(true);
      toast.success(`${props.siteInfo.coins} coins added`);
      blast();
      setTimeout(() => {
        props.setShowInfoModal(false);
      }, 1000);
    } else {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error(response.message);
      props.setHaveSubscribed(false);
    }
    setIsSubmitting(false);
  };
  const handleCheckClick = () => {
    updateUserInfo();
  };
  return (
    <>
      <DrawerModal
        open={props.showInfoModal}
        setOpen={props.setShowInfoModal}
        modalWrapperClassName="min-h-fit"
      >
        <div className="p-2 pt-16 flex flex-col gap-y-4 items-center relative">
          <img
            src={logoPath(props.siteInfo.logo)}
            className="rounded-full w-24 aspect-square absolute -top-12 left-1/2 -translate-x-1/2 p-2 bg-black"
            alt=""
          />
          <div className="bg-blue-p rounded-lg flex flex-col gap-y-2 w-full p-4 items-center">
            <PYCCoinsText
              tokens={props.siteInfo.coins}
              textClassName="text-3xl pr-4"
              imageClassName="w-12"
            />
            <p className="text-2xl text-center font-semibold">
              Follow our {props.siteInfo.name} to earn more rewards
            </p>
            <a
              onClick={() => {
                setSawLink(true);
              }}
              target="_blank"
              href={props.siteInfo.link!}
              className="font-semibold px-6 py-4 text-lg rounded-lg text-center w-full text-blue-p bg-yellow-p"
            >
              Follow
            </a>
          </div>

          {sawLink && (
            <button
              disabled={isSubmitting}
              onClick={handleCheckClick}
              className="bg-white text-lg text-blue-p mb-6 w-full font-bold px-6 py-4 rounded-lg disabled:opacity-50"
            >
              Check
            </button>
          )}
        </div>
      </DrawerModal>
    </>
  );
};

export const CheckMark = () => {
  return (
    <svg
      id="Group_5963"
      data-name="Group 5963"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path
        id="Path_3694"
        data-name="Path 3694"
        d="M10,0A10,10,0,1,0,20,10,10.012,10.012,0,0,0,10,0Zm5.589,7.368L9.2,13.709a.983.983,0,0,1-1.378.025L4.436,10.652a1.016,1.016,0,0,1-.075-1.4.992.992,0,0,1,1.4-.05l2.682,2.456L14.16,5.94a1.01,1.01,0,1,1,1.429,1.429Z"
        fill="#d7ff1d"
      />
    </svg>
  );
};
