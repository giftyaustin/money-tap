import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useFetch } from "@/hooks/useFetch";
import toast from "react-hot-toast";
import { sendPostRequest } from "@/lib/sendRequest";
import WebApp from "@twa-dev/sdk";
import { cn } from "@/lib/utils";
import { Activity, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";

export type Network = "solana" | "ton" | "none";

const NetworkSelection = () => {
  const router = useNavigate();
  const tg_id = getTGID();
  const { data: userRes } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userData = userRes?.data;

  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const [initialSelectedToken, setInitialSelectedToken] =
    useState<null | Network>(null);

  const handleValueChange = (value: Network) => {
    setSelectedNetwork(value);
  };
  const updateUserInfo = async () => {
    if (selectedNetwork && userData && !initialSelectedToken) {
      const response = await sendPostRequest(
        `/api/v1/update-user-network/${tg_id}`,
        {
          selected_network: selectedNetwork,
        }
      );
      if (response.status) {
        toast.dismiss();
        setSubmitting(false);
        if (selectedNetwork !== "none") {
          router(`/token/${selectedNetwork}`);
        } else {
          router("/exchange");
        }
      } else {
        toast.dismiss();
        setSubmitting(false);
        toast.error(response.message);
      }
    } else {
      toast.dismiss();
      setSubmitting(false);
      router("/tap");
    }
  };
  const handleContinueClick = () => {
    setSubmitting(true);
    toast.loading("Please wait...");
    if (!selectedNetwork) {
      toast.dismiss();
      setSubmitting(false);
      toast.error("Please select a network");
      return;
    }
    updateUserInfo();
  };
  const springs = useSpring({
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0 },
    config: { duration: 200 },
  });
  useEffect(() => {
    if (userData) {
      setInitialSelectedToken(userData.selected_network);
    }
  }, [userData]);

  useEffect(() => {
    if (initialSelectedToken) {
      if (initialSelectedToken === "none") {
        router("/exchange");
      } else {
        router(`/token/${initialSelectedToken}`);
      }
    }
  }, [initialSelectedToken]);
  return (
    <main className="min-h-[100vh] px-4">
      <animated.div className="mt-4" style={{ ...springs }}>
        <h2 className="text-2xl font-semibold">Select chain</h2>
        <p className="text-sm font-light">Pick your preferred network</p>
      </animated.div>
      <div className="mt-4 ">
        <RadioGroup onValueChange={handleValueChange} className="w-full">
          {/* ============ solana ========= */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor={"solana"}
              className={cn(
                "bg-[#0097EA] bg-gradient-to-r w-full from-[#00FFA3] to-[#DC1FFF] p-4 rounded-lg flex justify-between items-center gap-x-4"
              )}
            >
              <div className="flex gap-x-2 items-center">
                <span className="pt-1">
                  <SolanaIcon />
                </span>
                <span className="text-2xl font-medium capitalize">Solana</span>
              </div>
              <RadioGroupItem
                className="text-white border-white"
                value={"solana"}
                id={"solana"}
              />
            </label>
          </div>

          {/* =========== ton ========= */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor={"ton"}
              className={cn(
                "bg-[#0097EA]  w-full  p-4 rounded-lg flex justify-between items-center gap-x-4"
              )}
            >
              <div className="flex gap-x-2 items-center">
                <span className="pt-1">
                  <TonIcon />
                </span>
                <span className="text-2xl font-medium capitalize">Ton</span>
              </div>
              <RadioGroupItem
                className="text-white border-white"
                value={"ton"}
                id={"ton"}
              />
            </label>
          </div>

          {/* =========== none ========= */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor={"none"}
              className={cn(
                "bg-[#7A70FF]  w-full  p-4 rounded-lg flex justify-between items-center gap-x-4"
              )}
            >
              <div className="flex gap-x-2 items-center">
                <span className="pt-1">
                  <NoneIcon />
                </span>
                <span className="text-2xl font-medium capitalize">None</span>
              </div>
              <RadioGroupItem
                className="text-white border-white"
                value={"none"}
                id={"none"}
              />
            </label>
          </div>
        </RadioGroup>
      </div>
      <button
      disabled={submitting}
        onClick={handleContinueClick}
        className="mt-4 p-4 disabled:opacity-50 text-center w-full bg-yellow-p text-black rounded-lg  font-semibold"
      >
        Continue
      </button>

      {/* Note */}
      <div className="mt-4 opacity-50 flex gap-x-2 items-baseline">
        <span className="font-semibold text-sm">Note: </span>
        <p className="leading-[1rem] text-xs">
          Once you select your preferred blockchain for the airdrop, you'll be
          promoted to enter your wallet address. After confirming your details,
          the airdrop process will begin, and you'll receive your tokens
          shortly.
        </p>
      </div>
    </main>
  );
};

export default NetworkSelection;

export const TonIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="46"
      height="46.075"
      viewBox="0 0 46 46.075"
    >
      <defs>
        <filter
          id="Ton_icon"
          x="0"
          y="0"
          width="46"
          height="46.075"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodOpacity="0.078" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Ton_icon)">
        <path
          id="Ton_icon-2"
          data-name="Ton icon"
          d="M84.82,66.6a3.212,3.212,0,0,0-1.589-1.464,4.485,4.485,0,0,0-1.979-.488H62a3.7,3.7,0,0,0-2.081.488,3.159,3.159,0,0,0-1.847,1.6,3.852,3.852,0,0,0-.514,2.335,4.049,4.049,0,0,0,.772,2.077L70.268,91.989a1.649,1.649,0,0,0,1.336.719,1.425,1.425,0,0,0,1.359-.719L84.949,71.148a3.753,3.753,0,0,0,.59-2.206A4.946,4.946,0,0,0,84.82,66.6ZM70.09,85.486,60.9,69.447c-.237-.488-.359-.732-.359-.732a.94.94,0,0,1,.122-.63.907.907,0,0,1,.488-.488h8.94ZM82.357,68.8a1.89,1.89,0,0,1,0,.745L72.962,85.565V67.7h8.162a1.692,1.692,0,0,1,.847.125l.129.129c.129,0,.129.231.257.231a1.091,1.091,0,0,1,0,.617Z"
          transform="translate(-48.54 -58.64)"
          fill="#fff"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};
export const SolanaIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="43.876"
      viewBox="0 0 51 43.876"
    >
      <defs>
        <filter
          id="Path_3639"
          x="0"
          y="19.707"
          width="51"
          height="24.169"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodOpacity="0.078" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter
          id="Path_3640"
          x="0.043"
          y="0"
          width="50.957"
          height="24.168"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" result="blur-2" />
          <feFlood floodOpacity="0.078" />
          <feComposite operator="in" in2="blur-2" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter
          id="Path_3641"
          x="0.043"
          y="9.789"
          width="50.957"
          height="24.158"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" result="blur-3" />
          <feFlood floodOpacity="0.078" />
          <feComposite operator="in" in2="blur-3" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g
        id="Solana_icon"
        data-name="Solana icon"
        transform="translate(-7.457 -13.81)"
      >
        <g transform="matrix(1, 0, 0, 1, 7.46, 13.81)" filter="url(#Path_3639)">
          <path
            id="Path_3639-2"
            data-name="Path 3639"
            d="M21.852,38.414a1.086,1.086,0,0,1,.754-.3H48.926a.548.548,0,0,1,.531.558.575.575,0,0,1-.149.345l-5.2,4.961a1.086,1.086,0,0,1-.754.3H17.033a.543.543,0,0,1-.537-.324.5.5,0,0,1,.155-.589Z"
            transform="translate(-7.46 -12.4)"
            fill="#fff"
          />
        </g>
        <g transform="matrix(1, 0, 0, 1, 7.46, 13.81)" filter="url(#Path_3640)">
          <path
            id="Path_3640-2"
            data-name="Path 3640"
            d="M21.849,20.114a1.086,1.086,0,0,1,.754-.3H48.926a.543.543,0,0,1,.383.156.5.5,0,0,1,.148.372.515.515,0,0,1-.149.355l-5.2,4.981a1.086,1.086,0,0,1-.754.3H17.031a.548.548,0,0,1-.531-.558.575.575,0,0,1,.149-.345Z"
            transform="translate(-7.46 -13.81)"
            fill="#fff"
          />
        </g>
        <g transform="matrix(1, 0, 0, 1, 7.46, 13.81)" filter="url(#Path_3641)">
          <path
            id="Path_3641-2"
            data-name="Path 3641"
            d="M44.107,29.2a1.086,1.086,0,0,0-.754-.3H17.031a.548.548,0,0,0-.531.558.575.575,0,0,0,.149.345l5.2,4.951a1.086,1.086,0,0,0,.754.3H48.926a.529.529,0,0,0,.531-.528.515.515,0,0,0-.149-.355Z"
            transform="translate(-7.46 -13.11)"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  );
};

export const NoneIcon = () => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_10_1142)">
        <path
          d="M11 0C4.9347 0 0 4.9347 0 11C0 17.0653 4.9347 22 11 22C17.0653 22 22 17.0653 22 11C22 4.9347 17.0653 0 11 0ZM11 19.25C6.45111 19.25 2.75 15.5489 2.75 11C2.75 9.2638 3.27637 7.62248 4.2772 6.22196L15.778 17.7228C14.3775 18.7236 12.7362 19.25 11 19.25ZM17.7228 15.778L6.22196 4.2772C7.62248 3.27637 9.2638 2.75 11 2.75C15.5489 2.75 19.25 6.45111 19.25 11C19.25 12.7362 18.7236 14.3775 17.7228 15.778Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_1142">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
