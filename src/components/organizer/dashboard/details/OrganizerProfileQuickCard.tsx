import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function OrganizerProfileQuickCard() {
  const router = useRouter();
  const organizer = useAppSelector(
    (state) => state.organizerAuth.organizer
  );

  return (
    <Card className="
      relative overflow-hidden
      border border-gray-200
      bg-white
      shadow-sm
      hover:shadow-lg
      transition-all duration-300
    ">
      {/* Decorative gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* LEFT: Profile Identity */}
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="
              w-16 h-16 rounded-2xl
              bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center
              text-white text-xl font-bold
              shadow-md
            ">
              {organizer?.name?.charAt(0) ?? "O"}
            </div>

            {/* Text Info */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {organizer?.name}
              </span>

              <span className="text-sm text-gray-500">
                {organizer?.email}
              </span>

              <div className="mt-2 flex items-center gap-2">
                <span className="
                  inline-flex items-center gap-1
                  px-2.5 py-1
                  rounded-full
                  bg-indigo-50
                  text-indigo-600
                  text-xs font-medium
                ">
                  Organizer Account
                </span>

                {organizer?.isVerified && (
                  <span className="
                    inline-flex items-center gap-1
                    px-2.5 py-1
                    rounded-full
                    bg-emerald-50
                    text-emerald-600
                    text-xs font-medium
                  ">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Action */}
          <button
            onClick={() => router.push("/organizer/profile")}
            className="
              group inline-flex items-center justify-center
              gap-2
              px-6 py-3
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              transition-all
              shadow-md hover:shadow-lg
              w-full md:w-auto
            "
          >
            <User size={16} />
            View Profile
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

        </div>
      </CardContent>
    </Card>
  );
}
