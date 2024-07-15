import CoinBlast, { useBlast } from "@/components/CoinBlast";
import PYCCoinsText from "@/components/PYCCoinsText";
import DrawerModal from "@/components/modals/DrawerModal";
import { UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import { sendPostRequest } from "@/lib/sendRequest";
import React from "react";
import toast from "react-hot-toast";
type ClaimHourlyCoinsModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo;
  refetchUserInfo: () => void;
};
const ClaimHourlyCoinsModal = (props: ClaimHourlyCoinsModalProps) => {
  const { blast } = useBlast();
  const tg_id = getTGID();
  const [submitting, setSubmitting] = React.useState(false);

  const claimCoins = async () => {
    const response = await sendPostRequest(
      `/api/v1/claim-hourly-coins/${tg_id}`,
      {}
    );
    if (response.status) {
      toast.success("Claimed");
      blast();
      props.refetchUserInfo();
      props.setOpen(false);
    } else {
      toast.error(response.message);
    }
  };
  const handleClaimClick = async () => {
    setSubmitting(true);
    await claimCoins();
    setSubmitting(false);
  };
  return (
    <DrawerModal open={props.open} setOpen={props.setOpen} modalWrapperClassName="min-h-fit">
      <div className="w-full p-4 pb-8">
        <div className="bg-blue-p p-6 pt-8 rounded-2xl relative">
          <div className="flex justify-center ">
            <img src="/assets/gift-box.png" className="w-24" alt="" />
          </div>

          <div className="flex justify-center mt-4 pr-4">
            <PYCCoinsText
              tokens={props.userInfo.coins_to_claim}
              imageClassName="w-10"
              textClassName="text-3xl text-white"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center mt-1">
            Your reward is waiting
          </h2>
        </div>

        <div className="flex justify-center mt-2">
          <button
            disabled={submitting}
            onClick={handleClaimClick}
            className="bg-yellow-p w-full px-6 text-xl py-5  rounded-lg text-blue-p font-semibold"
          >
            Claim
          </button>
        </div>
      </div>
    </DrawerModal>
  );
};

export default ClaimHourlyCoinsModal;
