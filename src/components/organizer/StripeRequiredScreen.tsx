"use client";
// "use client";

// import React, { ReactNode } from "react";
// import { motion } from "framer-motion";
// import { FaLock, FaRocket, FaCreditCard, FaArrowRight } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// export default function StripeRequiredUltra() {
//   const router = useRouter();

//   return (
//     <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">

//       {/* 🌌 animated gradient background */}
//       <div className="absolute inset-0">
//         <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[160px] opacity-30 -top-40 -left-40 animate-pulse" />
//         <div className="absolute w-[600px] h-[600px] bg-blue-600 rounded-full blur-[160px] opacity-30 bottom-0 right-0 animate-pulse" />
//       </div>

//       {/* glass card */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.85, y: 60 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-12 max-w-3xl w-full text-center"
//       >

//         {/* floating icon */}
//         <motion.div
//           animate={{ y: [0, -12, 0] }}
//           transition={{ repeat: Infinity, duration: 2 }}
//           className="w-24 h-24 mx-auto flex items-center justify-center rounded-2xl 
//           bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl shadow-2xl"
//         >
//           <FaCreditCard />
//         </motion.div>

//         {/* title */}
//         <h1 className="text-4xl md:text-5xl font-extrabold mt-8 text-white tracking-tight">
//           Payments Not Connected
//         </h1>

//         <p className="text-gray-300 mt-4 text-lg leading-relaxed">
//           Your organizer account is verified but payments are not enabled yet.
//           Connect Stripe to start selling tickets and receiving payments.
//         </p>

//         {/* features row */}
//         <div className="grid md:grid-cols-3 gap-5 mt-10">

//           <Feature
//             icon={<FaRocket />}
//             title="Create Events"
//             desc="Launch events instantly"
//           />

//           <Feature
//             icon={<FaCreditCard />}
//             title="Accept Payments"
//             desc="Receive ticket payments"
//           />

//           <Feature
//             icon={<FaLock />}
//             title="Secure Payouts"
//             desc="Bank-level security"
//           />

//         </div>

//         {/* CTA */}
//         <motion.button
//           whileHover={{ scale: 1.08 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router.push("/organizer/profile")}
//           className="mt-12 px-10 py-4 rounded-2xl font-bold text-lg text-white 
//           bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
//           shadow-2xl hover:shadow-purple-500/40 flex items-center gap-3 mx-auto"
//         >
//           Connect Stripe Now
//           <FaArrowRight />
//         </motion.button>

//         <p className="text-xs text-gray-400 mt-4">
//           Takes less than 60 seconds • Secure onboarding
//         </p>

//       </motion.div>
//     </div>
//   );
// }

interface FeatureProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

// function Feature({ icon, title, desc }: FeatureProps) {
//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.05 }}
//       className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
//     >
//       <div className="text-indigo-400 text-2xl mb-2 flex justify-center">
//         {icon}
//       </div>
//       <p className="font-semibold text-white">{title}</p>
//       <p className="text-xs text-gray-400 mt-1">{desc}</p>
//     </motion.div>
//   );
// }





import { motion } from "framer-motion";
import { FaCreditCard, FaRocket, FaLock, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function StripeRequiredModern() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-gray-50">

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
        relative overflow-hidden
        bg-white rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        border border-gray-200
        max-w-3xl w-full p-10 text-center
        "
      >

        {/* floating icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="
          w-20 h-20 mx-auto rounded-2xl flex items-center justify-center 
          bg-blue-600 text-white text-3xl shadow-lg
          "
        >
          <FaCreditCard />
        </motion.div>

        {/* heading */}
        <h1 className="text-4xl font-bold text-gray-900 mt-6 tracking-tight">
          Connect Payments to Continue
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Your organizer account is verified but payments are not connected.
          Connect Stripe to create and sell events.
        </p>

        {/* features */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">

          <Feature
            icon={<FaRocket />}
            title="Create Events"
            desc="Launch events instantly"
          />

          <Feature
            icon={<FaCreditCard />}
            title="Accept Payments"
            desc="Sell tickets easily"
          />

          <Feature
            icon={<FaLock />}
            title="Secure Payouts"
            desc="Direct bank transfers"
          />

        </div>

        {/* button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/organizer/profile")}
          className="
          mt-10 px-8 py-4 rounded-xl
          bg-blue-600 hover:bg-blue-700
          text-white font-semibold text-lg
          shadow-lg
          flex items-center gap-3 mx-auto
          transition
          "
        >
          Connect Stripe Now
          <FaArrowRight />
        </motion.button>

        <p className="text-xs text-gray-400 mt-3">
          Takes less than 60 seconds • Secure onboarding
        </p>

      </motion.div>
    </div>
  );
}

function Feature({ icon, title, desc }: FeatureProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
      bg-gray-50
      border border-gray-200
      p-6 rounded-2xl
      hover:shadow-md transition
      "
    >
      <div className="text-blue-600 text-2xl mb-2 flex justify-center">
        {icon}
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </motion.div>
  );
}
