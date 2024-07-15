import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Tap from "./pages/tap/Tap";
import Levels from "./pages/levels/Levels";
import Invites from "./pages/invites/Invites";
import Stats from "./pages/stats/Stats";
import Country from "./pages/country/Country";
import Chain from "./pages/chain/Chain";
import Airdrop from "./pages/airdrop/Airdrop";
import Youtube from "./pages/airdrop/YoutubeVideos";
import Token from "./pages/token/Token";
import Exchange from "./pages/exchange/Exchange";
import Intro from "./pages/intro/Intro";
import Boost from "./pages/boost/Boost";
import CoinBlast, { BlastContext } from "./components/CoinBlast";

const queryClient = new QueryClient();

function App() {
  WebApp.expand();
  WebApp.setBackgroundColor("#000000");
  // WebApp.BackButton.show()
  // WebApp.BackButton.onClick(() => window.history.back())
  WebApp.setHeaderColor("#2619C9");
  const [func, setFunc] = useState(() => () => {});
  // if (
  //   import.meta.env.VITE_ENV !== "LOCAL" &&
  //   (WebApp.platform.toLowerCase() !== "android" ||
  //     WebApp.platform.toLowerCase() !== "ios")
  // ) {
  //   return (
  //     <main className="min-h-[100vh]">
  //       <div className="h-full min-h-[100vh] flex justify-center items-center">
  //         <h1 className="text-2xl font-medium">Open in Telegram</h1>
  //       </div>
  //     </main>
  //   );
  // }



  return (
    <QueryClientProvider client={queryClient}>
      <BlastContext.Provider value={{ blast: func, setBlast: setFunc }}>
        <Toaster
          containerStyle={{ zIndex: 9999999999 }}
          position="top-center"
          reverseOrder={false}
        />
        <CoinBlast />
        <Routes>
          <Route index Component={Home} />
          <Route path="/intro" Component={Intro} />
          <Route path="/country" Component={Country} />
          <Route path={"/tap"} Component={Tap} />
          <Route path={"/airdrop"} Component={Airdrop} />
          <Route path={"/levels"} Component={Levels} />
          <Route path={"/invites"} Component={Invites} />
          <Route path={"/stats"} Component={Stats} />
          <Route path="/chain" Component={Chain} />
          <Route path={"/token/:chain"} Component={Token} />
          <Route path={"/exchange"} Component={Exchange} />
          <Route path={"/boost"} Component={Boost} />
        </Routes>
      </BlastContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
