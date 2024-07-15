import React from "react";
import { motion } from "framer-motion";
import { IntroPage, SkipNext } from "./Intro";
type PaycioPageProps = {
  page: IntroPage;
  setPage: (page: IntroPage) => void;
};
const ReferralsIntro = (props: PaycioPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100svh] flex flex-col justify-between"
    >
      <div>
        <div className="rounded-xl bg-gradient-to-tr from-[#5a5dff] shadow-lg via-blue-p to-blue-p justify-center items-center flex aspect-square w-full max-w-[500px]">
          <img
            src="/intro/referrals.png"
            className="max-w-[250px] pl-2"
            alt=""
          />
        </div>
        {/* <Dots page={props.page} setPage={props.setPage} next="social-media" /> */}
        <div className="mt-8">
          <h1 className="font-bold text-2xl text-center lt:text-3xl">Refer and Earn</h1>
          <p className=" lt:text-lg mt-4 text-center">
            Earn even more coins! Refer to your friends and family now!
          </p>
        </div>
      </div>

      <SkipNext next="social-media" page={props.page} setPage={props.setPage} />
    </motion.div>
  );
};

export default ReferralsIntro;
