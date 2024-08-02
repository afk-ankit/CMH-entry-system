"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReasonSelect from "./ReasonSelect";
import { AddExit } from "@/lib/actions/server-action";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string().min(1),
  roll_number: z.string().min(5),
  room_number: z.number({ message: "Excpected Number" }).nonnegative(),
  destination: z.string().min(1),
  reason: z.string().min(1),
  description: z.string().optional(),
});
export type IForm = z.infer<typeof FormSchema>;

const ExitForm = () => {
  //useForm init
  const form = useForm<IForm>({
    resolver: zodResolver(FormSchema),
  });
  //Function to handle Form Submission
  const onSubmit = async (value: IForm) => {
    const res = await AddExit(value);
    if (res) {
      toast({ title: "Something went wrong" });
      return;
    }
    form.reset();
    toast({ title: "Submitted Successfully" });
  };
  //watch reason input
  const reason = form.watch("reason");
  //toaster
  const { toast } = useToast();
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
                <Input placeholder="Enter your roll number" {...field} />
                <FormControl></FormControl>
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
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select the reason for exit</FormLabel>
                <FormControl>
                  <ReasonSelect />
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
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ExitForm;
