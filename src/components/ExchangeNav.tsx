import { useFetch } from "@/hooks/useFetch";
import { UserInfo } from "@/lib/ResponseTypes";
import { cn } from "@/lib/utils";
import WebApp from "@twa-dev/sdk";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ExchangeNav = () => {
  const tg_id = WebApp.initDataUnsafe.user?.id;
  const router = useNavigate();
  const location = useLocation();
  const [currPage, setCurrPage] = React.useState<
    "exchange" | "claim-airdrop" | "referrals"
  >("exchange");
  const { isLoading, data, error, isError } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const userInfo = data?.data;
  useEffect(() => {
    if (
      location.pathname === "/exchange" ||
      location.pathname === "/claim-airdrop" ||
      location.pathname === "/referrals"
    ) {
      const page_ = location.pathname.split("/").pop();
      setCurrPage(page_ as "exchange" | "claim-airdrop" | "referrals");
    }
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 text-xs main-width mpx z-10 pt-4 pb-4 flex gap-x-4 justify-evenly items-baseline bg-black-l">
      {/* Exchange */}
      <Link
        to="/exchange"
        className={cn("flex flex-col gap-y-1 items-center justify-center", {
          "text-yellow-p": currPage === "exchange",
        })}
      >
        <span>
          <ExchangeIcon active={currPage === "exchange"} />
        </span>
        <span>Exchanges</span>
      </Link>
      {/* Claim airdrop */}
      <Link
        to="/claim-airdrop"
        className={cn("flex flex-col gap-y-1 items-center justify-center", {
          "text-yellow-p": currPage === "claim-airdrop",
        })}
      >
        <span>
          <StarIcon active={currPage === "claim-airdrop"} />
        </span>
        <span>Claim Airdrop</span>
      </Link>
      {/* Exchange */}
      <button
        onClick={() => {
          if (userInfo?.is_paycio_user) {
            router("/referrals");
          } else {
            toast("You must be a Paycio user to use Referrals");
          }
        }}
        className={cn("flex flex-col gap-y-1 items-center justify-center", {
          "text-yellow-p": currPage === "referrals",
        })}
      >
        <span>
          <ReferralsIcon active={currPage === "referrals"} />
        </span>
        <span>Referrals</span>
      </button>
    </div>
  );
};

export default ExchangeNav;

type NavIconProps = {
  active: boolean;
};
export const ExchangeIcon = (props: NavIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17.499"
      height="20.5"
      className={cn("fill-[#828282]", {
        "fill-yellow-p": props.active,
      })}
      viewBox="0 0 17.499 20.5"
    >
      <g id="Icon" transform="translate(-2.75 -2.25)">
        <path
          id="Path_3662"
          data-name="Path 3662"
          d="M9.25,2.5V19.167a1.25,1.25,0,0,0,2.5,0V2.5a1.25,1.25,0,0,0-2.5,0Z"
          transform="translate(4.333 1)"
          fillRule="evenodd"
        />
        <path
          id="Path_3663"
          data-name="Path 3663"
          d="M7.75,21.167V4.5a1.25,1.25,0,1,0-2.5,0V21.167a1.25,1.25,0,0,0,2.5,0Z"
          transform="translate(1.666 0.333)"
          fillRule="evenodd"
        />
        <path
          id="Path_3664"
          data-name="Path 3664"
          d="M9.616,3.383,13.783,7.55A1.249,1.249,0,0,0,15.55,5.783L11.383,1.616A1.249,1.249,0,0,0,9.617,3.383Z"
          transform="translate(4.333 1)"
          fillRule="evenodd"
        />
        <path
          id="Path_3665"
          data-name="Path 3665"
          d="M9.05,15.283,4.883,11.116a1.249,1.249,0,0,0-1.767,1.767L7.283,17.05A1.249,1.249,0,0,0,9.05,15.283Z"
          transform="translate(0 5.333)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export const StarIcon = (props: NavIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23.077"
      height="22.134"
      viewBox="0 0 23.077 22.134"
      className={cn("fill-[#828282] stroke-[#828282]", {
        "fill-yellow-p stroke-yellow-p": props.active,
      })}
    >
      <path
        id="star_1_"
        data-name="star (1)"
        d="M5.025,22a1.195,1.195,0,0,1-1.162-1.459l1.444-6.361L.409,9.888A1.194,1.194,0,0,1,1.085,7.8l6.48-.588,2.562-6a1.193,1.193,0,0,1,2.194,0l2.562,6,6.479.588a1.194,1.194,0,0,1,.678,2.088l-4.9,4.294,1.444,6.361a1.193,1.193,0,0,1-1.775,1.289l-5.587-3.339L5.636,21.834A1.2,1.2,0,0,1,5.025,22Zm6.2-4.949a1.2,1.2,0,0,1,.612.169l5.273,3.154-1.363-6a1.193,1.193,0,0,1,.378-1.162l4.624-4.055L14.63,8.6a1.192,1.192,0,0,1-.991-.723L11.224,2.22,8.806,7.878a1.188,1.188,0,0,1-.988.72L1.7,9.154,6.323,13.21A1.191,1.191,0,0,1,6.7,14.373l-1.362,6,5.273-3.153a1.2,1.2,0,0,1,.612-.169ZM7.515,7.328a0,0,0,0,1,0,0Zm7.415,0v0S14.931,7.327,14.93,7.326Zm0,0"
        transform="translate(0.315 -0.192)"
        strokeWidth="0.6"
      />
    </svg>
  );
};
export const ReferralsIcon = (props: NavIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15.402"
      height="16.157"
      viewBox="0 0 15.402 16.157"
      className={cn("fill-[#828282]", {
        "fill-yellow-p": props.active,
      })}
    >
      <g id="Icon" transform="translate(-7.309 -7.079)">
        <g
          id="Group_5916"
          data-name="Group 5916"
          transform="translate(7.309 7.079)"
        >
          <path
            id="Path_3659"
            data-name="Path 3659"
            d="M19.042,8.056,8.056,19.042A1.166,1.166,0,0,0,9.7,20.691L20.691,9.7a1.166,1.166,0,0,0-1.649-1.649Z"
            transform="translate(-6.672 -6.295)"
            fillRule="evenodd"
          />
          <path
            id="Path_3660"
            data-name="Path 3660"
            d="M13.011,7.824a3.5,3.5,0,1,0,0,4.944A3.5,3.5,0,0,0,13.011,7.824ZM11.362,9.472a1.165,1.165,0,1,1-1.647,0A1.166,1.166,0,0,1,11.362,9.472Z"
            transform="translate(-7.044 -6.801)"
            fillRule="evenodd"
          />
          <path
            id="Path_3661"
            data-name="Path 3661"
            d="M18.425,13.724a3.5,3.5,0,1,0,0,4.944A3.5,3.5,0,0,0,18.425,13.724Zm-1.649,1.647a1.165,1.165,0,1,1-1.647,0,1.166,1.166,0,0,1,1.647,0Z"
            transform="translate(-4.046 -3.533)"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  );
};
