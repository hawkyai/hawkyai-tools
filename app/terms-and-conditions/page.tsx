"use client"

import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Spotlight } from "@/components/ui/spotlight-new"

export default function TermsAndConditions() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Spotlight effect */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
      />

      <Header /> 

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-white">Terms and Conditions</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                Welcome to Hawky.ai. These terms and conditions outline the rules and regulations for the use of our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>"Service" refers to the website and all services provided by Hawky.ai</li>
                <li>"User" refers to any individual or entity using our Service</li>
                <li>"Content" refers to any material, information, or data uploaded, downloaded, or appearing on our Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Use License</h2>
              <p className="text-gray-300">
                Permission is granted to temporarily access the materials (information or software) on Hawky.ai's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-300 mt-4">
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on Hawky.ai's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
              <p className="text-gray-300">
                As a user of our Service, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Privacy Policy</h2>
              <p className="text-gray-300">
                Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
              <p className="text-gray-300">
                The materials on Hawky.ai's website are provided on an 'as is' basis. Hawky.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitations</h2>
              <p className="text-gray-300">
                In no event shall Hawky.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hawky.ai's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Revisions and Errata</h2>
              <p className="text-gray-300">
                The materials appearing on Hawky.ai's website could include technical, typographical, or photographic errors. Hawky.ai does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-300">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-300 mt-2">
                Email: support@hawky.ai
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
