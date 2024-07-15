import React from "react";
import { motion } from "framer-motion";
import { IntroPage, SkipNext } from "./Intro";
type PaycioPageProps = {
  page: IntroPage;
  setPage: (page: IntroPage) => void;
};
const SocialMediaIntro = (props: PaycioPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100svh] flex flex-col justify-between"
    >
      <div>
        <div className="rounded-xl bg-gradient-to-tr from-[#5a5dff] shadow-lg via-blue-p to-blue-p justify-center items-center flex aspect-square w-full max-w-[500px]">
          <img
            src="/intro/social-media.png"
            className="max-w-[250px] pl-2"
            alt=""
          />
        </div>
        {/* <Dots page={props.page} setPage={props.setPage} next="money-tap" /> */}
        <div className="mt-8">
          <h1 className="font-bold text-center text-2xl lt:text-3xl">
            Collect coins for social media follows
          </h1>
          <p className="text-center text-base lt:text-lg mt-4">
            Get ready to earn more coins! Follow, subscribe, like, share, and
            comment on all our social media channels. Don't miss out on the fun
            and rewards!
          </p>
        </div>
      </div>
      <SkipNext next="money-tap" page={props.page} setPage={props.setPage} />
    </motion.div>
  );
};

export default SocialMediaIntro;
