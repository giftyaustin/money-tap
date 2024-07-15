import BackButton from "@/components/BackButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { Dispatch, useEffect, useState } from "react";
import DrawerModal from "@/components/modals/DrawerModal";
import ExchangeNav from "@/components/ExchangeNav";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useFetch } from "@/hooks/useFetch";
import { logoPath } from "@/lib/utils";
import WebApp from "@twa-dev/sdk";
import { sendPostRequest } from "@/lib/sendRequest";
import toast from "react-hot-toast";
import { Activity, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import LoaderMT from "@/components/LoaderMT";
import CoinConfetti from "@/components/CoinConfetti";
import { useBlast } from "@/components/CoinBlast";
import PYCCoinsText from "@/components/PYCCoinsText";

const Exchange = () => {
  const tg_id = getTGID();
  const router = useNavigate();
  const { isLoading: exchange_isLoading, data: exchangeRes } = useFetch<
    Activity[]
  >({
    serverPath: "/api/v1/activities?type=exchange",
  });
  const exchanges = exchangeRes?.data;

  const { isLoading: userInfoLoading, data: userRes } = useFetch<UserInfo>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = userRes?.data;
  const [selectedExchange, setSelectedExchange] =
    React.useState<null | Activity>(null);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [initialSelectedToken, setInitialSelectedToken] =
    useState<null | Activity>(null);
  const handleExchangeValueChange = (value: string) => {
    if (!exchanges) return;
    const newExchange = exchanges.find((exchange) => exchange.name === value);
    if (newExchange) {
      setSelectedExchange(newExchange);
    }
  };

  useEffect(() => {
    if (exchanges && exchanges.length > 0 && userInfo) {
      setInitialSelectedToken(
        exchanges.find((token) => token._id === userInfo?.selected_exchange) ||
          null
      );
    }
  }, [exchanges, userInfo]);

  useEffect(() => {
    if (initialSelectedToken) {
      router("/tap");
    }
  }, [initialSelectedToken]);

  useEffect(() => {
    if (selectedExchange) {
      setShowInfoModal(true);
    }
  }, [selectedExchange]);
  if (exchange_isLoading || userInfoLoading) return <LoaderMT />;
  if (!exchanges) return <LoaderMT />;
  return (
    <>
      Header
      <div className="flex top-0 bg-blue-p items-start gap-x-4 fixed main-width pt-6 w-full z-10 mpx">
        <div className="flex gap-x-2">
          {/* <BackButton /> */}
          <div>
            <h1 className="text-2xl font-medium items-start">
              Choose exchange
            </h1>
            <p className="opacity-90 text-sm">Pick your preferred exchange</p>
          </div>
        </div>
      </div>

      <main className="mpx mt-[80px] pb-4">
        {/* Tokens list */}
        <RadioGroup
          className="w-full flex flex-col gap-y-2"
          onValueChange={handleExchangeValueChange}
        >
          {exchanges.map((exchange, i) => {
            return <ExchangeCard key={i} exchange={exchange} />;
          })}
        </RadioGroup>
      </main>

      {/* <div className="bg-blue-p mpx fixed bottom-0 w-full py-8 shadow-top-lg max-w-[500px]">
        <button
          onClick={handleContinueClick}
          className="w-full bg-yellow-p rounded-lg text-black font-semibold text-center px-4 py-3"
        >
          Continue
        </button>
      </div> */}
      {selectedExchange && (
        <ExchangeInfoModal
          open={showInfoModal}
          setOpen={setShowInfoModal}
          exchange={selectedExchange}
          userInfo={userInfo}
        />
      )}
    </>
  );
};

export default Exchange;

export type ExchangeOverview = {
  name: string;
  imgUrl: string;
  id: string | number;
  tokens: number;
};
type ExchangeCardProps = {
  exchange: Activity;
};
export const ExchangeCard = (props: ExchangeCardProps) => {
  return (
    <label
      htmlFor={props.exchange.name}
      className="bg-blue-l cursor-pointer rounded-lg  flex items-center justify-between gap-x-4 px-6 py-3"
    >
      <div className="flex gap-x-2 items-center">
        <img
          src={logoPath(props.exchange.logo)}
          className="w-10 aspect-square rounded-full object-cover"
          alt=""
        />
        <span className="text-lg">{props.exchange.name}</span>
      </div>
      <div>
        <RadioGroupItem value={props.exchange.name} id={props.exchange.name} />
      </div>
    </label>
  );
};

type ExchangeInfoModalProps = {
  exchange: Activity;
  userInfo: UserInfo | undefined;
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
};
const ExchangeInfoModal = (props: ExchangeInfoModalProps) => {
  const tg_id = getTGID();
  const { blast } = useBlast();
  const router = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const updateUserInfo = async () => {
    if (!props.exchange) {
      toast.dismiss();
      setSubmitting(false);
      toast.error("Please select an exchange");
      return;
    }
    if (props.exchange && props.userInfo) {
      if (!tg_id) {
        toast.dismiss();
        setSubmitting(false);
        return;
      }
      const coinsToAdd = props.exchange.coins;
      const response = await sendPostRequest(`/api/v1/update-user/${tg_id}`, {
        selected_exchange: props.exchange._id,
        pyc_coins: coinsToAdd,
      });
      if (response.status === true) {
        toast.dismiss();
        setSubmitting(false);
        toast.success(`${props.exchange.coins} coins added`);
        blast();
        setTimeout(() => {
          router("/tap");
        }, 500)
      } else {
        toast.dismiss();
        setSubmitting(false);
        toast.error(response.message);
      }
    }
  };

  const handleContinueClick = () => {
    toast.loading("Please wait...");
    setSubmitting(true);
    updateUserInfo();
  };

  return (
    <DrawerModal
      open={props.open}
      setOpen={props.setOpen}
      modalWrapperClassName="min-h-fit"
    >
       <div className="relative text-center px-2 w-full">
        <img
          src={logoPath(props.exchange.logo)}
          className="rounded-full w-24 aspect-square absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-black"
          alt=""
        />
        <div className="mt-16 flex flex-col items-center p-4 rounded-lg gap-y-4 bg-blue-p w-full">
          <PYCCoinsText
            tokens={props.exchange.coins}
            textClassName="text-3xl"
            imageClassName="w-12"
          />
          <h2 className="text-2xl font-semibold">
            You've selected {props.exchange.name}!
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
