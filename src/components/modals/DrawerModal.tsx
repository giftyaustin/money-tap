import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "../Modal";
import './DrawerModal.css'

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  dialogClassName?: string;
  showCloseBtn?: boolean;
  modalWrapperClassName?: string;
}
const DrawerModal = ({
  open,
  setOpen,
  children,
  dialogClassName,
  showCloseBtn = true,
  ...props
}: Props) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const handleOutsideClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.target === dialogRef.current) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, []);

  if (!open) return null;
  return (
    <div
      className={cn(
        "shadow-lg fixed grid place-items-center bg-[#00000080] backdrop-blur-sm top-0 left-0 w-full h-full z-[100]",
        dialogClassName
      )}
      ref={dialogRef}
    >
      <div
        ref={contentRef}
        className={cn("transition-all shadow-top-lg  translate-y-4 absolute w-full bg-[#4233FB] main-width min-h-[45vh] bottom-0 flex justify-center rounded-t-2xl",props.modalWrapperClassName,
        {
          "DrawerModal": open
        })}
      >
        {/* {showCloseBtn && (
          <button
            className={`absolute top-4 right-4 p-1.5 bg-black-2l rounded-full`}
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon/>
          </button>
        )} */}
        {children}
      </div>
    </div>
  );
};

export default DrawerModal;



