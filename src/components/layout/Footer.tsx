import React from 'react';
import { useLocation } from 'react-router-dom';
import { Camera, Music, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="mt-24 pt-16 pb-8 border-t border-white/5 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 max-w-2xl">
        {isHomePage && (
          <>
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-yellow-600/50" />
              <span className="text-[#CBA358] tracking-[0.3em] text-xs font-medium uppercase flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Sosial Media
              </span>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-light mb-12 text-white font-sans">
              Tetap <span className="font-heading italic text-[#CBA358]">Terhubung</span>
            </h2>

            {/* Social Cards */}
            <div className="space-y-4 mb-24">
              {/* Instagram */}
              <a href="https://www.instagram.com/9k.bone?igsh=cXRvdHg1OXpoN3Ru" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative overflow-hidden bg-[#13131A] border border-white/5 rounded-3xl p-4 flex items-center justify-between transition-colors hover:bg-white/[0.03]">
                  <div className="absolute top-0 right-0 bottom-0 w-48 bg-pink-500/10 blur-[40px] rounded-full translate-x-1/2" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase mb-1">Instagram</p>
                      <p className="text-slate-200 font-medium tracking-wide">NineKeiyb.one</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-pink-500/50 group-hover:text-pink-400 group-hover:translate-x-1 transition-all mr-2">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com/@viii_k34" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative overflow-hidden bg-[#13131A] border border-white/5 rounded-3xl p-4 flex items-center justify-between transition-colors hover:bg-white/[0.03]">
                  <div className="absolute top-0 right-0 bottom-0 w-48 bg-cyan-500/10 blur-[40px] rounded-full translate-x-1/2" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase mb-1">TikTok</p>
                      <p className="text-slate-200 font-medium tracking-wide">@viii_k34</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mr-2">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://whatsapp.com/channel/0029Vap7QcO3QxRzzdF3Y73G" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative overflow-hidden bg-[#13131A] border border-white/5 rounded-3xl p-4 flex items-center justify-between transition-colors hover:bg-white/[0.03]">
                  <div className="absolute top-0 right-0 bottom-0 w-48 bg-green-500/10 blur-[40px] rounded-full translate-x-1/2" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase mb-1">WhatsApp</p>
                      <p className="text-slate-200 font-medium tracking-wide">About_9K</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-green-500/50 group-hover:text-green-400 group-hover:translate-x-1 transition-all mr-2">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>
          </>
        )}

        {/* Developer Contact Notice */}
        <div className="text-center mb-10 px-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl max-w-lg mx-auto">
          <p className="text-xs text-slate-400 tracking-wide font-sans leading-relaxed">
            kalo ada bug / fitur yang ga berfungsi silakan hubungi developernya yaitu <span className="text-[#CBA358] font-bold">nizam dzr.dev</span>
          </p>
        </div>

        {/* Bottom Logo */}
        <div className="text-center pb-8 pt-12 border-t border-white/5 relative">
          <h1 className="text-5xl md:text-6xl font-heading text-[#CBA358] mb-4 tracking-widest">IX K</h1>
          <p className="text-[10px] md:text-xs tracking-[0.1em] text-slate-500 uppercase">
            SMPN 1 IBUN • 2026 - 2027
          </p>
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-mono tracking-wider">
              Dibuat oleh Nizam DzR.Dev <span className="text-[#CBA358]">{'{/}'}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
