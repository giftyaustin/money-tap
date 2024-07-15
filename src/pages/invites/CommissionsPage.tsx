import PYCCoinsText from "@/components/PYCCoinsText";
import React, { useEffect } from "react";
import { CheckMark } from "../airdrop/SocialMediaBlock";
import { sendPostRequest } from "@/lib/sendRequest";
import { getTGID } from "@/lib/getTGID";
import toast from "react-hot-toast";
type CommissionsPageProps = {
  claimed: Number[];
};
const CommissionsPage = (props: CommissionsPageProps) => {
  return (
    <div className="mt-8">
      <h1 className="font-medium">Invite friends</h1>
      <div className="flex flex-col gap-y-2 mt-2">
        <CommissionCard claimed={props.claimed} friends={1} coins={50000} />
        <CommissionCard claimed={props.claimed} friends={3} coins={15000} />
        <CommissionCard claimed={props.claimed} friends={10} coins={50000} />
        <CommissionCard claimed={props.claimed} friends={25} coins={125000} />
        <CommissionCard claimed={props.claimed} friends={50} coins={250000} />
        <CommissionCard claimed={props.claimed} friends={100} coins={500000} />
        <CommissionCard claimed={props.claimed} friends={500} coins={2500000} />
        <CommissionCard claimed={props.claimed} friends={1000} coins={5000000} />
        <CommissionCard claimed={props.claimed} friends={10000} coins={50000000} />
        <CommissionCard claimed={props.claimed} friends={100000} coins={500000000} />
      </div>
    </div>
  );
};

export default CommissionsPage;

type CommissionCardProps = {
  friends: number;
  coins: number;
  claimed: Number[];
};
const CommissionCard = (props: CommissionCardProps) => {
  const tg_id = getTGID();
  const [submitting, setSubmitting] = React.useState(false);
  const [claimed, setClaimed] = React.useState<boolean>();
  const handleClaim = async () => {
    setSubmitting(true);
    toast.loading("Claiming...");
    const response = await sendPostRequest(`/api/v1/claim-referrals/${tg_id}`, {
      no_of_referrals: props.friends,
    });
    if (response.status) {
      setSubmitting(false);
      toast.dismiss();
      toast.success("Claimed");
      setClaimed(true);
    } else {
      setSubmitting(false);
      toast.dismiss();
      toast("😞 " + response.message, { style: {color:"white",backgroundColor:"red",fontWeight:"bold"} });
    }
  };

  useEffect(() => {
    setClaimed(props.claimed.includes(Number(props.friends)));
  }, [props.claimed, props.friends]);
  return (
    <div className="bg-blue-l px-4 py-2 flex justify-between rounded-lg items-center">
      <div className="flex flex-col">
        <span>Invite {props.friends} friends</span>
        <div>
          <PYCCoinsText tokens={props.coins} />
        </div>
      </div>
      {claimed ? (
        <CheckMark />
      ) : (
        <button
          onClick={handleClaim}
          disabled={submitting}
          className="text-black disabled:opacity-50 font-medium px-3 py-1.5 text-sm bg-yellow-p rounded-lg"
        >
          Claim
        </button>
      )}
    </div>
  );
};
