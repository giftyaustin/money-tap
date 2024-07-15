import CoinsDisplayCard from "@/components/CoinsDisplayCard";
import Navbar from "@/components/Navbar";
import { useFetch } from "@/hooks/useFetch";
import { Stats, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import React, { useEffect, useState } from "react";
import LoaderMT from "@/components/LoaderMT";
import { io } from "socket.io-client";
import { getSocketServerHost } from "@/lib/sendRequest";
import Error from "@/components/Error";
import Odometer from "react-odometerjs";
const socket = io(getSocketServerHost());
export type LiveStats = {
  total_users: number;
  daily_users: number;
  total_touches: number;
  live_users: number;
};
const StatsPage = () => {
  const tg_id = getTGID();
  const { isLoading: stats_idLoading, data: statsData } = useFetch<Stats>({
    serverPath: "/api/v1/stats",
  });
  const { isLoading: user_idLoading, data: userData } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = userData?.data;
  const [stats, setStats] = useState<LiveStats>();

  // ============== socket =================
  useEffect(() => {
    // Connect to the server
    socket.on("connection", () => {
      console.log("Connected to server");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("live-stats", (data) => {
      if (data.status) {
        setStats(data.data);
      }
      else{
        setStats({total_users: 0, daily_users: 0, total_touches: 0, live_users: 0})
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("live-stats");
      socket.off("disconnect");
    };
  }, []);


  useEffect(() => {
    if (statsData?.data && !stats) {      
      const data: LiveStats = {
        total_users: statsData.data.total_users,
        daily_users: statsData.data.daily_users,
        total_touches: statsData.data.total_touches,
        live_users: statsData.data.live_users,
      };
      setStats(data);
    }
  }, [statsData])
  // =========================================



  if (stats_idLoading || user_idLoading) return <LoaderMT />;
  if (!stats || !userInfo) return <Error />;



  return (
    <>
      {/* <CoinsDisplayCard coins={userInfo.pyc_coins} /> */}
      <main className="mpx">
        {/* Stats displayed here */}
        <div className="mt-8">
          <Graph stats={stats} />
        </div>
        <div className="pt-8 flex flex-col gap-y-2 pb-[120px] h-md:pb-0">
          {/* Total touches */}
          <div className="px-4 py-2 flex gap-x-2 items-center bg-blue-l rounded-lg ">
            <LabelColor color={"#D7FF1D"} />
            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold">Total touches</h3>
              <span className=" font-semibold"><Odometer value={stats.total_touches} /></span>
            </div>
          </div>
          {/* Total users */}
          <div className="px-4 py-2 flex gap-x-2 items-center bg-blue-l rounded-lg">
            <LabelColor color={"rgb(215 255 29 / 70%)"} />
            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold">Total users</h3>
              <span className=" font-semibold"><Odometer value={stats.total_users} /></span>
            </div>
          </div>
          {/* Daily users */}
          <div className="px-4 py-2 flex gap-x-2 items-center bg-blue-l rounded-lg">
            <LabelColor color={"rgb(215 255 29 / 40%)"} />
            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold">Daily users</h3>
              <span className=" font-semibold"><Odometer value={stats.daily_users} /></span>
            </div>
          </div>
          {/* Online players */}
          <div className="px-4 py-2 flex gap-x-2 items-center bg-blue-l rounded-lg">
            <LabelColor color={"rgb(215 255 29 / 20%)"} />
            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold">Online players</h3>
              <span className="font-semibold"><Odometer value={stats.live_users} /></span>
            </div>
          </div>
        </div>
      </main>
      <Navbar />
    </>
  );
};

export default StatsPage;

type GraphProps = {
  stats: LiveStats;
};
const Graph = (props: GraphProps) => {
  return (
    <div className="relative h-[300px] flex items-end gap-x-2 justify-center">
      {/* Touches */}
      <div className="flex flex-col items-center h-full transition-all">
        <span className="text-sm font-medium text-center">
          Total <br /> touches
        </span>
        <div className="h-full w-14 rounded-md bg-yellow-p"></div>
      </div>

      {/* users */}
      <div className="flex flex-col items-center h-2/3 transition-all">
        <span className="text-sm font-medium text-center">
          Total <br /> users
        </span>
        <div className="h-full w-14 rounded-md bg-yellow-p opacity-70"></div>
      </div>
      {/* daily users */}
      <div className="flex flex-col h-1/2">
        <span className="text-sm items-center font-medium text-center transition-all">
          Daily <br /> users
        </span>
        <div className="h-full w-14 rounded-md bg-yellow-p opacity-40"></div>
      </div>
      {/* Online users */}
      <div className="flex flex-col items-center h-1/3 transition-all">
        <span className="text-sm font-medium text-center">
          Online <br /> users
        </span>
        <div className="h-full w-14 rounded-md bg-yellow-p opacity-20"></div>
      </div>
    </div>
  );
};

const LabelColor = ({ color }: { color: string }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`w-16 aspect-square rounded-lg`}
    ></div>
  );
};
