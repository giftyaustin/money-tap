import { useFetch } from "@/hooks/useFetch";
import { UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import WebApp from "@twa-dev/sdk";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Home = () => {
  const tg_id = getTGID();
  if (tg_id === null) {
    WebApp.close();
  }
  const [videoIsLoading, setVideoIsLoading] = React.useState(true);
  const router = useNavigate();
  const { isLoading, data } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = data?.data;
  // alert(JSON.stringify(data));
  if (data?.status_code === 404) {
    WebApp.close();
  }
  const handleRouting = () => {
    if (!userInfo) return;

    if (!userInfo.user_acknowledged) {
      router("/intro");
      return;
    }
    if (userInfo.selected_country === "none") {
      router("/country");
      return;
    }
    if (userInfo.selected_network === null) {
      router("/chain");
      return;
    }
    if (userInfo.selected_exchange === null) {
      router("/exchange");
      return;
    }
    router("/tap");
  };

  useEffect(() => {
    const redirection = setTimeout(() => {
      handleRouting();
    }, 1000);
    return () => clearTimeout(redirection);
  }, [userInfo]);

  return (
    <div className="grid place-items-center min-h-screen bg-[#322ede]">
      <div className="w-full">
        <h1 className="text-5xl font-bold font-j-sans text-center">PayTap</h1>
        {/* <img src="/assets/mt-home.png" className="max-w-[370px] w-full mx-auto" alt="" /> */}


        {videoIsLoading ? <VideoLoader /> : null}

        <video
          onLoadedData={() => setVideoIsLoading(false)}
          autoPlay
          muted
          loop
          controls={false}
          preload="auto"
          style={{ display: videoIsLoading ? "none" : "block" }}
          className="opacity-95"
        >
          <source src="/assets/home-anim.mp4" type="video/mp4" />
        </video>
      </div>
      <img
        src="/assets/pb-paycio-logo.png"
        loading="eager"
        className="absolute bottom-4 left-1/2 w- -translate-x-1/2 aspect-[596/233.25] max-w-[120px] w-full"
        alt=""
      />
    </div>
  );
};

export default Home;



const VideoLoader = () => {
  return (
    <div className="bg-[#322ede] aspect-[500/509.25] max-w-[500px] w-full">
    </div>
  );
}