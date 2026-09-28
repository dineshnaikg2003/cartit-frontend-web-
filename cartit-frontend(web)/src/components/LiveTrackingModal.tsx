import React, { useState, useEffect } from 'react';
import { 
  X, Phone, ShieldCheck, Clock, CheckCircle2, Navigation, 
  Store, PackageCheck, Bike, Home, ChevronDown, ChevronUp 
} from 'lucide-react';

interface LiveTrackingModalProps {
  isOpen: boolean;
  orderId: string | null;
  onClose: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(2); // 0: Placed, 1: Packing, 2: Out for delivery, 3: Delivered
  const [etaSeconds, setEtaSeconds] = useState(540); // 9 minutes countdown
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !orderId) return null;

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const steps = [
    { title: 'Order Placed', desc: 'Received by CartIT Express', icon: CheckCircle2 },
    { title: 'Packed at Hub', desc: 'CartIT Dark Store #4', icon: PackageCheck },
    { title: 'Out for Delivery', desc: 'Delivery partner on the way', icon: Bike },
    { title: 'Delivered', desc: 'Reaching your doorstep', icon: Home },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Live Express Tracking</span>
            <h3 className="font-bold text-base font-mono">Order #{orderId}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ETA Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
            <Bike className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
              <Clock className="w-3.5 h-3.5" /> Arriving in
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-white mb-1">
              {formattedTime} <span className="text-base font-sans font-normal text-emerald-200">mins</span>
            </div>
            <p className="text-xs text-emerald-200">Delivery Partner is 1.2 km away</p>
          </div>
        </div>

        {/* Interactive Simulated Map */}
        <div className="relative h-44 bg-slate-100 overflow-hidden border-y border-emerald-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
          
          {/* Animated Route Line */}
          <div className="relative w-4/5 h-20 border-b-2 border-dashed border-emerald-500 flex items-end justify-between px-4">
            {/* Store Marker */}
            <div className="flex flex-col items-center -mb-4">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-100">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">Dark Store</span>
            </div>

            {/* Delivery Rider Animated Icon */}
            <div className="absolute left-[55%] -mb-5 animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl ring-4 ring-amber-100">
                <Bike className="w-6 h-6 animate-bounce" />
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shadow-xs mt-1">Rajesh</span>
            </div>

            {/* Destination Marker */}
            <div className="flex flex-col items-center -mb-4">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-100">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">Your Home</span>
            </div>
          </div>
        </div>

        {/* Delivery Partner Info */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Delivery Partner"
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-gray-900 text-sm">Rajesh Kumar</h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">★ 4.9</span>
              </div>
              <p className="text-xs text-gray-500">CartIT Verified Partner • KA 05 EV 4412</p>
            </div>
          </div>

          <a 
            href="tel:+919876543210"
            className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md hover:bg-emerald-800 transition"
            title="Call Delivery Partner"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Progress Timeline */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-100">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition z-10 ${
                    isCompleted 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </h5>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                  {isCurrent && (
                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toggle Order Items */}
          <div className="border-t border-gray-100 pt-4">
            <button 
              onClick={() => setShowItems(!showItems)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-emerald-800 py-1"
            >
              <span>View Order Items</span>
              {showItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showItems && (
              <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-xl text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Farm Fresh Organic Tomatoes (500g) x 1</span>
                  <span>₹28</span>
                </div>
                <div className="flex justify-between">
                  <span>Amul Taaza Toned Milk (1 L) x 2</span>
                  <span>₹108</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount Paid</span>
                  <span>₹136</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Contactless & Hygienically Delivered
          </p>
        </div>
      </div>
    </div>
  );
};
