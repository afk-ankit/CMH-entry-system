"use client";
import Image from "next/image";
import LottieAnimation from "./LottieAnimation";
import animationData from "@/../public/tick_animation.json";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyToken } from "@/lib/utils";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const time = searchParams.get("time");

  if (!token || !time) {
    router.push("/");
    return;
  }

  if (token) {
    verifyToken(token).then((data) => {
      if (!data) return router.push("/");
    });
  }

  return (
    <main className="w-full min-h-[calc(100dvh-64px)] grid place-items-center">
      <div className="w-full md:w-[500px] shadow-md rounded-md p-8 bg-background text-center">
        <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
          <Image
            src={"/cmh-logo.png"}
            alt="charaideo logo"
            className="aspect-square w-[100px] sm:w-[50px]"
            width={200}
            height={200}
          />
          <h1 className="font-bold text-3xl md:text-4xl text-center">
            Welcome to CMH
          </h1>
        </div>
        <div className="h-[160px] overflow-hidden relative w-full -mt-2">
          <LottieAnimation animationData={animationData} loop={false} />
        </div>
        <div className="space-y-4">
          <h1 className="text-xl font-bold">
            You entry is successfully registered
          </h1>
          {time && (
            <h1 className="text-4xl font-bold">
              {format(parseInt(time), "hh:mma")}
            </h1>
          )}
          <div>
            <span>Please abide by the hostel rules.</span>{" "}
            <a
              href="http://www.tezu.ernet.in/hostels/cmh/pdf/cmh%20Hostel_Rules_2019.pdf"
              target="_blank"
              className="hover:underline text-blue-700"
            >
              Link to hostel rules.
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Success;
