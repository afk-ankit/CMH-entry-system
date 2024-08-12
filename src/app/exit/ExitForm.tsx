"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddExit } from "@/lib/actions/server-action";
import { useToast } from "@/components/ui/use-toast";
import { ReasonCombobox } from "./ReasonCombobox";
import {
  loadFromLocalStorage,
  LOCAL_STORAGE_EXIT_KEY,
  reasons,
  saveToLocalStorage,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    roll_number: z.string().min(5, { message: "Invalid Roll Number" }),
    room_number: z
      .number({ message: "Invalid Room Number" })
      .nonnegative({ message: "Room number cannot be negative" })
      .min(100, { message: "Invalid Room Number" })
      .max(999, { message: "Invalid Room Number" }),
    destination: z.string().min(1, { message: "Destination is required" }),
    reason: z.string().min(1, { message: "Reason is required" }),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.reason === "others") {
        return data.description && data.description.trim().length > 0;
      }
      return true;
    },
    {
      message: "Reason for exit is required",
      path: ["description"],
    },
  );
export type IForm = z.infer<typeof FormSchema>;

const ExitForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //useForm init
  const form = useForm<IForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      roll_number: "",
      destination: "",
      room_number: NaN,
      reason: "",
      description: "",
    },
  });
  //Function to handle Form Submission
  const onSubmit = async (value: IForm) => {
    try {
      setLoading(true);
      const res = await AddExit(value);
      saveToLocalStorage(value, LOCAL_STORAGE_EXIT_KEY);
      if (res) {
        toast({
          title: "Something went wrong in saving your data. Please try again.",
        });
        return;
      }
      form.reset();
      toast({ title: "Submitted Successfully" });
      router.push("/");
    } catch (error) {
      if (error instanceof Error) toast({ title: error.message });
    } finally {
      setLoading(false);
    }
  };
  //watch reason input
  const reason = form.watch("reason");
  //toaster
  const { toast } = useToast();
  useEffect(() => {
    const storedData = loadFromLocalStorage(LOCAL_STORAGE_EXIT_KEY);
    if (storedData) {
      form.reset(storedData);
    }
  }, [form]);
  //component start
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="xl:w-1/2 mx-auto space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roll_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your roll number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your room number"
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter the destination</FormLabel>
                <FormControl>
                  <Input placeholder="Specify the destination" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={() => (
              <FormItem>
                <FormLabel>Select the reason for exit</FormLabel>
                <FormControl>
                  <ReasonCombobox reason={reasons} name="reason" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {reason === "others" && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the reason for exit</FormLabel>
                  <FormControl>
                    <Input placeholder="Specify the reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ExitForm;
