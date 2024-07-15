import Navbar from "@/components/Navbar";
import Click from "./Click";
import WebApp from "@twa-dev/sdk";
import { useBlast } from "@/components/CoinBlast";
import confetti from 'canvas-confetti';

const Tap = () => {
  WebApp.BackButton.hide();
  const {blast} = useBlast();
  return (
    <>
    {/* <button onClick={() => blast()}>Click</button>
    <input type="color" name="" id="" /> */}
      <main className="min-h-screen">
        {/* Clicks happen here */}
        <Click />
      </main>
      <Navbar />
    </>
  );
};

export default Tap;
