import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";

export function MessageList() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-6 px-6 py-6 pb-10">
        {/* --- RECEIVED MESSAGE --- */}
        <div className="flex flex-col items-start max-w-[75%]">
          <div className="flex items-end gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=1" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>

            <div className="relative bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm text-gray-700 text-sm leading-relaxed">
              <p>
                I know how important this file is to you. You can trust me ;) I
                know how important this file is to you. You can trust me ;)
              </p>
            </div>
          </div>

          <span className="text-xs text-gray-400 mt-1 ml-11">05:23 PM</span>
        </div>

        {/* --- SENT MESSAGE --- */}
        <div className="flex flex-col items-end self-end max-w-[75%]">
          <div className="flex flex-row-reverse items-end gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=2" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>

            <div className="relative bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md text-sm leading-relaxed">
              <p>
                I know how important this file is to you. You can trust me ;) me
                ;)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1 mr-11">
            <span className="text-xs text-gray-400">05:23 PM</span>
            <CheckCheck className="h-3.5 w-3.5 text-green-500" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
