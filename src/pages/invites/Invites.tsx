import CoinsDisplayCard from "@/components/CoinsDisplayCard";
import { useFetch } from "@/hooks/useFetch";
import { UserInfo } from "@/lib/ResponseTypes";
import WebApp from "@twa-dev/sdk";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import ReferralsPage from "./ReferralsPage";
import CommissionsPage from "./CommissionsPage";

export type RefPage = "commission" | "referrals";
const Invites = () => {
  const tg_id = WebApp.initDataUnsafe.user?.id || 714489816;
  const [page, setPage] = useState<RefPage>("referrals");
  const { isLoading: user_isLoading, data: userData } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = userData?.data;
  if (user_isLoading) return <div>Loading...</div>;
  if (!userInfo) return <div>No data</div>;
  return (
    <>
      <TabNav setPage={setPage} page={page} />
      <main className="mpx pb-[100px]">
        {page === "referrals" && <ReferralsPage userInfo={userInfo} />}
        {page === "commission" && (
          <CommissionsPage claimed={userInfo.claimed_ref_rewards} />
        )}
      </main>
      <Navbar />
    </>
  );
};

export default Invites;

type TabNavProps = {
  page: RefPage;
  setPage: (page: RefPage) => void;
};
const TabNav = (props: TabNavProps) => {
  return (
    <div className="flex justify-center gap-x-8 items-center bg-blue-d2 pt-6 rounded-b-3xl shadow-lg">
      <button
        onClick={() => props.setPage("referrals")}
        className={cn(
          "invites-tab-link",
          {
            "invites-tab-link-active": props.page === "referrals",
          }
        )}
      >
        Referrals
      </button>
      <button
        onClick={() => props.setPage("commission")}
        className={cn(
          "invites-tab-link",
          {
            "invites-tab-link-active": props.page === "commission",
          }
        )}
      >
        Commission
      </button>
    </div>
  );
};
