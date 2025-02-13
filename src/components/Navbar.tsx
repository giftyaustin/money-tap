import { cn } from "@/lib/utils";
import { PYCCoinIcon } from "@/pages/tap/Click";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type PageType = "click" | "airdrop" | "levels" | "stats" | "invites";

const Navbar = () => {
  const [currPage, setCurrPage] = useState<PageType>();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/tap") {
      setCurrPage("click");
    }
    if (location.pathname === "/airdrop") {
      setCurrPage("airdrop");
    }
    if (location.pathname === "/levels") {
      setCurrPage("levels");
    }
    if (location.pathname === "/stats") {
      setCurrPage("stats");
    }
    if (location.pathname === "/invites") {
      setCurrPage("invites");
    }
  }, [location.pathname]);
  return (
    <div className="fixed bottom-0 bg-gradient-to-t shadow-top-lg from-[#1F14A9] to-[#3E2FF5] max-w-[500px] rounded-t-2xl w-full py-2.5 pb-3">
      <div className="flex justify-evenly text-xs font-semibold items-baseline ">
        <Link
          to={"/tap"}
          className={cn("pyc-nav-link", {
            "pyc-active-link": currPage === "click",
          })}
        >
          <span>
            <PYCCoinIcon className="w-[18px]" />
          </span>
          <span>Click</span>
        </Link>
        <Link
          to={"/airdrop"}
          className={cn("pyc-nav-link", {
            "pyc-active-link": currPage === "airdrop",
          })}
        >
          <span>
            <AirdropIcon />
          </span>
          <span>Airdrop</span>
        </Link>
        <Link
          to={"/levels"}
          className={cn("pyc-nav-link", {
            "pyc-active-link": currPage === "levels",
          })}
        >
          <span>
            <LevelsIcon />
          </span>
          <span>Levels</span>
        </Link>
        <Link
          to={"/stats"}
          className={cn("pyc-nav-link", {
            "pyc-active-link": currPage === "stats",
          })}
        >
          <span>
            <StatsIcon />
          </span>
          <span>Stats</span>
        </Link>
        <Link
          to={"/invites"}
          className={cn("pyc-nav-link", {
            "pyc-active-link": currPage === "invites",
          })}
        >
          <span>
            <InvitesIcon />
          </span>
          <span>Invites</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

export const AirdropIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.7977 11.2572L12.6006 15.3481L14.7627 12.1571C14.9059 11.9458 14.8333 11.6616 14.4923 11.5178C14.1986 11.3939 13.8333 11.4742 13.6768 11.7051L10.7323 16.0509V12.1546C10.7323 11.915 10.4966 11.691 10.1081 11.6894C9.77571 11.6881 9.50291 11.8941 9.50291 12.1546V16.0509L6.5584 11.7051C6.40194 11.4742 6.03665 11.3939 5.74291 11.5178C5.40573 11.6599 5.32758 11.9432 5.47252 12.1571L7.63465 15.3481L2.43753 11.2572C2.22206 11.0876 1.85374 11.0587 1.57618 11.273C1.33948 11.4558 1.3319 11.7527 1.56639 11.9372C10.3009 18.8123 9.68711 18.3323 9.73854 18.364C9.97765 18.5107 10.3011 18.4945 10.5135 18.3534C10.5341 18.3419 18.6729 11.934 18.6688 11.9372C18.8843 11.7676 18.9197 11.4787 18.645 11.2621C18.4108 11.0774 18.0321 11.0727 17.7977 11.2572Z" fill="white"/>
    <path d="M9.51818 1.1875C7.91038 2.39541 6.77632 4.06566 6.14104 6.16689C5.5743 8.04147 5.63826 9.57376 5.63897 9.58899C5.63988 9.60831 5.63972 9.53853 5.63968 10.4496C5.94284 10.2257 6.62807 9.81545 7.57893 9.81545C8.53807 9.81545 9.21546 10.2217 9.51818 10.4478V1.1875Z" fill="white"/>
    <path d="M4.4521 9.63063C4.4445 9.44102 4.40112 7.84359 4.99141 5.86627C5.73999 3.35839 7.19213 1.39068 8.97917 0.10437C3.94556 0.671224 0.0195312 4.96955 0.0195312 10.1718C0.0195312 10.4119 0.164183 10.6284 0.386009 10.7202C0.607836 10.8121 0.863183 10.7613 1.03297 10.5915C1.04072 10.5838 1.83672 9.81561 2.8295 9.81561C3.54956 9.81561 4.16457 10.2185 4.45214 10.4436L4.4521 9.63063Z" fill="white"/>
    <path d="M14.5824 9.58868C14.583 9.57431 14.647 8.04203 14.0803 6.16745C13.4449 4.0661 12.311 2.39541 10.7031 1.1875V10.4501C11.0063 10.2263 11.6915 9.81601 12.6424 9.81601C13.6015 9.81601 14.2789 10.2223 14.5816 10.4483C14.5816 9.54641 14.5814 9.60772 14.5824 9.58868Z" fill="white"/>
    <path d="M11.2266 0.102539C13.2037 1.53074 14.5323 3.51997 15.2328 5.86654C15.8231 7.84386 15.7797 9.44128 15.7721 9.63089V10.444C16.0599 10.2189 16.6755 9.81588 17.3947 9.81588C18.39 9.81588 19.1851 10.5859 19.1912 10.5918C19.361 10.7616 19.6163 10.8124 19.8382 10.7205C20.06 10.6286 20.2047 10.4121 20.2047 10.1721C20.2046 4.96348 16.269 0.660963 11.2266 0.102539Z" fill="white"/>
    </svg>
    
  );
};
export const LevelsIcon = () => {
  return (
    <svg width="22" height="13" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.3845 6.59234L17.2874 0.856445H11.8984L15.9954 6.59234L11.8984 12.3282H17.2874L21.3845 6.59234Z" fill="white"/>
    <path d="M13.9328 6.59234L9.83578 0.856445H0.265564V12.3282H9.83578L13.9328 6.59234ZM8.94372 5.20711L5.57784 8.94809L3.0339 6.60594L4.17101 5.3709L5.46564 6.56285L7.6957 4.08427L8.94372 5.20711Z" fill="white"/>
    </svg>
    
  );
};
export const StatsIcon = () => {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3542 0.0175781H7.16474C6.83854 0.0175781 6.5741 0.282023 6.5741 0.608224V13.2028C6.5741 13.529 6.83854 13.7934 7.16474 13.7934H10.3542C10.6804 13.7934 10.9449 13.529 10.9449 13.2028V0.608224C10.9449 0.281985 10.6804 0.0175781 10.3542 0.0175781Z" fill="white"/>
<path d="M16.5144 7.36133H13.3249C12.9987 7.36133 12.7343 7.62577 12.7343 7.95197V13.2068C12.7343 13.533 12.9987 13.7974 13.3249 13.7974H16.5144C16.8406 13.7974 17.105 13.533 17.105 13.2068V7.95197C17.105 7.62573 16.8406 7.36133 16.5144 7.36133Z" fill="white"/>
<path d="M4.2097 4.72351H1.02021C0.69401 4.72351 0.429565 4.98796 0.429565 5.31416V13.1993C0.429565 13.5255 0.69401 13.7899 1.02021 13.7899H4.2097C4.5359 13.7899 4.80035 13.5255 4.80035 13.1993V5.31416C4.80035 4.98796 4.5359 4.72351 4.2097 4.72351Z" fill="white"/>
</svg>

  );
};
export const InvitesIcon = () => {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.97656 3.85551C2.97656 1.82703 4.62098 0.182617 6.64946 0.182617C8.67793 0.182617 10.3224 1.82703 10.3224 3.85551C10.3224 5.884 8.67793 7.52841 6.64946 7.52841C4.62098 7.52841 2.97656 5.884 2.97656 3.85551Z" fill="white"/>
    <path d="M14.7315 4.59005C14.7315 4.18435 14.4026 3.85547 13.9969 3.85547C13.5912 3.85547 13.2623 4.18435 13.2623 4.59005V6.05921H11.7932C11.3875 6.05921 11.0586 6.38808 11.0586 6.79379C11.0586 7.19949 11.3875 7.52837 11.7932 7.52837H13.2623V8.99752C13.2623 9.40323 13.5912 9.7321 13.9969 9.7321C14.4026 9.7321 14.7315 9.40323 14.7315 8.99752V7.52837H16.2006C16.6064 7.52837 16.9352 7.19949 16.9352 6.79379C16.9352 6.38808 16.6064 6.05921 16.2006 6.05921H14.7315V4.59005Z" fill="white"/>
    <path d="M4.44633 8.99719C3.47222 8.99719 2.53801 9.38417 1.84921 10.073C1.1604 10.7617 0.773438 11.696 0.773438 12.6701V14.1392C0.773438 14.545 1.10232 14.8738 1.50802 14.8738H11.7921C12.1978 14.8738 12.5267 14.545 12.5267 14.1392V12.6701C12.5267 11.696 12.1397 10.7617 11.4509 10.073C10.7622 9.38417 9.82794 8.99719 8.85381 8.99719H4.44633Z" fill="white"/>
    </svg>
    
  );
};
