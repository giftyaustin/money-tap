import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PYCBSelectProps = {
  values: string[];
  valuesToDisplay: string[];
  placeholder?: string;
  selectLabel?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  triggerClassName?: string;
  placeholderClassName?: string;
};
export function SelectDemo(props: PYCBSelectProps) {
  return (
    <Select defaultValue={props.defaultValue} onValueChange={props.onChange}>
      <SelectTrigger
        className={cn("w-fit gap-x-2 border-none", props.triggerClassName)}
      >
        <SelectValue
          className={cn(``, props.placeholderClassName)}
          placeholder={props.placeholder || "Select"}
        />
      </SelectTrigger>
      <SelectContent className="z-[999999]">
        <SelectGroup>
          <SelectLabel>{props.selectLabel || "Select"}</SelectLabel>
          {props.values.map((value, index) => {
            return (
              <SelectItem key={index} value={value}>
                {props.valuesToDisplay[index]}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
