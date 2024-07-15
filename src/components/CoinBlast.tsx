import React, { useEffect } from "react";
import "./CoinBlast.css"; // Ensure you have this CSS file
import confetti from "canvas-confetti";

type Values = {
  blast: () => void;
  setBlast: React.Dispatch<React.SetStateAction<() => void>>;
};

export const BlastContext = React.createContext<Values | undefined>(undefined);

const CoinBlast = () => {
  const { setBlast } = useBlast();

  const blast_ = () => {
    if(!confetti) return
    confetti.reset();
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.9 },
      shapes: ["circle"],
      colors: ["#fade6f", "#f9d423", "#f9d423", "#f9d423", "#f9d423"],
      gravity: 3.5,
    });
  };

  useEffect(() => {
    setBlast(()=>blast_);
  }, []);

  return <></>;
};

export default CoinBlast;

export const useBlast = () => {
  const context = React.useContext(BlastContext);
  if (context === undefined) {
    throw new Error("useBlast must be used within a BlastProvider");
  }
  return context;
};