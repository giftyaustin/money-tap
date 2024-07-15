import WebApp from "@twa-dev/sdk";
import React from "react";
import DailyBoosters from "./DailyBoosters";
import DailyCombo from "./DailyCombo";
import { useFetch } from "@/hooks/useFetch";
import { UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import LoaderMT from "@/components/LoaderMT";
import Error from "@/components/Error";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Boosters from "./Boosters";

const Boost = () => {
  const router = useNavigate();
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => {
    router("/tap", { replace: true });
  });
  const tg_id = getTGID();
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
    <main className="mpx py-4">
      <DailyBoosters />
      <Boosters/>
      <DailyCombo refetchUserInfo={refetchUserInfo} userInfo={userInfo} />
    </main>
  );
};

export default Boost;
