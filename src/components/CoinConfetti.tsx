import React, { useEffect } from "react";

type CoinConfettiProps = {
  showConfetti: boolean;
  duration?: number | "infinity";
};

const CoinConfetti = ({duration="infinity",...props}: CoinConfettiProps) => {
  const createConfettiElement = () => {
    const ele = document.createElement("img");
    ele.src = "/logos/pyc-coin.png";
    ele.className = `confetti ${Math.random() < 0.3 ? "w-3" : "w-5"}`;
    ele.style.position = "fixed";
    ele.style.top = `${0}vh`;
    ele.style.left = `${Math.random() * 100}vw`;
    ele.style.animationDuration = `${Math.random() * 3 + 2}s`;
    ele.style.animationName =Math.random() < 0.5 ? "confetti-fall" : "confetti-fall-2";
    const container = document.getElementById("confetti-container");
    document?.appendChild(ele);

    // Remove confetti element after animation completes
    setTimeout(() => {
      container?.removeChild(ele);
    }, 3000); // 3 seconds to match animation duration
  };

  useEffect(() => {
    if (props.showConfetti) {
      const interval = setInterval(createConfettiElement, 10); // Create a confetti every 200ms
      if(duration === "infinity") return;
      setTimeout(() => clearInterval(interval), duration);
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [props.showConfetti]);

  return <div id="confetti-container" className="fixed inset-0 pointer-events-none"></div>;
};

export default CoinConfetti;
