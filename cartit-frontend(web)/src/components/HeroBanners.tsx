import React, { useState, useEffect } from 'react';
import { MOCK_BANNERS } from '../data/mockData';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface HeroBannersProps {
  onBannerClick?: () => void;
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % MOCK_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + MOCK_BANNERS.length) % MOCK_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % MOCK_BANNERS.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl shadow-ambient-lg min-h-[220px] sm:min-h-[260px] md:min-h-[280px]">
        {MOCK_BANNERS.map((banner, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 bg-gradient-to-r ${banner.gradient} ${
                isActive ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-4 pointer-events-none'
              }`}
            >
              {/* Text content */}
              <div className="z-10 text-white max-w-xl flex flex-col items-start gap-2.5 sm:gap-3">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black tracking-wider text-[#cbffc2] uppercase">
                  <Zap className="w-3.5 h-3.5 fill-[#cbffc2]" />
                  <span>{banner.tag}</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight drop-shadow-sm">
                  {banner.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-emerald-100 opacity-90 line-clamp-2">
                  {banner.subtitle}
                </p>
                <button className="mt-2 flex items-center gap-2 bg-white text-[#0d631b] hover:bg-[#cbffc2] px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-md transition-all group cursor-pointer">
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Decorative Image */}
              <div className="hidden md:block relative z-10 w-64 h-52 shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover rounded-2xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          );
        })}

        {/* Carousel controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#0d631b] flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#0d631b] flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {MOCK_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
