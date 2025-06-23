import React from "react";

export default function InterestedPage() {
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center">
      <div className="flex w-full max-w-4xl bg-[#222] rounded-2xl shadow-lg overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-2">
                {/* Logo placeholder */}
                <span className="text-white text-2xl font-bold">⭘</span>
              </div>
              <span className="text-xs text-red-400 font-semibold tracking-widest">BETA</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Get Early Access</h2>
            <p className="text-gray-300 text-sm">Sign up to be the first to try our platform. Enter your email below to request early access.</p>
          </div>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-[#181818] text-white border border-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Get early access
            </button>
          </form>
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-sm">Already have access? </span>
            <a href="/login" className="text-blue-400 hover:underline text-sm">Sign in</a>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:block flex-1 bg-[#181818] flex items-center justify-center relative">
          {/* Replace the below div with your illustration/image */}
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/whale-cloud-art.png"
              alt="Illustration"
              className="object-cover w-full h-full rounded-r-2xl"
              style={{ maxHeight: 400 }}
            />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="text-white text-lg font-semibold">A Hollywood Studio</div>
            <div className="text-white text-base italic">at your fingertips.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
