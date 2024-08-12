"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChangeEvent, useState } from "react";
import { useController } from "react-hook-form";
import { IForm } from "./ExitForm";

type IReasonCombobox = {
  reason: { value: string; label: string }[];
  name: "reason" | "destination";
};

export const ReasonCombobox = (props: IReasonCombobox) => {
  const [open, setOpen] = useState(false);
  const { field } = useController<IForm>({ name: props.name });
  const [filteredReasons, setFilteredReasons] = useState(props.reason);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    console.log(searchValue);
    const results = props.reason.filter((item) =>
      item.label.toLowerCase().includes(searchValue),
    );
    console.log(results);
    setFilteredReasons(results);
  };

  const handleOptionClick = (item: { value: string; label: string }) => {
    field.onChange(item.value);
  };

  return (
    <div>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          setFilteredReasons(props.reason);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field.value
              ? props.reason.find((reason) => reason.value === field.value)
                  ?.label
              : `Select ${props.name}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 space-y-2">
          <Input
            placeholder={`Select a ${props.name}...`}
            onChange={handleSearch}
          />
          <div className="flex flex-col">
            {filteredReasons.map((item, key) => (
              <div
                key={key}
                className="flex justify-between items-center cursor-pointer hover:bg-secondary"
                onClick={() => {
                  handleOptionClick(item);
                  setOpen(false);
                }}
              >
                <span className="text-sm inline-block px-2 py-1 ">
                  {item.label}
                </span>
                {field.value === item.value && (
                  <CheckIcon size={14} className="mr-1 opacity-50" />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
