"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useController } from "react-hook-form";
import { IForm } from "./ExitForm";

const ReasonSelect = () => {
  const { field } = useController<IForm>({ name: "reason" });
  return (
    <Select onValueChange={field.onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a reason" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Reasons</SelectLabel>
          {REASONS.map((reason) => (
            <SelectItem value={reason} key={reason} className="capitalize">
              {reason}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default ReasonSelect;

const REASONS = [
  "home",
  "project",
  "canteen",
  "sports",
  "library",
  "deparment",
  "group-study",
  "others",
];
