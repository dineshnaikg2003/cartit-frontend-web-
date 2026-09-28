import React from 'react';
import { ShoppingBag, Clock, ShieldCheck, RefreshCw, Award, Heart, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 mt-16 font-sans">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-emerald-900/80 bg-emerald-900/40">
        <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">10-Minute Express</h4>
              <p className="text-xs text-emerald-300/80">Superfast delivery guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Farm Fresh</h4>
              <p className="text-xs text-emerald-300/80">Direct from local growers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant Refund</h4>
              <p className="text-xs text-emerald-300/80">No questions asked policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Secure Checkout</h4>
              <p className="text-xs text-emerald-300/80">256-bit encrypted payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-white shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight font-sans">
                Cart<span className="text-amber-400">IT</span>
              </span>
              <span className="ml-2 text-[10px] bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Express Web
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-300/70 leading-relaxed max-w-sm">
            CartIT is India's leading 10-minute grocery delivery app. Order farm-fresh fruits, vegetables, dairy, snacks, and daily essentials with lightning-fast express delivery.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button className="bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/60 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-white transition">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Get Android App</span>
            </button>
            <button className="bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/60 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-white transition">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Get iOS App</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-emerald-400">Top Categories</h4>
          <ul className="space-y-2 text-xs text-emerald-300/80">
            <li className="hover:text-amber-400 cursor-pointer transition">Fresh Vegetables</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Organic Fruits</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Dairy, Bread & Eggs</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Snacks & Munchies</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Cold Drinks & Juices</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Atta, Rice & Dals</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-emerald-400">Company</h4>
          <ul className="space-y-2 text-xs text-emerald-300/80">
            <li className="hover:text-amber-400 cursor-pointer transition">About CartIT</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Become a Partner</li>
            <li className="hover:text-amber-400 cursor-pointer transition">CartIT Delivery App</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Careers</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Press & Media</li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-emerald-400">Help & Legal</h4>
          <ul className="space-y-2 text-xs text-emerald-300/80">
            <li className="hover:text-amber-400 cursor-pointer transition">Customer Support</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Terms & Conditions</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Refund Policy</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Security & Trust</li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-emerald-900/80 bg-emerald-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p className="flex items-center gap-1">
            © 2026 CartIT India Private Limited. Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for fast groceries.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
