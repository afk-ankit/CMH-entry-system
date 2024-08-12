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
import { useRouter } from "next/navigation";
import {
  loadFromLocalStorage,
  LOCAL_STORAGE_ENTRY_KEY,
  LOCAL_STORAGE_EXIT_KEY,
  saveToLocalStorage,
  signToken,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  roll_number: z.string().min(5, { message: "Invalid Roll Number" }),
  room_number: z
    .number({ message: "Invalid Room Number" })
    .nonnegative({ message: "Room number cannot be negative" })
    .min(100, { message: "Invalid Room Number" })
    .max(999, { message: "Invalid Room Number" }),
});
export type IEntryForm = z.infer<typeof FormSchema>;
const EntryForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //useForm init
  const form = useForm<IEntryForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      roll_number: "",
      room_number: NaN,
    },
  });
  useEffect(() => {
    const storedData = loadFromLocalStorage(LOCAL_STORAGE_EXIT_KEY);
    if (storedData) {
      form.reset(storedData);
    }
  }, [form]);
  //Function to handle Form Submission
  const onSubmit = async (value: IEntryForm) => {
    try {
      setLoading(true);
      const res = await AddEntry(value);
      saveToLocalStorage(value, LOCAL_STORAGE_ENTRY_KEY);
      const token = await signToken({ ...value });
      if (res) {
        toast({
          title: "Something went wrong in saving your data. Please try again.",
        });
        return;
      }
      toast({ title: "Submitted Successfully" });
      router.push(`/success?token=${token}&time=${Date.now()}`);
      form.reset();
    } catch (error) {
      if (error instanceof Error) toast({ title: error.message });
    } finally {
      setLoading(false);
    }
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
                    type="number"
                    placeholder="Enter your room number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!isWithinGeofence || !!error || loading}
          >
            {loading && (
              <LoaderCircle
                size={18}
                className="text-white animate-spin mr-2"
              />
            )}
            Submit
          </Button>
        </form>
      </Form>
      <div className="space-y-4 mt-4">
        <p className="text-center text">
          You must be within the hostel premises to submit the entry form.
        </p>
        {error && (
          <p className="text-center text-sm bg-destructive text-destructive-foreground w-fit mx-auto py-1 px-2 rounded-sm">
            {error}
          </p>
        )}
        <GoogleMapGeofence userLocation={userLocation} />
      </div>
    </>
  );
};
export default EntryForm;
