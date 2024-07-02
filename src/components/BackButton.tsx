import { cn } from "@/lib/utils";
import React from "react";
type BackButtonProps = {
    btnClassName?: string
}
const BackButton = (props: BackButtonProps) => {
  return (
    <button onClick={() => window.history.back()} className={cn(``, )}>
      <BackIcon />
    </button>
  );
};

export default BackButton;

export const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30.465"
      height="30.46"
      viewBox="0 0 30.465 30.46"
    >
      <g
        id="back_icon"
        data-name="back icon"
        transform="translate(-0.767 -0.77)"
      >
        <path
          id="Path_3672"
          data-name="Path 3672"
          d="M15.991.77A15.23,15.23,0,1,1,.767,15.984,15.215,15.215,0,0,1,15.991.77ZM29.252,16A13.253,13.253,0,1,0,15.987,29.25,13.257,13.257,0,0,0,29.252,16Z"
          fill="#c2c2c2"
          fillRule="evenodd"
        />
        <path
          id="Path_3673"
          data-name="Path 3673"
          d="M17.9,9.137a1.054,1.054,0,0,1,1.02.612.936.936,0,0,1-.182,1.063c-.352.377-.72.738-1.078,1.106q-1.752,1.791-3.5,3.584a1.193,1.193,0,0,0-.279.325.554.554,0,0,0,0,.391,1.174,1.174,0,0,0,.278.328q2.253,2.314,4.512,4.625a.988.988,0,0,1,.278,1.073.939.939,0,0,1-.79.654.9.9,0,0,1-.821-.265c-1.643-1.681-3.3-3.348-4.913-5.056a2.232,2.232,0,0,1,.023-3.14c1.605-1.687,3.245-3.342,4.885-4.995a1.972,1.972,0,0,1,.568-.305Z"
          fill="#c2c2c2"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};
