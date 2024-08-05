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
import { AddEntry } from "@/lib/actions/server-action";
import { useToast } from "@/components/ui/use-toast";
import { useGeofencedLocation } from "@/hooks/useGeofencedLocation";
import GoogleMapGeofence from "./GoogleMapGeofence";

const FormSchema = z.object({
  name: z.string().min(1),
  roll_number: z.string().min(5),
  room_number: z.number({ message: "Excpected Number" }).nonnegative(),
});
export type IEntryForm = z.infer<typeof FormSchema>;

const EntryForm = () => {
  //useForm init
  const form = useForm<IEntryForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      roll_number: "",
    },
  });
  //Function to handle Form Submission
  const onSubmit = async (value: IEntryForm) => {
    const res = await AddEntry(value);
    if (res) {
      toast({ title: "Something went wrong" });
      return;
    }
    form.reset();
    toast({ title: "Submitted Successfully" });
  };
  //toaster
  const { toast } = useToast();
  //geolocation hook
  const { isWithinGeofence, error, userLocation } = useGeofencedLocation();
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
          <Button
            type="submit"
            className="w-full"
            disabled={!isWithinGeofence || !!error}
          >
            Submit
          </Button>
        </form>
      </Form>
      <div className="space-y-4 mt-4">
        {!error && !isWithinGeofence && (
          <p className="text-center text-lg font-bold">
            You must be within the hostel premises to submit the entry form.
          </p>
        )}
        {error && (
          <p className="text-center text-lg bg-destructive/90 text-destructive-foreground w-fit mx-auto py-1 px-3 rounded-md">
            {error}
          </p>
        )}
        <GoogleMapGeofence userLocation={userLocation} />
      </div>
    </>
  );
};
export default EntryForm;
