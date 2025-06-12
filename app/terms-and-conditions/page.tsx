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
          <h1 className="text-4xl font-bold mb-8 text-white">Terms & Services</h1>
          
          <div className="space-y-8">
            <section>
              <p className="text-gray-300">
                This Usage Policy governs your access to and use of any websites, products, or services (collectively, "Services") offered by Hawky.ai ("we", "us", or "our"). By accessing or using our Services, you agree to be bound by this policy, which forms a legally binding contract between you and Hawky.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                Our Services are intended for businesses and professional users only, not for consumers or private household purposes. You must not access or use our Services unless:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>You are acting in a business or professional capacity</li>
                <li>You accept this Usage Policy on behalf of yourself and, if applicable, your organization</li>
                <li>If acting on behalf of your organization, you are authorized to do so</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Acceptable Use</h2>
              <p className="text-gray-300">
                You agree to use the Services only for lawful purposes and in accordance with this policy. You are responsible for all activities conducted through your account.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">2.1 Your Obligations</h3>
              <p className="text-gray-300">You must:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Ensure compliance with this policy by yourself and any authorized users</li>
                <li>Use reasonable efforts to prevent unauthorized access to or use of the Services</li>
                <li>Keep your login information confidential and not share it with third parties</li>
                <li>Monitor and control all activity conducted through your account</li>
                <li>Promptly notify us of any security breach, including unauthorized access or use of your account</li>
                <li>Comply with all applicable terms of Third-Party Services accessed through our Services</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">2.2 Prohibited Actions</h3>
              <p className="text-gray-300">You must not:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Reverse engineer, decompile, disassemble, or attempt to discover the source code, object code, or underlying structure, ideas, know-how, or algorithms related to the Services or any software</li>
                <li>Modify, translate, or create derivative works based on the Services or software, except as expressly permitted by Hawky.ai or authorized within the Services</li>
                <li>Use the Services for timesharing or service bureau purposes or for the benefit of a third party</li>
                <li>Remove any proprietary notices or labels</li>
                <li>Use the Services to store or transmit content that is infringing, defamatory, harmful, or unlawful, including content that violates intellectual property, privacy, or other laws</li>
                <li>Upload or transmit any data, file, or software containing viruses, Trojan horses, worms, or other harmful components</li>
                <li>Attempt to gain unauthorized access to the Services, Third-Party Services, or related systems, or bypass any software protection mechanisms</li>
                <li>Access the Services to build a similar or competitive product or service, or copy any ideas, features, or functions</li>
                <li>Engage in abusive practices, redistribution, syndication, or deceitful activities</li>
                <li>Authorize or encourage any third party to do any of the above</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">2.3 Compliance</h3>
              <p className="text-gray-300">
                You represent, covenant, and warrant that you will use the Services only in compliance with Hawky.ai's standard published policies then in effect (the "Policy") and all applicable laws and regulations.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">2.4 Customer Responsibilities for Equipment and Security</h3>
              <p className="text-gray-300">
                You are responsible for obtaining and maintaining any equipment and ancillary services needed to connect to, access, or otherwise use the Services, including modems, hardware, servers, software, operating systems, networking, web servers, and the like (collectively, "Equipment").
              </p>
              <p className="text-gray-300 mt-4">
                You are also responsible for maintaining the security of the Equipment, your account, passwords (including administrative and user passwords), and files, and for all uses of your account or Equipment with or without your knowledge or consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Services</h2>
              <p className="text-gray-300">
                We are not responsible for any services, information, or content accessed or purchased through Hawky.ai, which you may be able to access, use, or connect to with our Services (together, the "Third-Party Services"). If you access a Third-Party Service through us, you do so at your own risk. You are responsible for complying with all terms, conditions, policies, and guidelines imposed by such Third-Party Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Confidentiality and Data Protection</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-4">4.1 Confidentiality</h3>
              <p className="text-gray-300">
                If we share non-public information about our Services with you, you must keep it confidential and use reasonable security measures to prevent disclosure or access by unauthorized persons.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">4.2 Personal Data</h3>
              <p className="text-gray-300">
                We do not control any personal data you process with our Services; we merely provide tools for you to process data. You must comply with all applicable data privacy and protection laws, including the Digital Personal Data Protection Act, 2023 (India).
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-4">4.3 Data Retention</h3>
              <p className="text-gray-300">
                We will retain your data until you request its deletion. You can request deletion of your data by contacting us at support@hawky.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Warranty Disclaimer</h2>
              <p className="text-gray-300">
                The Services are provided "as is," without any express warranties, representations, guarantees, or conditions unless expressly agreed otherwise. To the greatest extent permitted by applicable law, we disclaim any warranties, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular purpose, title, quality, and non-infringement. We do not guarantee that the Services will always be available, accessible, uninterrupted, timely, secure, accurate, complete, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Content and Services</h2>
              <p className="text-gray-300">
                We are not responsible for Third-Party Services (e.g., Facebook, Google Ads). You must comply with their terms:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
                <li>Facebook Terms</li>
                <li>Facebook Ads Policies</li>
                <li>Google Ads Policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Ads Content: You retain ownership. We use it solely to provide Services.</li>
                <li>Feedback: You grant us a royalty-free license to use Feedback.</li>
                <li>Services: We retain all rights to our Services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Miscellaneous</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Assignment: You may not assign rights without our consent.</li>
                <li>Severability: Invalid provisions do not affect the remainder.</li>
                <li>Force Majeure: Excused for events beyond reasonable control.</li>
                <li>Entire Agreement: Supersedes prior agreements.</li>
                <li>Contact: For questions or deletion requests, email support@hawky.ai.</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © Hawky.ai PRIVATE LIMITED. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
