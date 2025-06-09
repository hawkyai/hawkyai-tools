import type React from "react";
import "@/app/globals.css";
import { Source_Sans_3, Raleway } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import type { Metadata } from "next";

// Load Source Sans Pro (now called Source Sans 3)
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
});

// Load Raleway for the "Creative factory" text
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Hawky.ai - Creative Factory for Performance Marketers",
  description:
    "Transform your marketing performance with Hawky.ai's AI-powered creative factory. Generate, analyze, and optimize high-performing ad creatives at scale.",
  icons: {
    icon: [
      { url: "/logos/Favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/Favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/logos/Favicon/favicon.ico",
    apple: "/logos/Favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/logos/Favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/logos/Favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/logos/Favicon/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5WB2NFZC');
          `}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-LMYBZ2HV2F`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LMYBZ2HV2F');
          `}
        </Script>
        {/* End Google Analytics */}

        {/* B2B Tracking Script */}
        <Script id="b2b-tracking" strategy="afterInteractive">
          {`
            !function () {
              var reb2b = window.reb2b = window.reb2b || [];
              if (reb2b.invoked) return;
              reb2b.invoked = true;
              reb2b.methods = ["identify", "collect"];
              reb2b.factory = function (method) {
                return function () {
                  var args = Array.prototype.slice.call(arguments);
                  args.unshift(method);
                  reb2b.push(args);
                  return reb2b;
                };
              };
              for (var i = 0; i < reb2b.methods.length; i++) {
                var key = reb2b.methods[i];
                reb2b[key] = reb2b.factory(key);
              }
              reb2b.load = function (key) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.async = true;
                script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/4O7Z0HM53ENX.js.gz";
                var first = document.getElementsByTagName("script")[0];
                first.parentNode.insertBefore(script, first);
              };
              reb2b.SNIPPET_VERSION = "1.0.1";
              reb2b.load("4O7Z0HM53ENX");
            }();
          `}
        </Script>
        <Script id="factors-ai-tracker" strategy="beforeInteractive">
          {`
            window.faitracker=window.faitracker||function(){this.q=[];var t=new CustomEvent("FAITRACKER_QUEUED_EVENT");return this.init=function(t,e,a){this.TOKEN=t,this.INIT_PARAMS=e,this.INIT_CALLBACK=a,window.dispatchEvent(new CustomEvent("FAITRACKER_INIT_EVENT"))},this.call=function(){var e={k:"",a:[]};if(arguments&&arguments.length>=1){for(var a=1;a<arguments.length;a++)e.a.push(arguments[a]);e.k=arguments[0]}this.q.push(e),window.dispatchEvent(t)},this.message=function(){window.addEventListener("message",function(t){"faitracker"===t.data.origin&&this.call("message",t.data.type,t.data.message)})},this.message(),this.init("k8i7d4utf01wqp27047fb74uqbl45w11",{host:"https://api.factors.ai"}),this}();
          `}
        </Script>
        <Script
          src="https://app.factors.ai/assets/factors.js"
          strategy="afterInteractive"
          async
        />
      </head>
      <body className={`${sourceSans.className} ${sourceSans.variable} ${raleway.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5WB2NFZC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}");
            `,
          }}
        />
        {/* End Microsoft Clarity */}

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
