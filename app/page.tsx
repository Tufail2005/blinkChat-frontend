import MainLeft from "@/components/MainLeft";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      {/* navbar */}
      <div className=" flex border-b justify-between mt-3">
        <img src="/logo.png" alt="logo" className="h-12 w-auto" />
        <div>
          <Link href={"/about"} className="mx-2">
            About
          </Link>
          <Link href={"/contactus"} className="mx-2">
            contact us
          </Link>
        </div>
      </div>
      {/* nav bar end here  */}

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
        <div className="flex justify-center px-12 lg:px-25 pt-25 bg-gradient-to-br from-slate-250 to-white">
          <MainLeft />
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center">
          <video autoPlay loop muted playsInline className="max-w-xl w-full">
            <source src="/frontpage.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
