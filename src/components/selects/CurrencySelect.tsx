import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Vendor } from "../modals/create-merchant-modal/CurrenciesBlock";
import { Checkbox } from "../ui/checkbox";

interface Props {
  currValue?: Vendor;
  values: string[] | number[];
  valuesToDisplay: Vendor[];
  placeholder: string;
  inputClassName?: string;
  wrapperClassName?: string;
  onSelect?: (value: string, valueToShow: Vendor) => void;
  initialValue: string | number;
  initialValueToShow: Vendor;
  liClassName?: string;
}

const CurrencySelect = ({
  currValue,
  values,
  valuesToDisplay,
  inputClassName,
  wrapperClassName,
  placeholder,
  onSelect,
  initialValue,
  initialValueToShow,
  liClassName,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue.toString() || "");
  const [valueInfo, setValueInfo] = useState<Vendor>(initialValueToShow);
  const openRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef(null);

  const handleOutsideClick = (e: any) => {
    if (openRef.current && !openRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
  const handleSelect = (value: string, valueToShow: Vendor) => {
    if (onSelect) {
      onSelect(value, valueToShow);
    }
  };

  //   dom manipulation
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div
      className={cn(
        "border border-l-grey rounded-lg flex justify-between relative",
        wrapperClassName,
        {
          "rounded-b-none": open,
        }
      )}
      onClick={() => {
        setOpen((prev) => !prev);
      }}
      ref={openRef}
    >
      {/* Value that is shown in selected item place */}
      <button
        className={cn(
          "flex justify-between items-center w-full py-2 xl:py-4 px-4",
          {
            "border-b": open,
          }
        )}
      >
        <div className="flex items-center gap-x-2">
          {currValue ? (
            <>
              {" "}
              <img
                src={currValue.vendors_logopath}
                className="w-5 xl:w-6"
                alt=""
              />
              <span className="flex items-center font-semibold text-sm xl:text-base">
                {currValue.vendors_vendorname} (
                {currValue.vendors_vendorshortcode})
              </span>
            </>
          ) : (
            <>
              <img
                src={valueInfo.vendors_logopath}
                className="w-5 xl:w-6"
                alt=""
              />
              <span className="flex items-center font-semibold text-sm xl:text-base">
                {valueInfo.vendors_vendorname} (
                {valueInfo.vendors_vendorshortcode})
              </span>
            </>
          )}
        </div>
        <span className="flex items-center">
          <DropDownIcon />
        </span>
      </button>
      {open && (
        <ul
          className={cn(
            `absolute shadow-md max-h-64 flex border border-t-0 rounded-b-lg border-l-grey flex-col gap-1 overflow-y-scroll
           no-scrollbar top-full w-full left-0 py-2 px-1 pb-4 z-[1] bg-white transition-all`,
            {}
          )}
        >
          {valuesToDisplay.map((item, i) => {
            return (
              <li
                ref={itemRef}
                onClick={() => {
                  setValue(item.vendors_vendorid.toString());
                  handleSelect(item.vendors_vendorid.toString(), item);
                  setValueInfo(item);
                }}
                className={cn(
                  `w-full rounded-lg
                  transition-colors dark:text-d-text duration-300 hover:bg-red-primary-hover `,
                  liClassName,
                  {
                    "bg-theme_primary hover:bg-theme_primary":
                      value === values[i],
                  }
                )}
                key={i}
              >
                <div className="flex justify-between gap-x-4 hover:bg-l-grey rounded-md cursor-pointer items-center py-2 px-3">
                  <div className="flex gap-x-2">
                    <img
                      src={item.vendors_logopath}
                      className=" w-5 xl:w-6"
                      alt=""
                    />
                    <span className="flex items-center font-semibold text-sm xl:text-base">
                      {item.vendors_vendorname} ({item.vendors_vendorshortcode})
                    </span>
                  </div>
                  <div>
                    {currValue ? (
                      <>
                        <Checkbox
                          checked={
                            item.vendors_vendorid.toString() ===
                            currValue.vendors_vendorid.toString()
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Checkbox
                          checked={item.vendors_vendorid.toString() === value}
                        />
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CurrencySelect;

export const DropDownIcon = () => {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 19 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.7679 0.225563C18.4583 -0.0751878 17.958 -0.0751878 17.6485 0.225563L9.49998 8.1431L1.35152 0.225563C1.042 -0.0751878 0.541665 -0.0751878 0.232142 0.225563C-0.0773807 0.526315 -0.0773807 1.01247 0.232142 1.31322L8.94031 9.77461C9.09468 9.92461 9.29733 10 9.50002 10C9.7027 10 9.90535 9.92461 10.0597 9.77461L18.7679 1.31322C19.0774 1.01247 19.0774 0.526315 18.7679 0.225563Z"
        fill="#646464"
      />
    </svg>
  );
};
