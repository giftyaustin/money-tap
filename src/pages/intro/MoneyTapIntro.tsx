import React, { useState, useEffect, useRef } from "react";
import { IntroPage } from "./Intro";
import { useNavigate } from "react-router-dom";
import { sendGetRequest, sendPostRequest } from "@/lib/sendRequest";
import { getTGID } from "@/lib/getTGID";

type PaycioPageProps = {
  page: IntroPage;
  setPage: (page: IntroPage) => void;
};

const MoneyTapIntro = (props: PaycioPageProps) => {
  const router = useNavigate();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleIUnderstand = async () => {
    const response = await sendGetRequest(
      `/api/v1/acknowledge-user/${getTGID()}`
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && !isScrolledToBottom) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
        setIsScrolledToBottom(isBottom);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initially if already at the bottom
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative pb-28">
      <div
        className="overflow-y-scroll h-[calc(100vh-112px)]" // Adjust height as needed
        ref={contentRef}
      >
        <h1 className="text-2xl font-bold">What is MoneyTap?</h1>
        <p className="mt-4">
          MoneyTap is an innovative and captivating clicker game developed by
          Paycio to aimed at broadening its user base and boost global
          connectivity. In this creative game, players tap on a digital globe
          icon to earn in-game currency named Paycio coins, which can be used to
          enrich gameplay and boost the levels. MoneyTap offers an engaging
          gaming experience while promoting a worldwide community of connected
          players. Paycio successfully merges entertainment with global unity,
          creating a platform where players from around the world can connect,
          compete, and thrive together.
        </p>
        <h1 className="mt-4 text-2xl font-bold">How to play?</h1>
        <p className="mt-4">
          Choose the country you wish to play for, then tap on the digital globe
          icon to earn Paycio coins. The game consists of 10 levels, and
          completing all of them will earn you the prestigious title of "Legend"
          for your country. To boost your earnings, keep a vigilant eye on your
          energy levels. Engage in daily combos and complete missions to obtain
          additional rewards and power-ups.
        </p>

        <h1 className="mt-4 text-2xl font-bold">How to surpass the levels?</h1>
        <p className="mt-4">
          After successfully completing all 10 levels in your current country,
          you have the exciting opportunity to explore and conquer new
          territories. Select a different country and begin a fresh journey from
          level 1. If you wish to skip the first level, you can use the coins
          you've collected from your previous country. By clicking on the
          "Claim" button, you can use these coins to cover the cost of level 1.
          The required coins will be deducted from your total, allowing you to
          advance to the next level with your remaining coins seamlessly.
        </p>
      </div>

      <div className="fixed px-6 shadow-top-lg bottom-0  py-4  left-1/2 -translate-x-1/2 w-full">
        <button
          onClick={() => {
            handleIUnderstand();
            router("/country");
          }}
          className={`bg-white rounded-lg w-full text-blue-p block text-center py-3 font-semibold ${
            !isScrolledToBottom ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isScrolledToBottom}
        >
          I understand
        </button>
      </div>
    </div>
  );
};

export default MoneyTapIntro;
