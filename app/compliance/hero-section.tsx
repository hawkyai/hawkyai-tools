export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-6 text-white">
          <span className="gradient-text text-white">Ad Compliance</span> Checker
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Automate compliance analysis of your ad creatives across different regulations
        </p>
        <div className="flex flex-row gap-2 sm:gap-6 justify-center items-center mt-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-xs sm:text-sm">Instant Analysis</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-xs sm:text-sm">Detailed report</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-white text-xs sm:text-sm">100% Free</span>
          </div>
        </div>
      </div>
    </div>
  )
}

