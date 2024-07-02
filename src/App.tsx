import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import Home from "./pages/Home";
import Tap from "./pages/tap/Tap";


const queryClient = new QueryClient();

function App() {
  WebApp.expand();
  WebApp.setBackgroundColor("#000000");
  WebApp.BackButton.show()
  WebApp.BackButton.onClick(() => window.history.back())
  WebApp.setHeaderColor("#291BDB");
  // if (
  //   !WebApp.platform ||
  //   WebApp.platform == "unknown"
  //   //  ||     WebApp.platform.toLowerCase() === "web"
    
  // ) {
  //   return (
  //     <main className="min-h-[100vh]">
  //       <div className="h-full min-h-[100vh] flex justify-center items-center">
  //         <h1 className="text-2xl font-medium">
  //           Open in Telegram
  //         </h1>
  //       </div>
  //     </main>
  //   );
  // }


  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        containerStyle={{ zIndex: 9999999999 }}
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route index Component={Home}/>
        <Route path={"/tap"} Component={Tap}/>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
