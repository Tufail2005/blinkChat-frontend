import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LandingHero({ onGetStarted }: { onGetStarted: () => void }) {
  const router = useRouter();
  return (
    <div>
      <div className="max-w-lg pt-30">
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">
          Your World, Live.
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed">
          Create rooms, invite your crew, and keep the conversation flowing.
          From deep talks to quick gossip, BlinkChat is your space to be heard.
        </p>
        <h4 className="text-lg font-semibold text-indigo-600 my-3">
          Create your world...
        </h4>
      </div>
      <div className="ml-2 flex gap-4">
        <Button
          size="lg"
          onClick={onGetStarted}
          className="bg-black text-white hover:cursor-pointer"
        >
          get started
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/signin")}
        >
          login
        </Button>
      </div>
    </div>
  );
}
