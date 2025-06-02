// import { Header } from "@/components/ui/header"
// import { Footer } from "@/components/ui/footer"
// import { GetDemoForm } from "@/components/get-demo-form"
// import { TestimonialsMovingCards } from "@/components/testimonials-moving-cards"
// import { BrandLogos } from "@/components/brand-logos"
// import { GetStartedSection } from "@/components/get-started-section"

// export default function GetDemoPage() {
//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Header />
//       <div className="container mx-auto py-12 px-4 md:px-6">
//         <h1 className="text-3xl md:text-4xl font-bold mb-8 text-left">Achieve better ROAS with Hawky.ai</h1>

//         {/* Mobile Form - Only visible on small screens */}
//         <div className="lg:hidden mb-12">
//           <GetDemoForm />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-12">
//           {/* Left side - Testimonials and Logos */}
//           <div className="space-y-10">
//             <div className="space-y-6">
//               <h2 className="text-2xl font-semibold text-white">Trusted by Leading Brands</h2>
//               <p className="text-gray-9 max-w-md">
//                 Join hundreds of companies using Hawky.ai to optimize their creative performance and drive better
//                 marketing results.
//               </p>

//               <BrandLogos />
//             </div>

//             <div className="space-y-6">
//               <h2 className="text-2xl font-semibold text-white">What Our Clients Say</h2>
//               <TestimonialsMovingCards />
//             </div>
//           </div>

//           {/* Right side - Lead Generation Form - Only visible on large screens */}
//           <div className="hidden lg:block lg:border-l lg:border-gray-3/20 lg:pl-16">
//             <GetDemoForm />
//           </div>
//         </div>
//       </div>

//       <GetStartedSection
//         title="Automate your"
//         flipWords={["Analysis", "Research", "Production", "Optimisation"]}
//         description="Join leading B2C marketers who are achieving predictable outcomes with Hawky.ai."
//         buttonText="Get Started"
//         buttonHref="/get-demo"
//       />

//       <Footer />
//     </div>
//   )
// }



import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { GetDemoForm } from "@/components/get-demo-form"
import { TestimonialsMovingCards } from "@/components/testimonials-moving-cards"
import { BrandLogos } from "@/components/brand-logos"
import { GetStartedSection } from "@/components/get-started-section"

export default function GetDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Static H1 title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-left">Transform Your Marketing Performance</h1>

        {/* Mobile Form - Only visible on small screens */}
        <div className="lg:hidden mb-12">
          <GetDemoForm />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-12">
          {/* Left side - Testimonials and Logos */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Trusted by Leading Brands</h2>
              <p className="text-gray-9 max-w-md">Join the ranks of successful marketers who trust Hawky.ai for their creative optimization needs.</p>

              <BrandLogos />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">What Our Clients Say</h2>
              <TestimonialsMovingCards />
            </div>
          </div>

          {/* Right side - Lead Generation Form - Only visible on large screens */}
          <div className="hidden lg:block lg:border-l lg:border-gray-3/20 lg:pl-16">
            <GetDemoForm />
          </div>
        </div>
      </div>

      <GetStartedSection
        title="Automate your"
        flipWords={["Analysis", "Research", "Production", "Optimisation"]}
        description="Join leading B2C marketers who are achieving predictable outcomes with Hawky.ai."
        buttonText="Get Started"
        buttonHref="/get-demo"
      />

      <Footer />
    </div>
  )
}
