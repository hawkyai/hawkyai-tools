"use client"

import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Spotlight } from "@/components/ui/spotlight-new"

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <p className="text-gray-300">
                Last updated: 1 Jun 2025
              </p>
              <p className="text-gray-300 mt-4">
                <a href="http://hawky.ai/" className="text-white hover:text-gray-300">Hawky.ai</a> ("we," "our," or "us") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including in connection with Meta (formerly Facebook) advertising accounts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                This Privacy Policy outlines our practices regarding the collection, use, and protection of your personal information when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="text-gray-300">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Personal information (e.g., name, email address, phone number)</li>
                <li>Meta advertising account information</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300">We use the collected information for purposes including:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Providing and improving our services</li>
                <li>Analyzing and optimizing Meta ad campaigns</li>
                <li>Communicating with you about our services</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-300">We may share your information with:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Meta (Facebook) for advertising purposes</li>
                <li>Service providers and partners who assist in operating our services</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="text-gray-300">
                We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-300">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Access, correct, or delete your personal information</li>
                <li>Opt-out of certain data collection and use</li>
                <li>Withdraw consent for processing your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-300 mt-2">
                <a href="mailto:team@hawky.ai" className="text-white hover:text-gray-300">team@hawky.ai</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © Hawky.ai PRIVATE LIMITED. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Last updated: 15 Aug 2024
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 