import { Smartphone, QrCode, CheckCircle2 } from 'lucide-react';

export default function DownloadAppSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 sm:p-12 lg:p-16 relative shadow-2xl overflow-hidden">
          {/* Subtle light accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Info & Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-white text-xs font-semibold">
                <Smartphone size={14} className="text-teal-300" />
                <span>The Traveler App</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Carry Your Entire Journey in Your Pocket
              </h2>

              <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl">
                Real-time trip itineraries, digital boarding vouchers, verified route driver contacts, and 24×7 emergency SOS — always accessible online and offline.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle2 size={18} className="text-teal-300 shrink-0" />
                  <span>Instant offline voucher access with QR check-in</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle2 size={18} className="text-teal-300 shrink-0" />
                  <span>Live tracking for intercity route cabs & emergency SOS</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle2 size={18} className="text-teal-300 shrink-0" />
                  <span>Direct group chat with your tour mates & local guide</span>
                </div>
              </div>

              {/* App store buttons & QR */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {/* Google Play */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-black text-white flex items-center gap-3 border border-slate-700 shadow-md transition-all duration-200"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.94 1.94 0 0 1-.61-.925V2.739c0-.34.12-.663.344-.925h.265zm11.24 11.24l2.453-2.454-9.98-5.759 7.527 8.213zm2.454 1.892l-2.454-2.454-7.527 8.213 9.98-5.759zm1.189-1.365l3.226-1.86a1.5 1.5 0 0 0 0-2.6l-3.226-1.86-1.42 1.42 1.42 1.42.001 7.48z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">GET IT ON</div>
                    <div className="text-sm font-bold leading-tight">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="https://apple.com/app-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-black text-white flex items-center gap-3 border border-slate-700 shadow-md transition-all duration-200"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.96 1.07.08 2.15-.48 2.81-1.3z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Download on the</div>
                    <div className="text-sm font-bold leading-tight">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: Phone Mockup & QR Code */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Phone Frame Mockup */}
              <div className="w-64 rounded-[40px] border-4 border-slate-900 bg-slate-900 p-2 shadow-2xl overflow-hidden shrink-0">
                <div className="relative rounded-[32px] overflow-hidden bg-slate-800 aspect-[9/18]">
                  <img
                    src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80"
                    alt="ApnaTrip Mobile App"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-white text-xs pt-1">
                      <span className="font-semibold">ApnaTrip Mobile</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="text-white space-y-1">
                      <span className="text-[10px] uppercase font-bold text-teal-300">Live Trip</span>
                      <h4 className="font-bold text-sm">Meghalaya Monsoon Trek</h4>
                      <p className="text-[11px] text-slate-300">Driver: Rajesh Barman · Toyota Innova</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Card */}
              <div className="p-4 rounded-2xl bg-white text-slate-900 text-center shadow-lg w-40 shrink-0">
                <div className="w-28 h-28 mx-auto bg-slate-100 rounded-xl flex items-center justify-center p-2 mb-2 border border-slate-200">
                  <QrCode size={90} className="text-slate-800" />
                </div>
                <div className="text-[11px] font-bold text-slate-800">Scan to Install</div>
                <div className="text-[10px] text-slate-500">Android & iOS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
