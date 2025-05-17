"use client"

import Image from "next/image"
import { StarRating } from "./star-rating"

export const SocialProof = () => {
  const logos = [
    { src: "/logos/la-marquise.png", alt: "La Marquise Fine Jewellery" },
    { src: "/logos/guvi.png", alt: "GUVI" },
    { src: "/logos/bajaj-allianz.webp", alt: "Bajaj Allianz" },
    { src: "/logos/hiveminds.svg", alt: "Hiveminds" },
    { src: "/logos/bajaj-finserv.png", alt: "Bajaj Finserv" },
    { src: "/logos/smallcase.png", alt: "Smallcase" },
    { src: "/logos/rummyverse.png", alt: "RummyVerse Cash" },
  ]

  return (
    <section className="py-12 relative overflow-hidden bg-transparent">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">You're in good company</h2>

        <div className="flex justify-center mb-10">
          <StarRating rating={5} count={128} size="lg" showAverage={false} showCount={false} />
        </div>

        {/* Logo marquee with larger logos */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>

          {/* Marquee container */}
          <div className="logos-slider">
            <div className="logos-slide">
              {logos.map((logo, index) => (
                <div key={`logo-1-${index}`} className="mx-8 group relative h-36 w-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      sizes="256px"
                      className="object-contain filter grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 p-2"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="logos-slide">
              {logos.map((logo, index) => (
                <div key={`logo-2-${index}`} className="mx-8 group relative h-36 w-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      fill
                      sizes="256px"
                      className="object-contain filter grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 p-2"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for the marquee animation */}
      <style jsx global>{`
        @keyframes slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        .logos-slider {
          display: flex;
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
          background: transparent;
        }
        
        .logos-slide {
          display: flex;
          align-items: center;
          animation: slide 30s linear infinite;
          min-width: 100%;
        }
        
        .logos-slider:hover .logos-slide {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}