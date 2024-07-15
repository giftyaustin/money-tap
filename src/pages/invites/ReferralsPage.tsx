import PYCCoinsText from "@/components/PYCCoinsText";
import { User, UserInfo } from "@/lib/ResponseTypes";
import { getTGID } from "@/lib/getTGID";
import toast from "react-hot-toast";

type ReferralsPageProps = {
  userInfo: UserInfo;
};

const ReferralsPage = (props: ReferralsPageProps) => {
  const tg_id = getTGID();
  const link = `https://t.me/PYCTEST_bot?start=${tg_id}`;
  return (
    <section>
      {/* MY ref link */}
      <div className="mt-8">
        <span className="">My referral link:</span>
        <div className="bg-blue-l p-2 py-4 pl-3 mt-1 rounded-lg flex items-center justify-between gap-x-2">
          <span className="text-[#A29BFF] break-words line-clamp-1">
            {link}
          </span>
          <CopyLinkButton link={link} />
        </div>
      </div>

      {/* Previous referrals */}
      <InvitesList referrals={props.userInfo.referrals} />
    </section>
  );
};

export default ReferralsPage;

const CopyLinkButton = ({ link }: { link: string }) => {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(link);
        toast.success("Copied!");
      }}
      className="bg-yellow-p flex gap-x-1 items-center px-2 py-1.5 rounded-md"
    >
      <span>
        <CopyIcon />
      </span>
      <span className="text-xs font-semibold text-black">Copy</span>
    </button>
  );
};
type InvitesListProps = {
  referrals: User[];
};
const InvitesList = (props: InvitesListProps) => {
  return (
    <section className="mt-12 pb-[120px]">
      <div className="flex justify-between items-center">
        <h3>My referrals:</h3>
        <span className="text-yellow-p font-semibold">
          {props.referrals.length} referrals
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-y-4">
        {props.referrals.map((invite) => {
          return <PreviousInviteCard key={invite._id} user={invite} />;
        })}
      </div>
    </section>
  );
};

type PreviousInviteCardProps = {
  user: User;
};
const PreviousInviteCard = (props: PreviousInviteCardProps) => {
  const colors = [
    "#A29BFF", "#F0EFFF", "#FF6347", "#7FFF00", "#8A2BE2", 
    "#5F9EA0", "#D2691E", "#FF7F50", "#6495ED", "#DC143C"
  ];
  
  let bgColor = colors[Math.floor(Math.random() * colors.length)];
  let nameToDisplay = props.user.tg_username;
  if(!props.user.tg_username && (props.user.tg_firstname || props.user.tg_lastname)){
    nameToDisplay = `${props.user.tg_firstname} ${props.user.tg_lastname}`
  }
  else{
    if(!props.user.tg_username && !props.user.tg_firstname && !props.user.tg_lastname){
      nameToDisplay = props.user.tg_id.toString()
    }
  }
  return (
    <div className="bg-blue-l rounded-lg px-4 py-2 flex items-center gap-x-2">
      <div style={{ backgroundColor: bgColor }} className="w-10 aspect-square rounded-full flex justify-center items-center font-bold text-lg  border ">
        {nameToDisplay?.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <span className="text-sm font-bold">{nameToDisplay}</span>
        <PYCCoinsText tokens={props.user.pyc_coins} />
      </div>
    </div>
  );
};

export const CopyIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1_29650"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <path d="M0 0H16V16H0V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_1_29650)">
        <path
          d="M10 0.666626H2.66671C1.93337 0.666626 1.33337 1.26663 1.33337 1.99996V10.6666C1.33337 11.0333 1.63337 11.3333 2.00004 11.3333C2.36671 11.3333 2.66671 11.0333 2.66671 10.6666V2.66663C2.66671 2.29996 2.96671 1.99996 3.33337 1.99996H10C10.3667 1.99996 10.6667 1.69996 10.6667 1.33329C10.6667 0.966626 10.3667 0.666626 10 0.666626ZM12.6667 3.33329H5.33337C4.60004 3.33329 4.00004 3.93329 4.00004 4.66663V14C4.00004 14.7333 4.60004 15.3333 5.33337 15.3333H12.6667C13.4 15.3333 14 14.7333 14 14V4.66663C14 3.93329 13.4 3.33329 12.6667 3.33329ZM12 14H6.00004C5.63337 14 5.33337 13.7 5.33337 13.3333V5.33329C5.33337 4.96663 5.63337 4.66663 6.00004 4.66663H12C12.3667 4.66663 12.6667 4.96663 12.6667 5.33329V13.3333C12.6667 13.7 12.3667 14 12 14Z"
          fill="#1D1D1D"
        />
      </g>
    </svg>
  );
};
