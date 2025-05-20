"use client"

import Image from "next/image"
import { StarRating } from "./star-rating"

export const SocialProof = () => {
  const logos = [
    { src: "/logos/new_logos/LaMarquise.webp", alt: "La Marquise Fine Jewellery" },
    { src: "/logos/new_logos/Bajaj_Finserv.png", alt: "Bajaj Finserv" },
    { src: "/logos/new_logos/Rummyverse.png", alt: "RummyVerse Cash" },
    { src: "/logos/new_logos/guvi-logo.png", alt: "GUVI" },
    { src: "/logos/new_logos/Hiveminds.png", alt: "Hiveminds" },
    { src: "/logos/new_logos/Smallcase_idjuKylPFo_0.png", alt: "Smallcase" },
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
          <div className="logos-slider flex gap-8">
            <div className="logos-slide flex gap-8">
              {logos.map((logo, index) => (
                <div key={`logo-1-${index}`} className="mx-10 group relative h-32 w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      width={140}
                      height={60}
                      className="object-contain filter grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 p-2"
                      style={{ objectFit: "contain", maxHeight: '60px', maxWidth: '140px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="logos-slide">
              {logos.map((logo, index) => (
                <div key={`logo-2-${index}`} className="mx-10 group relative h-32 w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={logo.src || "/placeholder.svg"}
                      alt={logo.alt}
                      width={140}
                      height={60}
                      className="object-contain filter grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 p-2"
                      style={{ objectFit: "contain", maxHeight: '60px', maxWidth: '140px' }}
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