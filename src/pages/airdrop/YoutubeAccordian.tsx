import PYCCoinsText from "@/components/PYCCoinsText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetch } from "@/hooks/useFetch";
import { Activity, UserInfo } from "@/lib/ResponseTypes";
import { cn, logoPath } from "@/lib/utils";
import React from "react";
import Youtube from "./YoutubeVideos";
import LoaderMT from "@/components/LoaderMT";
import DrawerModal from "@/components/modals/DrawerModal";
import CoinConfetti from "@/components/CoinConfetti";
import Error from "@/components/Error";
import { getTGID } from "@/lib/getTGID";
import { sendPostRequest } from "@/lib/sendRequest";
import toast from "react-hot-toast";
import { userInfo } from "os";

type YoutubeAccordianProps = {
  refetchUserInfo: () => void;
  userInfo: UserInfo;
};

const YoutubeAccordian = (props: YoutubeAccordianProps) => {
  const { data, isLoading } = useFetch<Activity[]>({
    serverPath: "/api/v1/activities?type=youtube",
  });
  const media = data?.data?.[0];

  if (isLoading) return <LoaderMT />;

  if (!media) return <Error />;
  return (
    <div className="mt-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="item-1"
          className="border-0 bg-blue-l px-4 rounded-lg"
        >
          <AccordionTrigger className="py-3 no-underline focus:no-underline hover:no-underline">
            <div className="">
              <div className="flex gap-x-2 items-center">
                <img
                  src={logoPath(media.logo)}
                  alt=""
                  className="w-12 rounded-full aspect-square"
                />
                <div className="flex flex-col items-start">
                  <span className="capitalize">{media.name}</span>
                  <div className="flex gap-x-1 items-center mt-1">
                    <PYCCoinsText tokens={media.coins} />
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            <Content
              userInfo={props.userInfo}
              refetchUserInfo={props.refetchUserInfo}
              media={media}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default YoutubeAccordian;

type ContentProps = {
  media: Activity;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const Content = (props: ContentProps) => {
  const [open, setOpen] = React.useState(false);
  const [haveSubscribed, setHaveSubscribed] = React.useState(false);
  const handleButtonClick = () => {
    if (props.userInfo.following_social_media.includes(props.media._id)) {
      toast("Already Subscribed");
      return;
    } else {
      setOpen(true);
    }
  };
  return (
    <div className="border-t border-gray-300 border-opacity-20">
      <div className="mt-8">
        <div className="font-semibold">Step 1:</div>
        <div className="opacity-90">
          Open Paycio youtube channel and Subscribe{" "}
        </div>
        <button
          onClick={handleButtonClick}
          className="mt-4 font-semibold bg-white rounded-lg w-full text-black py-3"
        >
          Subscribe to our channel
        </button>
        <YTSubscriptionModal
          userInfo={props.userInfo}
          refetchUserInfo={props.refetchUserInfo}
          haveSubscribed={haveSubscribed}
          setHaveSubscribed={setHaveSubscribed}
          media={props.media}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <Youtube />
    </div>
  );
};

type YTSubscriptionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  media: Activity;
  haveSubscribed: boolean;
  setHaveSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const YTSubscriptionModal = (props: YTSubscriptionModalProps) => {
  const tg_id = getTGID();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [seenLink, setSeenLink] = React.useState(false);

  const updateUserInfo = async () => {
    if (!tg_id) return;
    setIsSubmitting(true);
    const coinsToAdd = props.media.coins;
    const response = await sendPostRequest(`/api/v1/update-user/${tg_id}`, {
      following_social_media: [props.media._id],
      pyc_coins: coinsToAdd,
    });
    if (response.status) {
      toast.dismiss();
      setIsSubmitting(false);
      props.setHaveSubscribed(true);
      props.refetchUserInfo();
      toast.success(`${props.media.coins} coins added`);
      props.setOpen(false);
    } else {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error(response.message);
      props.setHaveSubscribed(false);
    }
    setIsSubmitting(false);
  };
  const handleCheckClick = () => {
    toast.loading("Please wait...");
    if (props.userInfo.following_social_media?.includes(props.media._id)) {
      toast.dismiss();
      setIsSubmitting(false);
      props.setHaveSubscribed(true);
      toast("Already subscribed");
      return;
    }
    updateUserInfo();
  };
  return (
    <>
      <DrawerModal
        open={props.open}
        setOpen={props.setOpen}
        modalWrapperClassName="min-h-fit"
      >
        <div className="p-2 pt-16  flex flex-col gap-y-6 items-center relative">
          <img
            src={logoPath("youtube.png")}
            className="rounded-full w-24 aspect-square absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-black"
            alt=""
          />
          <div className="flex flex-col gap-y-2 bg-blue-p rounded-lg p-2 items-center">
            <div>
              <PYCCoinsText
                textClassName="text-3xl"
                imageClassName="w-10"
                tokens={props.media.coins}
              />
            </div>
            <p className="text-2xl text-center font-semibold">
              Follow our {props.media.name} to earn more rewards
            </p>
            <a
              onClick={() => {
                setSeenLink(true);
              }}
              target="_blank"
              href={props.media.link!}
              className="font-semibold w-full px-6 py-4 rounded-lg text-xl text-center text-blue-p bg-yellow-p"
            >
              Follow
            </a>
          </div>

          <div className="flex gap-y-1 flex-col w-full">
            {seenLink && (
              <button
              disabled={isSubmitting}
                onClick={handleCheckClick}
                className="bg-white text-blue-p text-xl font-bold px-6 py-4 mb-6 rounded-lg disabled:opacity-50"
              >
                Check
              </button>
            )}
          </div>
        </div>
      </DrawerModal>
    </>
  );
};
