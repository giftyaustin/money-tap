import React, { useEffect, useRef } from "react";
import "./Modal.css";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  dialogClassName?: string;
  showCloseBtn?: boolean;
}
const Modal = ({
  open,
  setOpen,
  children,
  dialogClassName,
  showCloseBtn = true,
}: Props) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (open) dialogRef.current?.showModal();
  //   else dialogRef.current?.close();
  // }, [open]);
  const handleOutsideClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.target === dialogRef.current) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (!open) return null;
  return (
    <div
      className={cn(
        "shadow-lg fixed grid place-items-center bg-[#00000067] top-0 left-0 w-full h-full z-[100] overflow-y-auto styled-scroll",
        dialogClassName
      )}
      ref={dialogRef}
    >
      <div
        ref={contentRef}
        className={cn("Modal flex justify-center relative transition-all")}
      >
        {showCloseBtn && (
          <button
            className={`absolute top-4 right-4`}
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;

export const CloseIcon = () => {
  return (
    <svg
      className="w-3"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0575 8.50013L16.6769 1.88033C17.1077 1.44974 17.1077 0.753533 16.6769 0.322943C16.2463 -0.107648 15.5501 -0.107648 15.1196 0.322943L8.4999 6.94274L1.88044 0.322943C1.44966 -0.107648 0.753669 -0.107648 0.323087 0.322943C-0.107696 0.753533 -0.107696 1.44974 0.323087 1.88033L6.94255 8.50013L0.323087 15.1199C-0.107696 15.5505 -0.107696 16.2467 0.323087 16.6773C0.537672 16.8921 0.819819 17 1.10176 17C1.38371 17 1.66565 16.8921 1.88044 16.6773L8.4999 10.0575L15.1196 16.6773C15.3343 16.8921 15.6163 17 15.8982 17C16.1802 17 16.4621 16.8921 16.6769 16.6773C17.1077 16.2467 17.1077 15.5505 16.6769 15.1199L10.0575 8.50013Z"
        fill="#CDCDCD"
      />
    </svg>
  );
};
