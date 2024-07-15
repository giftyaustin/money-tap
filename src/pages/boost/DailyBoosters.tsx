import CommingSoon from "@/components/CommingSoon";
import React from "react";

const DailyBoosters = () => {
  return (
    <section>
      <h2 className="font-medium">Daily boosters:</h2>
      <div className="flex flex-col gap-y-2 mt-2">
        <TappingGuru />
        <FullTank />
      </div>
    </section>
  );
};

export default DailyBoosters;

const TappingGuru = () => {
  return (
    <div className="flex relative opacity-70 gap-x-2 items-center justify-between rounded-lg bg-blue-l w-full p-4">
      {/* <CommingSoon/> */}
      <div className="flex gap-x-2 items-center">
        <TapIcon />
        <h3>Tank refill</h3>
      </div>

      <span className="text-sm font-semibold">Coming soon</span>
    </div>
  );
};
const FullTank = () => {
  return (
    <div className="flex relative opacity-70 gap-x-2 items-center justify-between rounded-lg bg-blue-l w-full p-4">
    {/* <CommingSoon/> */}
    <div className="flex gap-x-2 items-center">
      <FullTankICon />
      <h3>Full tank Guru</h3>
    </div>

    <span className="text-sm font-semibold">Coming soon</span>
  </div>
  );
};

export const FullTankICon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_133_436)">
        <mask
          id="mask0_133_436"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M23.3333 0H0V23.3333H23.3333V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_133_436)">
          <path
            d="M16.1796 8.60937L10.0649 14.7241L7.15405 11.8132"
            stroke="#D7FF1D"
            stroke-width="1.82291"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <mask
            id="mask1_133_436"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <path
              d="M0 1.90735e-06H23.3333V23.3333H0V1.90735e-06Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask1_133_436)">
            <path
              d="M22.4218 11.6667C22.4218 17.6066 17.6065 22.4219 11.6666 22.4219C5.72665 22.4219 0.911377 17.6066 0.911377 11.6667C0.911377 5.72676 5.72665 0.911481 11.6666 0.911481C17.6065 0.911481 22.4218 5.72676 22.4218 11.6667Z"
              stroke="#D7FF1D"
              stroke-width="1.82291"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_133_436">
          <rect width="23.3333" height="23.3333" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const TapIcon = () => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_133_420"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="34"
        height="34"
      >
        <path d="M0 0.666683H33.3333V34H0V0.666683Z" fill="white" />
      </mask>
      <g mask="url(#mask0_133_420)">
        <path
          d="M14.7134 20.263V15.3802C14.7134 14.3015 15.5879 13.4271 16.6665 13.4271C17.7451 13.4271 18.6196 14.3015 18.6196 15.3802V20.263"
          stroke="#D7FF1D"
          stroke-width="1.31579"
          stroke-miterlimit="10"
        />
        <path
          d="M18.6196 17.3333C18.6196 16.2547 19.4941 15.3802 20.5728 15.3802C21.6514 15.3802 22.5259 16.2547 22.5259 17.3333V19.2864"
          stroke="#D7FF1D"
          stroke-width="1.31579"
          stroke-miterlimit="10"
        />
        <path
          d="M22.5259 20.263V19.2865C22.5259 18.2078 23.4003 17.3333 24.479 17.3333C25.5576 17.3333 26.4321 18.2078 26.4321 19.2865V23.1927C26.4321 28.5861 22.0599 33.0234 16.6665 33.0234C11.2731 33.0234 6.90088 28.5861 6.90088 23.1927V17.3333C6.90088 16.2547 7.77536 15.3802 8.854 15.3802C9.93265 15.3802 10.8071 16.2547 10.8071 17.3333V24.1693"
          stroke="#D7FF1D"
          stroke-width="1.31579"
          stroke-miterlimit="10"
        />
        <path
          d="M14.7134 15.3802V7.50259C14.7134 6.42394 13.8389 5.54947 12.7603 5.54947C11.6816 5.54947 10.8071 6.42394 10.8071 7.50259V19.2864"
          stroke="#D7FF1D"
          stroke-width="1.31579"
          stroke-miterlimit="10"
        />
        <path
          d="M6.90088 7.50256C6.90088 4.2665 9.52418 1.64319 12.7603 1.64319C15.9963 1.64319 18.6196 4.2665 18.6196 7.50256"
          stroke="#D7FF1D"
          stroke-width="1.31579"
          stroke-miterlimit="10"
        />
      </g>
    </svg>
  );
};
