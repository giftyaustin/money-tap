import BackButton from "@/components/BackButton";
import DrawerModal from "@/components/modals/DrawerModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { logoPath } from "@/lib/utils";
import WebApp from "@twa-dev/sdk";
import { sendPostRequest } from "@/lib/sendRequest";
import toast from "react-hot-toast";
import { Token, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import LoaderMT from "@/components/LoaderMT";
import { useBlast } from "@/components/CoinBlast";
import PYCCoinsText from "@/components/PYCCoinsText";

const TokenMembership = () => {
  const tg_id = getTGID();
  const chainType = useParams().chain;

  const { data: apiRes, isLoading } = useFetch<Token[]>({
    serverPath: `/api/v1/tokens/${chainType}`,
  });
  const { data: userRes } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userData = userRes?.data;

  const [initialSelectedToken, setInitialSelectedToken] =
    useState<null | Token>(null);

  const [selectedToken, setSelectedToken] = useState<null | Token>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const router = useNavigate();
  const tokens = apiRes?.data;

  const handleTokenValueChange = (value: string) => {
    const newToken = tokens?.find((token) => token._id === value);
    if (newToken) {
      setSelectedToken(newToken);
    }
  };

  useEffect(() => {
    if (tokens && tokens.length > 0 && userData) {
      const it_ = tokens.find((token) => {
        console.log(token._id, userData.selected_token_membership);
        return token._id === userData.selected_token_membership;
      });

      if (it_) {
        setInitialSelectedToken(it_);
      }
    }
  }, [tokens, userData]);

  useEffect(() => {
    if (initialSelectedToken) {
      router("/exchange");
    }
  }, [initialSelectedToken]);
  useEffect(() => {
    if (selectedToken) {
      setShowInfoModal(true);
    }
  }, [selectedToken]);

  if (isLoading) return <LoaderMT />;
  if (!tokens || !userData) return <p>Error</p>;
  return (
    <>
      {/* Header */}
      <div className="flex top-0 bg-blue-p items-start gap-x-4 fixed main-width pt-6 w-full z-10 mpx">
        {/* <BackButton btnClassName="" /> */}
        <div>
          <h1 className="text-2xl font-medium gap-x-4">Active token member</h1>
          <p className="text-sm opacity-90">
            You will get extra bonus as per your selected token community
          </p>
        </div>
      </div>
      <main className="relative mt-[120px] pb-4 mpx">
        {/* Tokens list */}
        <RadioGroup
          defaultValue={initialSelectedToken?._id}
          disabled={initialSelectedToken ? true : false}
          className="w-full flex flex-col gap-y-2"
          onValueChange={handleTokenValueChange}
        >
          {tokens?.map((token, i) => {
            return (
              <TokenCard
                initialSelectedToken={initialSelectedToken}
                key={i}
                token={token}
              />
            );
          })}
        </RadioGroup>
      </main>
      {/* Buttons */}
      {/* <div className="fixed main-width bottom-0 w-full z-10 mpx bg-black pb-12">
        <div className="h-16 bg-gradient-to-b from-transparent via-black to-black  absolute w-full left-1/2 -translate-x-1/2 -top-16"></div>
        <button
          type="button"
          onClick={handleContinueClick}
          className="bg-yellow-p text-black rounded-lg w-full p-4"
        >
          Continue
        </button>
        <button className="text-yellow-p text-center w-full pt-4">
          Add other TON token
        </button>
      </div> */}
      {selectedToken && (
        <TokenInfoModal
          open={showInfoModal}
          setOpen={setShowInfoModal}
          token={selectedToken}
          userData={userData}
        />
      )}
    </>
  );
};

export default TokenMembership;

export type TokenOverview = {
  id: string | number;
  name: string;
  imgUrl: string;
  tokens: number;
};
type TokenCardProps = {
  token: Token;
  initialSelectedToken: Token | null | undefined;
};
export const TokenCard = (props: TokenCardProps) => {
  return (
    <label
      htmlFor={props.token._id}
      className="bg-blue-l cursor-pointer rounded-lg  flex items-center justify-between gap-x-4 px-6 py-3"
    >
      <div className="flex gap-x-2 items-center">
        <img
          src={logoPath(props.token.logo)}
          className="w-10 aspect-square rounded-full object-cover"
          alt=""
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{props.token.ticker}</span>
          <span className="text-xs text-yellow-p font-bold">
            {props.token.name}
          </span>
        </div>
      </div>
      <div>
        <RadioGroupItem value={props.token._id} id={props.token._id} />
      </div>
    </label>
  );
};

type TokenInfoModalProps = {
  token: Token;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserInfo;
};
const TokenInfoModal = (props: TokenInfoModalProps) => {
  const tg_id = getTGID();
  const { blast } = useBlast();
  const router = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);
  const handleContinueClick =async () => {
    toast.loading("Please wait...");
    setSubmitting(true);
    await updateUserInfo();
  };
  const updateUserInfo = async () => {
    if (props.token && props.userData) {
      const coinsToAdd = props.token.coins;
      const response = await sendPostRequest(`/api/v1/update-user/${tg_id}`, {
        selected_token_membership: props.token._id,
        pyc_coins: coinsToAdd,
      });
      if (response.status) {
        toast.dismiss();
        // setSubmitting(false);
        blast();
        toast.success(`${props.token.coins} coins added`);
        setTimeout(() => {
          router("/exchange");
          
        }, 500)
      } else {
        toast.dismiss();
        setSubmitting(false);
        toast.error(response.message);
        props.setOpen(false);
        return;
      }
    }
  };
  return (
    <DrawerModal
      open={props.open}
      setOpen={props.setOpen}
      modalWrapperClassName="min-h-fit"
    >
      <div className="relative text-center px-2 w-full">
        <img
          src={logoPath(props.token.logo)}
          className="rounded-full w-24 aspect-square absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-black"
          alt=""
        />
        <div className="mt-16 flex flex-col items-center p-4 rounded-lg gap-y-4 bg-blue-p w-full">
          <PYCCoinsText
            tokens={props.token.coins}
            textClassName="text-3xl"
            imageClassName="w-12"
          />
          <h2 className="text-2xl font-semibold">
            You've selected {props.token.name}!
          </h2>
        </div>
        <button
          disabled={submitting}
          onClick={handleContinueClick}
          className="flex mt-2 w-full text-center justify-center disabled:opacity-50 rounded-lg mx-auto px-10 py-4 bg-yellow-p text-blue-p font-semibold text-xl mb-8"
        >
          Okay
        </button>
      </div>
    </DrawerModal>
  );
};

// ================ ICONS ===============

export const AddIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30.42"
      height="30.42"
      viewBox="0 0 30.42 30.42"
    >
      <g id="Add_icon" data-name="Add icon" transform="translate(-2.25 -2.25)">
        <path
          id="Path_3695"
          data-name="Path 3695"
          d="M31.92,17.46A14.46,14.46,0,1,1,17.46,3,14.46,14.46,0,0,1,31.92,17.46Z"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_3696"
          data-name="Path 3696"
          d="M18,12V23.568"
          transform="translate(-0.54 -0.324)"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_3697"
          data-name="Path 3697"
          d="M12,18H23.568"
          transform="translate(-0.324 -0.54)"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};
