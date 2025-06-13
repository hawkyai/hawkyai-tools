"use client"

import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Spotlight } from "@/components/ui/spotlight-new"
import Script from "next/script"

export default function GetDemoPro() {
  return (
    <div className="flex min-h-screen flex-col bg-black relative overflow-hidden w-full">
      {/* Spotlight effect */}
      <Spotlight
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
        translateY={0}
      />

      {/* Purple-green tint at the top */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[rgba(138,80,155,0.15)] via-[rgba(82,61,90,0.08)] to-transparent z-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl z-10"></div>
      <div className="absolute top-[30%] left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl z-10"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl z-10"></div>

      <Header />

      <main className="flex-1 relative z-20">
        {/* Hero Section */}
        <section className="py-20 md:py-24 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="font-raleway bg-clip-text text-transparent bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                  Get Started with Hawky.ai
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-9 max-w-3xl mx-auto">
                Transform your marketing performance with our AI-powered creative factory. Fill out the form below to schedule your demo.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 md:py-16 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/80 backdrop-blur-lg border border-gray-3/40 rounded-2xl p-6 md:p-8 shadow-[0_4px_32px_0_rgba(249,206,52,0.10),0_2px_8px_0_rgba(238,42,123,0.12),0_1.5px_6px_0_rgba(98,40,215,0.15)]">
                <div id="zf_div_VikKaZx1-dPE67LWk4vXkzRlgxWza2BGLgcmmNr-kx8" className="w-full flex justify-center"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Zoho Form Script */}
      <Script id="zoho-form" strategy="afterInteractive">
        {`
          (function() {
            try {
              var f = document.createElement("iframe");
              f.src = "https://forms.zohopublic.in/hawkyha1/form/Signup/formperma/VikKaZx1-dPE67LWk4vXkzRlgxWza2BGLgcmmNr-kx8?zf_rszfm=1&SOURCE=Website";
              f.style.border = "none";
              f.style.height = "937px";
              f.style.width = "90%";
              f.style.transition = "all 0.5s ease";
              f.setAttribute("aria-label", 'Signup');

              var d = document.getElementById("zf_div_VikKaZx1-dPE67LWk4vXkzRlgxWza2BGLgcmmNr-kx8");
              d.appendChild(f);
              window.addEventListener('message', function (){
                var evntData = event.data;
                if( evntData && evntData.constructor == String ){
                  var zf_ifrm_data = evntData.split("|");
                  if ( zf_ifrm_data.length == 2 || zf_ifrm_data.length == 3 ) {
                    var zf_perma = zf_ifrm_data[0];
                    var zf_ifrm_ht_nw = ( parseInt(zf_ifrm_data[1], 10) + 15 ) + "px";
                    var iframe = document.getElementById("zf_div_VikKaZx1-dPE67LWk4vXkzRlgxWza2BGLgcmmNr-kx8").getElementsByTagName("iframe")[0];
                    if ( (iframe.src).indexOf('formperma') > 0 && (iframe.src).indexOf(zf_perma) > 0 ) {
                      var prevIframeHeight = iframe.style.height;
                      var zf_tout = false;
                      if( zf_ifrm_data.length == 3 ) {
                        iframe.scrollIntoView();
                        zf_tout = true;
                      }
                      if ( prevIframeHeight != zf_ifrm_ht_nw ) {
                        if( zf_tout ) {
                          setTimeout(function(){
                            iframe.style.height = zf_ifrm_ht_nw;
                          },500);
                        } else {
                          iframe.style.height = zf_ifrm_ht_nw;
                        }
                      }
                    }
                  }
                }
              }, false);
            } catch(e) {}
          })();
        `}
      </Script>
    </div>
  )
}
