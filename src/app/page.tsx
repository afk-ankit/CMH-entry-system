import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center w-full min-h-[calc(100dvh-64px)] grid place-items-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Charaideo Men&apos;s Hostel</h1>
        <div className="flex gap-2 justify-center">
          <Link href={"/entry"}>
            <Button>Entry Form</Button>
          </Link>
          <Link href={"/exit"}>
            <Button>Exit Form</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
