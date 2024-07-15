

export const getServerHost = () => {
  if(import.meta.env.VITE_ENV==="LOCAL") {
    return "http://10.20.0.144:7002";
  }
  else
  return "https://telerest.paycio.com";
};
export const getSocketServerHost = () => {
  if(import.meta.env.VITE_ENV==="LOCAL") {
    return "http://10.20.0.144:7000";
  }
  else
  return "https://telesocket.paycio.com";
};

export type LinkString = `/${string}`;

export const sendPostRequest = async (
  url: LinkString,
  body: Object | undefined
) => {
  const HOST = getServerHost();
  try {
    const bodyData = {
      ...body,
    };
    const response = await fetch(`${HOST}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    return {
      status: false,
      status_code: 504,
      message: "Try again later",
    };
  }
};

export const sendGetRequest = async (
  url: LinkString,
) => {
  const HOST = getServerHost();
  try {
    const response = await fetch(`${HOST}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    return res;
  } catch (error) {
    return {
      status: false,
      status_code: 504,
      message: "Try again later",
    };
  }
};
