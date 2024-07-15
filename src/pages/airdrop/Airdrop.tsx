import CoinsDisplayCard from "@/components/CoinsDisplayCard";
import PYCCoinsText from "@/components/PYCCoinsText";
import DrawerModal from "@/components/modals/DrawerModal";
import { useFetch } from "@/hooks/useFetch";
import { Activity, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import React, { SetStateAction } from "react";
import SocialMediaBlock, { CheckMark } from "./SocialMediaBlock";
import Navbar from "@/components/Navbar";
import WebApp from "@twa-dev/sdk";
import LoaderMT from "@/components/LoaderMT";
import { getPaycioInfo } from "@/lib/getPaycioInfo";
import toast from "react-hot-toast";
import { sendPostRequest } from "@/lib/sendRequest";
import { useBlast } from "@/components/CoinBlast";

const Airdrop = () => {
  const tg_id = getTGID();
  const {
    isLoading: user_isLoading,
    data: userData,
    refetch: refetchUserInfo,
  } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const { isLoading: activities_isLoading, data: activitiesData } = useFetch<
    Activity[]
  >({
    serverPath: "/api/v1/activities?type=social-media",
  });
  const socialMedia = activitiesData?.data;
  const userInfo = userData?.data;
  if (user_isLoading || activities_isLoading) return <LoaderMT />;
  if (!userInfo || !socialMedia) return <div>No data</div>;
  return (
    <>
      {/* <CoinsDisplayCard coins={userInfo.pyc_coins} /> */}
      <main className="mpx pb-24">
        {/* Paycio installtion */}
        <PaycioActivities
          refetchUserInfo={refetchUserInfo}
          userInfo={userInfo}
        />
        <SocialMediaBlock
          refetchUserInfo={refetchUserInfo}
          socialMedia={socialMedia}
          userInfo={userInfo}
        />
      </main>
      <Navbar />
    </>
  );
};

export default Airdrop;
type PaycioActivitiesProps = {
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const PaycioActivities = (props: PaycioActivitiesProps) => {
  const handleClick = () => {
    WebApp.requestContact((access) => {
      if (access) {
        setTimeout(() => {
          props.refetchUserInfo();
        }, 500);
      }
    });
  };
  return (
    <div className="mt-8">
      <h3 className="font-semibold">Download & install Paycio app</h3>
      <p className="text-xs lt:text-sm opacity-80">
        To proceed with these tasks, please share your mobile number first.
      </p>
      <div className="mt-2 flex flex-col gap-y-2">
        <button
          onClick={handleClick}
          className="border border-white rounded-lg py-3 font-semibold"
        >
          Share mobile number
        </button>
        <PaycioRegistration
          refetchUserInfo={props.refetchUserInfo}
          userInfo={props.userInfo}
        />
        <PaycioKYC
          refetchUserInfo={props.refetchUserInfo}
          userInfo={props.userInfo}
        />
      </div>
    </div>
  );
};
type PaycioRegistrationProps = {
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const PaycioRegistration = (props: PaycioRegistrationProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const handleClick = () => {
    if (!props.userInfo.phone_number) {
      toast("Please share your phone number");
      return;
    } else {
      setShowModal(true);
    }
  };
  return (
    <>
      <button
        disabled={props.userInfo.is_paycio_user}
        onClick={handleClick}
        className="pyc-sm-c"
      >
        <div className="flex items-center gap-x-2">
          <img src="/logos/pyc-logo.png" className=" rounded-full" alt="" />
          <div className="flex flex-col">
            <span className=" font-semibold text-left">
              Paycio registration
            </span>
            <PYCCoinsText tokens={100000} />
          </div>
        </div>
        {props.userInfo.is_paycio_user && (
          <div>
            <CheckMark />
          </div>
        )}
      </button>
      <PaycioRegistrationModal
        userInfo={props.userInfo}
        open={showModal}
        setOpen={setShowModal}
        refetchUserInfo={props.refetchUserInfo}
      />
    </>
  );
};

type PaycioRegistrationModalProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};

const PaycioRegistrationModal = (props: PaycioRegistrationModalProps) => {
  const tg_id = getTGID();
  const { blast } = useBlast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const downloadLink =
    WebApp.platform === "ios"
      ? "https://m.paycio.com/"
      : "https://play.google.com/store/apps/details?id=com.paycio&hl=en&pli=1";

  const updateUserInfo = async () => {
    const response = await sendPostRequest(`/api/v1/paycio-user/${tg_id}`, {});
    if (response.status) {
      toast.dismiss();
      setIsSubmitting(false);
      props.refetchUserInfo();
      blast();
      toast.success("Completed");
      props.setOpen(false);
    } else {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error(response.message);
      props.setOpen(false);
    }
  };
  const handleCompletedClick = async () => {
    try {
      setIsSubmitting(true);
      toast.loading("Please wait...");
      if (!props.userInfo.phone_number) {
        alert(
          "Please share your phone number, if already done try reloading the page"
        );
        toast.dismiss();
        setIsSubmitting(false);
        return;
      }
      if (props.userInfo.is_paycio_user) {
        toast.dismiss();
        setIsSubmitting(false);
        toast("Task already completed");
        return;
      }
      const response = await getPaycioInfo(props.userInfo.phone_number);
      if (!response) {
        toast.dismiss();
        toast.error("Something went wrong");
        setIsSubmitting(false);
        return;
      }
      if (response.responsecode === 200 && response.UserInfo.length === 1) {
        await updateUserInfo();
      } else {
        toast.dismiss();
        setIsSubmitting(false);
        toast.error(response.message);
      }
    } catch (error) {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error("Something went wrong");
    }
  };
  return (
    <DrawerModal
      modalWrapperClassName="h-fit"
      open={props.open}
      setOpen={props.setOpen}
    >
      <div className="py-9 px-2 flex flex-col  items-center gap-y-3">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full p-2">
          <img src="/logos/pyc-logo.png" className="w-14" alt="" />
        </div>

        {/* Registration info */}
        <div className="flex flex-col gap-y-2 items-center border-b border-[#7E74FF] pb-6 w-full">
          <h2 className="text-xl font-semibold text-center">
            Download and register on Paycio
          </h2>
          <PYCCoinsText
            tokens={100000}
            imageClassName="w-6"
            textClassName="text-xl"
          />
          <a
            href={downloadLink}
            target="_blank"
            className="flex gap-x-2 text-lg items-center text-center w-fit mx-auto mt-2 font-semibold rounded-lg bg-white text-blue-p px-4 py-3"
          >
            <span>Download App</span>
            <span>
              <LinkIcon />
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-y-2 items-center mt-2">
          <p className="text-center font-semibold">
            Already registered? click the button below
          </p>
          <button
            disabled={isSubmitting}
            onClick={handleCompletedClick}
            className="text-blue-p disabled:opacity-55 text-lg mt-2 block text-center w-fit mx-auto font-semibold rounded-lg bg-white px-4 py-3"
          >
            Completed
          </button>
        </div>
      </div>
    </DrawerModal>
  );
};
type PaycioKYCProps = {
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const PaycioKYC = (props: PaycioKYCProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const handleClick = () => {
    if (!props.userInfo.is_paycio_user) {
      toast.error("Complete your Paycio registeration");
      return;
    }
    if (!props.userInfo.phone_number) {
      toast.error("Please share your phone number");
      return;
    }
    setShowModal(true);
  };
  return (
    <>
      <button
        disabled={props.userInfo.paycio_kyc_status}
        onClick={handleClick}
        className="pyc-sm-c"
      >
        <div className="flex items-center gap-x-2">
          <PYCKYCIcon />
          <div className="flex flex-col">
            <span className=" font-semibold text-left">Paycio KYC</span>
            <PYCCoinsText tokens={50000} />
          </div>
        </div>
        {props.userInfo.paycio_kyc_status && (
          <div>
            <CheckMark />
          </div>
        )}
      </button>
      <PYCKYCModal
        refetchUserInfo={props.refetchUserInfo}
        open={showModal}
        setOpen={setShowModal}
        userInfo={props.userInfo}
      />
    </>
  );
};

type PYCKYCModalProps = {
  userInfo: UserInfo;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  refetchUserInfo: () => void;
};
const PYCKYCModal = (props: PYCKYCModalProps) => {
  const tg_id = getTGID();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const updateUserInfo = async () => {
    const response = await sendPostRequest(
      `/api/v1/paycio-kyc-status/${tg_id}`,
      {}
    );
    if (response.status) {
      toast.dismiss();
      setIsSubmitting(false);
      toast.success("Completed");
      props.setOpen(false);
    } else {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error(response.message);
      props.setOpen(false);
    }
  };
  const handleCheckClick = async () => {
    try {
      setIsSubmitting(true);
      toast.loading("Checking...");
      if (props.userInfo.paycio_kyc_status) {
        toast.dismiss();
        toast("KYC already completed");
        setIsSubmitting(false);
        return;
      }
      if (!props.userInfo.phone_number) {
        toast.dismiss();
        toast("Please share your phone number");
        setIsSubmitting(false);
        return;
      }
      const response = await getPaycioInfo(props.userInfo.phone_number);
      if (response.responsecode !== 200 && response.UserInfo.length !== 1) {
        toast.dismiss();
        toast.error(response.message);
        setIsSubmitting(false);
        return;
      }

      if (response.UserInfo[0].users_kyc_status.toLowerCase() != "verified") {
        toast.dismiss();
        setIsSubmitting(false);
        toast.error("Your KYC status is not verified");
        return;
      }
      await updateUserInfo();
    } catch (error) {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error("Something went wrong");
    }
  };
  return (
    <DrawerModal
      open={props.open}
      setOpen={props.setOpen}
      modalWrapperClassName="min-h-fit"
    >
      <div className="w-full rounded-t-3xl pt-8 px-2 relative">
        <img
          src="/logos/pyc-logo.png"
          className="w-14 absolute -top-6 left-1/2 -translate-x-1/2"
          alt=""
        />
        <div className="flex flex-col bg-blue-p gap-y-2 items-center py-4 px-2 rounded-lg">
          <div className="mt-2">
            <PYCCoinsText
              tokens={50000}
              textClassName="text-3xl"
              imageClassName="w-6"
            />
          </div>
          <h1 className="text-2xl font-semibold text-center">
            Complete your KYC on Paycio
          </h1>
        </div>

        <div className="flex flex-col gap-y-2 items-center mb-8 mt-4">
          <h2 className="font-semibold">
            Already completed? Check the below button
          </h2>
          <button
            disabled={isSubmitting}
            onClick={handleCheckClick}
            className="disabled:opacity-50 w-full font-semibold bg-white rounded-lg px-4 py-4 mt-2 text-blue-p text-xl"
          >
            Check
          </button>
        </div>
      </div>
    </DrawerModal>
  );
};

export const PYCKYCIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.98676 19.8367C9.98676 20.5207 10.1236 21.2048 10.2604 21.8888H0C0 16.5534 4.24095 12.3124 9.57634 12.3124C10.9444 12.3124 12.1756 12.586 13.4069 13.1333C11.3548 14.6381 9.98676 17.1006 9.98676 19.8367Z"
        fill="white"
      />
      <path
        d="M9.57645 10.9444C12.5987 10.9444 15.0486 8.49441 15.0486 5.4722C15.0486 2.44999 12.5987 0 9.57645 0C6.55423 0 4.10425 2.44999 4.10425 5.4722C4.10425 8.49441 6.55423 10.9444 9.57645 10.9444Z"
        fill="white"
      />
      <path
        d="M26.9505 25.0353L23.5304 22.5728C23.9408 21.752 24.2144 20.7943 24.2144 19.8367C24.2144 16.6902 21.6151 14.0909 18.4686 14.0909C15.3221 14.0909 12.7228 16.6902 12.7228 19.8367C12.7228 22.9832 15.3221 25.5825 18.4686 25.5825C19.9734 25.5825 21.4783 24.8985 22.4359 23.9408L25.0352 26.9505C25.3088 27.2242 26.2665 27.6346 26.9505 26.9505C27.4977 26.4033 27.4977 25.5825 26.9505 25.0353ZM18.4686 22.2992C17.1005 22.2992 16.0061 21.2047 16.0061 19.8367C16.0061 18.4686 17.1005 17.3742 18.4686 17.3742C19.8366 17.3742 20.9311 18.4686 20.9311 19.8367C20.9311 21.2047 19.8366 22.2992 18.4686 22.2992Z"
        fill="white"
      />
    </svg>
  );
};
export const LinkIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1002 7.2C17.5971 7.2 18 6.79705 18 6.3V0.9C18 0.402948 17.5971 0 17.1002 0H11.6979C11.2009 0 10.798 0.402939 10.798 0.9C10.798 1.39705 11.2009 1.8 11.6979 1.8H14.9279L7.18329 9.54594C6.83188 9.89739 6.83188 10.4673 7.18329 10.8187C7.53474 11.1703 8.10443 11.1703 8.45582 10.8187L16.2003 3.07293V6.3C16.2003 6.79705 16.6032 7.2 17.1002 7.2ZM2.69953 2.7C1.20862 2.7 0 3.90883 0 5.4V15.3C0 16.7912 1.20862 18 2.69953 18H12.5978C14.0887 18 15.2973 16.7912 15.2973 15.3V9.9C15.2973 9.40293 14.8945 9 14.3975 9C13.9005 9 13.4976 9.40293 13.4976 9.9V15.3C13.4976 15.7971 13.0948 16.2 12.5978 16.2H2.69953C2.20256 16.2 1.79969 15.7971 1.79969 15.3V5.4C1.79969 4.90295 2.20256 4.5 2.69953 4.5H8.09858C8.59557 4.5 8.99843 4.09705 8.99843 3.6C8.99843 3.10295 8.59557 2.7 8.09858 2.7H2.69953Z"
        fill="#3E31F1"
      />
    </svg>
  );
};
