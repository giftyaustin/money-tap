import querystring from "querystring";
import CryptoJS from "crypto-js";

const PUBLICKEY = "69f647c2-93a1-442a-97d1-56baf9c76de0";
const SECRET = "a9b504c0-984f-4aee-b38c-76ecea509db8";

function getSign(str: any) {
    let unescapeStr = decodeURIComponent(str);
    return CryptoJS.HmacSHA512(unescapeStr, SECRET).toString(CryptoJS.enc.Hex);
}

export const getPaycioInfo = async (phoneNumber: string | number) => {
  try {
    const body = {
      ucpiid: phoneNumber,
    };
    const SIGN = getSign(querystring.stringify(body));

    let response:any = await fetch("https://api.paycio.ae/api/v1/getinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SIGN: SIGN,
        PUBLICKEY: PUBLICKEY,
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
    return {
        message:"Failed",
    };
    
  }
};
