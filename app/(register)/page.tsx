import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex justify-around">
        <div className="mt-40">
            <div className="max-w-lg space-y-8">
                    <h1 className="text-6xl font-extrabold tracking-tight text-primary">
                        Your World, Live.
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Create rooms, invite your crew, and keep the conversation flowing. 
                        From deep talks to quick gossip, BlinkChat is your space to be heard.
                    </p>
                    <h4 className="text-lg font-semibold text-indigo-600">
                        Create your world...
                    </h4>
            </div>
            <div className="ml-2 flex gap-4">
                
            <Button>get started</Button>
            <Button variant="outline">login</Button> 
            </div>
        </div>
        <video autoPlay loop muted playsInline className="max-w-md">
            <source src="/frontpage.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        </div>
    );
}