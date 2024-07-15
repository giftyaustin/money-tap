import WebApp from "@twa-dev/sdk";

export const getTGID = () => {
  if (import.meta.env.VITE_ENV === "LOCAL") {
    const tg_id = WebApp.initDataUnsafe.user?.id || 714489816;
    return tg_id;
  } else {
    const tg_id = WebApp.initDataUnsafe.user?.id;
    return tg_id;
  }
};
