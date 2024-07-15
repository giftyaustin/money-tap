import BackButton from "@/components/BackButton";
import DrawerModal from "@/components/modals/DrawerModal";
import { useFetch } from "@/hooks/useFetch";
import { UserInfo } from "@/lib/ResponseTypes";
import { sendPostRequest } from "@/lib/sendRequest";
import WebApp from "@twa-dev/sdk";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { CheckMark } from "./SocialMediaBlock";
import PYCCoinsText from "@/components/PYCCoinsText";
import { getTGID } from "@/lib/getTGID";

export type YTVideo = {
  _id: string;
  length: number;
  coins: number;
  link: string;
  has_watched: boolean;
  is_disabled: boolean;
};
const Youtube = () => {
  const tg_id = getTGID();
  const { isLoading: yt_isLoading, data: yt_apiRes } = useFetch<YTVideo[]>({
    serverPath: `/api/v1/yt-videos/${tg_id}`,
  });
  const {
    isLoading: user_isLoading,
    data: user_res,
    refetch: refetchUserInfo,
  } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const [yt_videos, setYt_videos] = React.useState<YTVideo[] | null>(null);
  const userInfo = user_res?.data;

  useEffect(() => {
    if (yt_apiRes?.data) setYt_videos(yt_apiRes.data);
  }, [yt_apiRes?.data]);

  if (yt_isLoading || user_isLoading) return <p>Loading...</p>;
  if (!yt_videos || !userInfo) return <p>Error...</p>;
  return (
    <>
      <main className="relative mt-8">
        <div>
          <div className="font-semibold">Step 2:</div>
          <div className="opacity-90">Watch the videos below to earn coins</div>
        </div>
        {/* Tokens list */}
        <section className=" flex flex-col gap-y-4 mt-4">
          {yt_videos?.map((video) => (
            <Video
              refetchUserInfo={refetchUserInfo}
              userInfo={userInfo}
              ytVideo={video}
              key={video._id}
            />
          ))}
        </section>
      </main>
    </>
  );
};

export default Youtube;
type VideoProps = {
  ytVideo: YTVideo;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const Video = (props: VideoProps) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <button
        disabled={props.ytVideo.has_watched}
        onClick={() => setShowModal(true)}
        className="flex justify-between items-center gap-x-4 bg-[#4E40F9] py-4 px-4 rounded-lg"
      >
        {/* Link */}
        <div className="text-left break-words line-clamp-1 text-sm lt:text-base">
          {props.ytVideo.link}
        </div>
        <div>
          {props.ytVideo.has_watched ? (
            <span>
              <CheckMark />
            </span>
          ) : (
            <span className="text-xs bg-blue-p shadow-lg rounded-md py-1 px-2">
              Watch
            </span>
          )}
        </div>
      </button>
      <VideoInfoModal
        refetchUserInfo={props.refetchUserInfo}
        userInfo={props.userInfo}
        video={props.ytVideo}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

type VideoInfoModalProps = {
  video: YTVideo;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const VideoInfoModal = (props: VideoInfoModalProps) => {
  const tg_id = getTGID();
  const [sawVideo, setSawVideo] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const hanldeLinkClick = () => {
    setTimeout(() => {
      setSawVideo(true);
    }, props.video.length);
  };

  const updateUserInfo = async () => {
    const response = await sendPostRequest(`/api/v1/update-user/${tg_id}`, {
      pyc_coins: props.video.coins,
      watched_ytVideos: [props.video._id],
    });
    if (response.status) {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success(`${props.video.coins} coins added`);
      props.refetchUserInfo();
      window.location.reload();
      props.setShowModal(false);
    } else {
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(response.message);
    }
  };

  const handleCheckClick = () => {
    if (!sawVideo) {
      toast.error("Please watch the video first");
      return;
    }
    toast.loading("Please wait...");
    setIsSubmitting(true);
    updateUserInfo();
  };

  return (
    <DrawerModal
      open={props.showModal}
      setOpen={props.setShowModal}
      modalWrapperClassName="min-h-fit"
    >
      <div className="p-4 pt-14 flex flex-col gap-y-4 justify-center items-center">
        <div className="absolute -top-12 lt:-top-8 left-1/2 -translate-x-1/2 p-2 rounded-full bg-black">
          <img src="/logos/youtube.png" className="w-16" alt="" />
        </div>
        <div className="flex gap-y-2 items-center flex-col bg-blue-p rounded-lg p-4">
          <PYCCoinsText
            tokens={props.video.coins}
            imageClassName="w-10"
            textClassName="text-xl"
          />
          <h1 className="text-center font-semibold text-xl">
            Watch our video on YouTube to earn coins
          </h1>

          <a
            onClick={hanldeLinkClick}
            href={props.video.link}
            target="_blank"
            className="break-words w-full text-center text-xl line-clamp-1 bg-yellow-p px-4 py-4 rounded-lg font-semibold text-black"
          >
            Watch
          </a>
        </div>

        <button
          onClick={handleCheckClick}
          className="bg-white text-blue-p w-full font-semibold text-lg px-4 py-4 mb-2 rounded-lg disabled:cursor-not-allowed"
        >
          Check
        </button>
      </div>
    </DrawerModal>
  );
};
