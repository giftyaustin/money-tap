import { Checkbox } from "@/components/ui/checkbox";
import { useFetch } from "@/hooks/useFetch";
import { Stats, User } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import { sendPostRequest } from "@/lib/sendRequest";
import React, { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Country = () => {
  const router = useNavigate();
  const tg_id = getTGID();
  const { isLoading: stats_isLoading, data: statsData } = useFetch<Stats>({
    serverPath: `/api/v1/stats`,
  });
  const { isLoading: user_isLoading, data: userData } = useFetch<User>({
    serverPath: `/api/v1/user-info/${tg_id}`,
  });
  const userInfo = userData?.data;
  const countries = statsData?.data?.countries;

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateUserCountry = async () => {
    const tg_id = getTGID();
    const response = await sendPostRequest(`/api/v1/update-country/${tg_id}`, {
      country_code: selectedCountry,
    });

    if (response.status) {
      toast.dismiss();
      setIsSubmitting(false);
      router("/chain");
      return;
    } else {
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(response.message);
      return;
    }
  };

  const handleContinueClick = () => {
    setIsSubmitting(true);
    toast.loading("Please wait...");
    if (!selectedCountry) {
      toast.dismiss();
      setIsSubmitting(false);
      toast.error("Please select a country");
      return;
    }
    updateUserCountry();
  };

  useEffect(() => {
    if (!userInfo || userInfo.selected_country==="none") return;
    if(userInfo.level<10){
      router("/chain");
    }

  }, [userInfo]);
  return (
    <main className="mpx mt-4">
      <h1 className="text-2xl font-semibold">Choose your country</h1>
      <p className="mt-2 text-sm opacity-75">
        Become a legend in a country and get exclusive rewards from Paycio based
        on the country you chose
      </p>
      {/* Select country here */}
      <div className="bg-white text-black mt-8 rounded-2xl shadow-xl pt-9 pb-6 px-4">
        <div className="border-b border-[#EEEEEE] opacity-65 pb-4">
          <img src="/assets/location.png" className="mx-auto w-40" alt="" />
          <h3 className="text-center text-xl font-semibold">
            Choose your country
          </h3>
        </div>
        <div className="mt-4">
          <h4 className="text-[#67758A] text-sm font-medium">Select country</h4>
          {countries && (
            <CountrySelect
              countries={countries}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          )}
         

          <button
          disabled={isSubmitting}
            onClick={handleContinueClick}
            className="bg-blue-d disabled:opacity-50 rounded-lg text-white px-4 py-4 font-semibold mt-8 w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
};

export default Country;

type CountrySelectProps = {
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  countries: string[];
};
const CountrySelect = (props: CountrySelectProps) => {
  return (
    <ReactFlagsSelect
      selected={props.selectedCountry}
      onSelect={(code) => {
        console.log(code);
        props.setSelectedCountry(code);
      }}
      searchable
      className="mt-2 rounded-lg"
      countries={props.countries}
    />
  );
};
