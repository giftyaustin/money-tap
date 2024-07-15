import { useFetch } from "@/hooks/useFetch";
import { CountryInfo, LevelInfo, UserInfo } from "@/lib/ResponseTypes";
import { getSocketServerHost, sendPostRequest } from "@/lib/sendRequest";
import { cn, logoPath } from "@/lib/utils";
import WebApp from "@twa-dev/sdk";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import Flag from "@/components/Flag";
import { getTGID } from "@/lib/getTGID";
import { motion } from "framer-motion";
import io from "socket.io-client";
import DrawerModal from "@/components/modals/DrawerModal";
import Odometer from "react-odometerjs";
import "../../../node_modules/odometer/themes/odometer-theme-minimal.css";
import LoaderMT from "@/components/LoaderMT";
import ClaimHourlyCoinsModal from "./ClaimHourlyCoinsModal";
const socket = io(getSocketServerHost());

const Click = () => {
  const router = useNavigate();
  const tg_id = getTGID();
  const {
    isLoading,
    data,
    refetch: refetchUserInfo,
  } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = data?.data;
  const [initialCoins, setInitialCoins] = useState<number>(0);
  const [touchCount, setTouchCount] = useState<number>(0);
  const [showClaimCoinsModal, setShowClaimCoinsModal] = useState(false);
  const [decreaseInEnergy, setDecreaseInEnergy] = useState(0);

  // Handle the tocuh end event here
  const handleClick = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!userInfo || !event.changedTouches) return;
    setDecreaseInEnergy(prev=>prev + 1*userInfo.level);
    const globeImg = document.getElementById("globe");
    globeImg?.classList.add("scale-[0.97]");
    setTimeout(() => {
      globeImg?.classList.remove("scale-[0.97]");
    }, 50);
    const { pageX, pageY } = event.changedTouches[0];
    createFloatingElement(pageX, pageY, userInfo.level);
    setTouchCount((prev) => prev + 1);
  };

  const createFloatingElement = (
    clientX: number,
    clientY: number,
    level: number
  ) => {
    const globe = document.getElementById("globe-tap");
    const element = document.createElement("div");
    element.className = "pyc-float";
    element.style.left = `${clientX}px`;
    element.style.top = `${clientY}px`;
    element.style.fontSize = "2.5rem";
    element.style.fontWeight = "bold";
    element.style.userSelect = "none";
    element.style.color = "white";
    element.innerHTML = `+${level}`;
    globe?.appendChild(element);
    setTimeout(() => {
      globe?.removeChild(element);
    }, 1000);
  };

  // Assign the coins-to-display based on the user
  useEffect(() => {
    if (!userInfo) return;
    setInitialCoins(userInfo.pyc_coins);
  }, [userInfo]);

  // Increase the coins-to-add after a touch based on the user's level
  useEffect(() => {
    if (userInfo && touchCount > 0) {
      addCoinsToUser(touchCount);
      return () => {
        addCoinsToUser.cancel();
      };
    }
  }, [touchCount, userInfo]);

  const addCoinsToUserRequest = async (touchCount: number) => {
    if (!userInfo || !initialCoins) return;
    setInitialCoins(
      (prev) => prev + touchCount * userInfo.level_info.coins_per_tap
    );
    setTouchCount(0);
    const response = await sendPostRequest(`/api/v1/tap/${tg_id}`, {
      total_taps: touchCount,
    });
    if (response.status) {
      setInitialCoins(response.data.coins);
    }
  };
  const addCoinsToUser = debounce(addCoinsToUserRequest, 700, {
    leading: false,
    trailing: true,
  });

  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.selected_exchange === null) {
      router("/exchange");
      return;
    }

    if (userInfo.coins_to_claim > 0) {
      setShowClaimCoinsModal(true);
    }
  }, [userInfo]);

  // Handle telegram scrolling issue
  useEffect(() => {
    const block = document.getElementById("pyc-gl-tap");
    if (!block) return;
    block.addEventListener(
      "touchmove",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
      },
      { passive: false }
    );
  }, []);

  useEffect(() => {
    if(!userInfo || decreaseInEnergy === 0 || !decreaseInEnergy) return;
    setTimeout(() => {
      setDecreaseInEnergy(prev => prev - 1);
    }, userInfo.recharge_time)
  }, [decreaseInEnergy]);

  if (isLoading) return <LoaderMT />;
  if (!userInfo) {
    WebApp.close();
    return <div>User not found</div>;
  }

  return (
    <section className="">
      {/* <CoinBlast/> */}
      {/* <ClaimHourlyCoinsModal
        refetchUserInfo={refetchUserInfo}
        userInfo={userInfo}
        open={showClaimCoinsModal}
        setOpen={setShowClaimCoinsModal}
      /> */}
      {/* Level is displayed here */}
      <Level userInfo={userInfo} />

      <div className="flex flex-col w-full gap-y-4 lt:gap-y-4 items-center justify-between min-h-[calc(100svh-200px)] lt:min-h-[calc(100svh-200px)] pb-[100px] h-md:pb-0">
        <div className="flex flex-col items-center gap-y-2 lt:gap-y-4 w-full">
          {/* Coins are displayed here */}
          <div className="flex gap-x-2 items-center pt-4">
            <div id="globe-tap" className="">
              <PYCCoinIcon className="w-8 lt:w-12" />
            </div>
            <span className="text-2xl lt:text-4xl font-bold">
              {touchCount !== undefined && initialCoins
                ? (
                    initialCoins +
                    touchCount * userInfo.level_info.coins_per_tap
                  ).toLocaleString()
                : initialCoins}
            </span>
          </div>

          {/* Clicking happens here */}
          <div
            style={{ touchAction: "none", overscrollBehavior: "none", MozWindowDragging: "no-drag" }}
            id="pyc-gl-tap"
            className="flex relative mt-2 justify-center w-full !touch-none"
          >
            <motion.div
              initial={{ opacity: 0, rotate: 40 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="w-fit !touch-none"
              style={{ touchAction: "none", overscrollBehavior: "none", MozWindowDragging: "no-drag" }}
              onTouchEnd={handleClick}
            >
              <img
                src={`/level-globes/${userInfo.level}.png`}
                alt=""
                id="globe"
                style={{ touchAction: "none", overscrollBehavior: "none", MozWindowDragging: "no-drag" }}
                loading="eager"
                className="w-11/12 !touch-none mx-auto max-w-[300px] lt:max-w-[350px] rounded-full shadow-2xl select-none active:scale-[0.99] duration-75 transition-all"
              />
            </motion.div>
          </div>

          {/* Boost link */}
          <div className="flex mpx  w-full gap-x-4 justify-between items-center mt-4">
            <div className="text-sm font-semibold">
              {userInfo.energy_limit - decreaseInEnergy} / {userInfo.energy_limit}
            </div>
            <BoostLink />
          </div>
        </div>

        {userInfo.country_info && (
          <TapsInCountry
            touchCount={touchCount}
            countryInfo={userInfo.country_info}
          />
        )}
      </div>
    </section>
  );
};

export default Click;

const BoostLink = () => {
  return (
    <Link
      to={"/boost"}
      className="bg-yellow-p shadow-xl flex gap-x-1 items-center text-blue-p font-semibold px-6 py-2 rounded-full"
    >
      <span className="pt-[1px]">
        <BoostIcon />
      </span>
      <span>Boost</span>
    </Link>
  );
};

type LevelProps = {
  userInfo: UserInfo;
};
const Level = (props: LevelProps) => {
  let nameToDisplay =
    props.userInfo.tg_firstname || props.userInfo.tg_lastname
      ? `${props.userInfo.tg_firstname} ${props.userInfo.tg_lastname}`
      : props.userInfo.tg_username;

  if (nameToDisplay && nameToDisplay.length > 4) {
    nameToDisplay = nameToDisplay.slice(0, 4) + "...";
  }

  return (
    <div className="bg-blue-d2 rounded-b-3xl z-[2] mpx w-full flex gap-x-2 overflow-y-hidden pt-8 pb-6 relative">
      {/* Color gradient style */}
      <div className="h-[3px] shadow-xl bg-gradient-to-r from-[#00000050] rounded-b-2xl via-yellow-p opacity-70 to-[#00000050] absolute w-full bottom-0 left-1/2 -translate-x-1/2"></div>
      {/* Username */}
      <div className="bg-gradient-to-r from-[#5346F4] to-[#281FCD] px-2 py-1 lt:px-4 lt:py-2 gap-y-1 font-semibold text-xs rounded-lg w-fir flex justify-center flex-col items-center">
        <span>
          <GlobeIcon />
        </span>
        <span className="whitespace-nowrap text-[0.65rem]">
          {nameToDisplay}
        </span>
      </div>
      {/* level */}
      <Link
        to={"/levels"}
        className="bg-gradient-to-r from-[#5346F4] to-[#281FCD] px-2 py-2 rounded-lg w-full flex gap-x-2 items-center"
      >
        <div className="">
          <img
            src={`/level-globes/${props.userInfo.level}.png`}
            className="w-6 lt:w-10"
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center gap-x-2">
            <div className="flex gap-x-1 items-center">
              <h4 className="font-semibold text-xs">
                {props.userInfo.level_info.level_name}
              </h4>
              <span className="-rotate-90">
                <ArrowDownIcon className="w-2" />
              </span>
            </div>
            <span className="text-xs font-medium">
              {props.userInfo.level} <span className="opacity-50">/10</span>
            </span>
          </div>
          <div className="bg-[#ffffff2e] rounded-xl h-2 mt-2">
            <div
              style={{ width: `${props.userInfo.level * 10}%` }}
              className="bg-gradient-to-r from-yellow-p to-[#00000050] rounded-xl h-full"
            ></div>
          </div>
        </div>
      </Link>
      {/* Exchange */}
      <div className="bg-gradient-to-r from-[#5346F4] to-[#281FCD] px-4 py-2 flex flex-col gap-x-2 items-center justify-center rounded-lg w-fit">
        {props.userInfo.exchange_info && (
          <>
            <img
              src={logoPath(props.userInfo.exchange_info.logo)}
              className="w-3.5 lt:w-5 aspect-square rounded-full object-cover"
              alt=""
            />
            <span className="text-[0.65rem] font-semibold">
              {props.userInfo.exchange_info.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

type TapsInCountryProps = {
  countryInfo: CountryInfo;
  touchCount: number;
};
const TapsInCountry = (props: TapsInCountryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currTaps, setCurrTaps] = useState<number>(0);
  const [countries, setCountries] = useState<CountryInfo[]>([]);

  // ++++++++++ socket
  useEffect(() => {
    // Connect to the server
    socket.on("connection", () => {
      console.log("Connected to server");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Handle incoming messages
    socket.on("message", (data: { countries: CountryInfo[] }) => {
      const country = data.countries.find(
        (country) => country._id === props.countryInfo._id
      );
      setCountries(data.countries);

      setCurrTaps(country?.touches!);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
    };
  }, []);
  // +++++++++++++++++

  useEffect(() => {
    if (props.countryInfo.touches) {
      setCurrTaps(props.countryInfo.touches);
    }
  }, [props.countryInfo]);

  useEffect(() => {
    if (props.touchCount) {
      setCurrTaps((prev) => prev + props.touchCount);
    }
  }, [props.touchCount]);
  return (
    <>
      <button onClick={() => setShowModal(true)} className="w-full mpx">
        <h4 className="font-medium text-left text-sm lt:text-base">
          Total taps in your country
        </h4>
        <div className="bg-blue-l mt-2 rounded-lg px-4 py-2.5 lt:py-4 flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Flag country={props.countryInfo.country_code} />
            <span className="font-semibold lt:text-xl">
              {props.countryInfo.name}
            </span>
          </div>
          <div className="flex gap-x-1 items-center">
            <span className="lt:text-xl font-bold ">
              <Odometer value={currTaps} />
            </span>
            <span>
              <ArrowDownIcon />
            </span>
          </div>
        </div>
      </button>
      <CountriesModal
        countries={countries}
        open={showModal}
        setOpen={setShowModal}
      />
    </>
  );
};

type CountriesModalProps = {
  countries: CountryInfo[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const CountriesModal = (props: CountriesModalProps) => {
  return (
    <DrawerModal
      open={props.open}
      setOpen={props.setOpen}
      modalWrapperClassName="h-[80vh]"
    >
      {props.countries ? (
        <div className="w-full p-4 pb-4  flex flex-col items-start gap-y-2 overflow-y-auto">
          {props.countries.map((country) => (
            <div
              key={country._id}
              className="flex justify-between shadow-lg items-center w-full bg-blue-p p-4 rounded-lg"
            >
              <div className="flex gap-x-2 items-center">
                <span>
                  <Flag country={country.country_code} />
                </span>
                <span className="text-lg font-medium line-clamp-1">
                  {country.name}
                </span>
              </div>
              <div>
                <Odometer
                  value={country.touches}
                  className="text-lg font-medium whitespace-nowrap"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <LoaderMT wrapperClassName="h-full" />
      )}
    </DrawerModal>
  );
};

// ICons
type PYCCoinIconProps = {
  className?: string;
};
export const PYCCoinIcon = (props: PYCCoinIconProps) => {
  return (
    <img
      src="/logos/pyc-coin.png"
      className={cn(`w-12 aspect-square rounded-full`, props.className)}
      alt=""
    />
  );
};
export const FireIcon = (props: PYCCoinIconProps) => {
  return (
    <svg
      width="15"
      height="20"
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.6922 7.59082C12.6383 7.52324 12.5729 7.53652 12.5386 7.55031C12.5099 7.56195 12.4441 7.59914 12.4532 7.69234C12.4642 7.80425 12.4703 7.91835 12.4715 8.03151C12.4763 8.50096 12.288 8.96088 11.9548 9.29334C11.6237 9.62364 11.1883 9.80161 10.7246 9.79645C10.0913 9.78837 9.56595 9.45802 9.20545 8.84111C8.90736 8.331 9.03838 7.67308 9.17709 6.97649C9.25826 6.56876 9.3422 6.14712 9.3422 5.74584C9.3422 2.6213 7.24168 0.818663 5.98958 0.0222263C5.96368 0.00578118 5.93904 0 5.9172 0C5.88169 0 5.85357 0.0153123 5.8397 0.0246872C5.81283 0.0428902 5.76982 0.0843741 5.78365 0.157811C6.26224 2.69927 4.83475 4.22781 3.32344 5.84607C1.76564 7.51414 0 9.40478 0 12.8146C0 16.7766 3.22329 19.9999 7.18527 19.9999C10.4474 19.9999 13.3236 17.7255 14.1795 14.4691C14.7632 12.2487 14.1516 9.42025 12.6922 7.59082ZM7.36453 18.4662C6.37243 18.5114 5.42892 18.1556 4.70827 17.4665C3.99535 16.7848 3.58645 15.8335 3.58645 14.8564C3.58645 13.0227 4.28753 11.6767 6.17321 9.88966C6.20407 9.8604 6.23567 9.85114 6.26321 9.85114C6.28817 9.85114 6.30981 9.85876 6.3247 9.86591C6.35606 9.88102 6.40763 9.91845 6.40067 9.99938C6.33325 10.7839 6.33442 11.4351 6.40411 11.935C6.58223 13.2117 7.51687 14.0696 8.72994 14.0696C9.3247 14.0696 9.89122 13.8457 10.3252 13.4393C10.3755 13.3921 10.4318 13.3981 10.4533 13.4027C10.4819 13.4089 10.5201 13.4264 10.5402 13.4747C10.7201 13.9091 10.812 14.3702 10.8134 14.8452C10.8192 16.7563 9.27201 18.3807 7.36453 18.4662Z"
        fill="#291BDB"
      />
    </svg>
  );
};
export const ArrowDownIcon = (props: PYCCoinIconProps) => {
  return (
    <svg
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(`w-2.5`, props.className)}
    >
      <path
        d="M6.49998 7C6.26699 7 6.03403 6.91597 5.8564 6.74825L0.266684 1.46804C-0.0888948 1.13215 -0.0888948 0.587565 0.266684 0.251814C0.62212 -0.0839379 1.19852 -0.0839379 1.55412 0.251814L6.49998 4.92404L11.4459 0.251977C11.8014 -0.0837747 12.3778 -0.0837747 12.7332 0.251977C13.0889 0.587728 13.0889 1.13231 12.7332 1.4682L7.14355 6.74842C6.96584 6.91616 6.73288 7 6.49998 7Z"
        fill="white"
      />
    </svg>
  );
};
export const GlobeIcon = (props: PYCCoinIconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 0C4.03202 0 0 4.03202 0 9C0 13.968 4.03202 18 9 18C13.968 18 18 13.968 18 9C18 4.03202 13.968 0 9 0ZM17.1849 8.59401H14.8729C14.8109 6.375 14.2159 4.28306 13.218 2.68698C12.905 2.21901 12.5609 1.78202 12.2169 1.43802C15.0279 2.625 17.03 5.37397 17.1849 8.59401ZM10.0909 2.96901C10.4659 4.46901 10.655 6.43698 10.6859 8.56302H7.34194C7.37293 6.43698 7.56198 4.46901 7.93698 2.96901C8.37397 1.15599 8.87293 0.75 9.03099 0.75C9.15496 0.780992 9.65702 1.15599 10.094 2.96901H10.0909ZM7.77893 1.00103C7.55888 1.43802 7.34194 2.06405 7.15289 2.81405C6.77789 4.37603 6.55785 6.40599 6.52686 8.59401H3.87087C3.93285 6.53306 4.46591 4.59297 5.40186 3.12707C6.08988 2.06405 6.90186 1.34504 7.77583 1.00103H7.77893ZM6.56095 9.375C6.59194 11.563 6.81198 13.593 7.18698 15.155C7.37293 15.905 7.56198 16.5 7.81302 16.968C6.93905 16.624 6.12707 15.905 5.47004 14.876C4.53099 13.407 4.00103 11.47 3.93905 9.40909H6.56405V9.3781L6.56095 9.375ZM7.90599 14.969C7.53099 13.469 7.34194 11.501 7.31095 9.375H10.655C10.624 11.501 10.4349 13.469 10.0599 14.969C9.62293 16.782 9.12397 17.188 8.96591 17.188C8.84194 17.188 8.33988 16.782 7.90289 14.969H7.90599ZM10.218 16.937C10.438 16.5 10.655 15.874 10.844 15.124C11.219 13.562 11.439 11.532 11.47 9.34401H14.126C14.064 11.405 13.531 13.345 12.595 14.8109C11.907 15.874 11.095 16.593 10.2211 16.937H10.218ZM11.4359 8.59401C11.405 6.40599 11.1849 4.37603 10.8099 2.81405C10.624 2.06405 10.4349 1.47211 10.1839 1.00103C11.0579 1.34504 11.8698 2.06405 12.5269 3.09607C13.4628 4.56508 13.9959 6.50207 14.0579 8.56302L11.4329 8.59401H11.4359ZM5.77996 1.40702C5.40496 1.75103 5.09194 2.18802 4.77893 2.65599C3.7469 4.24897 3.18595 6.34401 3.12397 8.56302H0.811983C0.966942 5.37707 2.96901 2.625 5.77996 1.40702ZM0.811983 9.375H3.12397C3.18595 11.594 3.78099 13.6859 4.77893 15.282C5.09194 15.75 5.43595 16.187 5.77996 16.531C2.96901 15.313 0.966942 12.564 0.811983 9.375ZM12.2169 16.531C12.5919 16.187 12.905 15.75 13.218 15.282C14.25 13.689 14.8109 11.594 14.8729 9.375H17.1849C17.03 12.5609 15.0279 15.313 12.2169 16.531Z"
        fill="white"
      />
    </svg>
  );
};
export const BoostIcon = (props: PYCCoinIconProps) => {
  return (
    <svg
      width="11"
      height="18"
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9697 6.17341C10.9167 6.06781 10.8024 6.00002 10.6766 6.00002H6.84278L10.6264 0.460513C10.6895 0.368122 10.6934 0.251122 10.6365 0.155426C10.5795 0.0594142 10.4708 0 10.353 0H5.17659C5.05398 0 4.94202 0.0641954 4.88705 0.165903L0.0341149 9.16592C-0.0160447 9.25863 -0.0105472 9.36902 0.0483325 9.45751C0.107553 9.546 0.211399 9.6 0.323661 9.6H3.6505L0.0253568 17.5836C-0.0364423 17.7201 0.0185704 17.8785 0.154756 17.9559C0.207152 17.9856 0.265387 18 0.323319 18C0.41617 18 0.507731 17.9631 0.57116 17.8935L10.9241 6.49348C11.0053 6.40411 11.0227 6.27931 10.9697 6.17341Z"
        fill="#291BDB"
      />
    </svg>
  );
};
