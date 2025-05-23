"use client"

import Image from "next/image"
import { StarRating } from "./star-rating"

export const SocialProof = () => {
  const logos = [
    { src: "/logos/marquise.png", alt: "La Marquise Fine Jewellery" },
    { src: "/logos/bajaserv.png", alt: "Bajaj Finserv" },
    { src: "/logos/guvi.png", alt: "GUVI" },
    { src: "/logos/hiveminds1.png", alt: "Hiveminds" },
    { src: "/logos/smallcase1.png", alt: "Smallcase" },
    { src: "/logos/rummyverse.png", alt: "RummyVerse Cash" },

  ]

  return (
    <section className="py-10 md:py-16 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-6 sm:mb-8">
          You're in good company
        </h2>

        <div className="flex justify-center mb-8 sm:mb-10">
          <StarRating rating={5} count={128} size="lg" showAverage={false} showCount={false} />
        </div>

        {/* Marquee container */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          {/* Marquee animation row */}
          <div className="logos-track flex w-fit animate-slide">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`logo-${index}`}
                className="relative h-20 w-28 sm:h-24 sm:w-36 md:h-28 md:w-44 lg:h-32 lg:w-48 flex items-center justify-center group mx-4 sm:mx-6"
              >
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  width={140}
                  height={60}
                  className="object-contain transition-all duration-300 group-hover:opacity-100 opacity-90 p-2"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee animation */}
      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .logos-track {
          animation: slide 30s linear infinite;
        }

        .logos-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}