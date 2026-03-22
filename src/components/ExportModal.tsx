"use client";

import { useState } from "react";
import { X, Check, Globe, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSoftwareExport, generateCSV } from "@/lib/export";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankData: any;
  bookData: any;
  matchedData: any;
  companyName: string;
  tier: string;
}

const COUNTRIES = [
  { id: "CO", name: "Colombia", flag: "🇨🇴", software: ["SIIGO", "HELISA", "oficina_contable"] },
  { id: "MX", name: "México", flag: "🇲🇽", software: ["CONTPAQI", "ASPEL"] },
  { id: "CL", name: "Chile", flag: "🇨🇱", software: ["SOFTLAND", "DEFONTANA"] },
  { id: "US", name: "EE.UU.", flag: "🇺🇸", software: ["QUICKBOOKS", "XERO"] },
  { id: "UNIV", name: "Universal", flag: "🌎", software: ["EXCEL_CSV"] },
];

export function ExportModal({ isOpen, onClose, bankData, bookData, matchedData, companyName, tier }: ExportModalProps) {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCountrySelect = (country: any) => {
    if (country.id === "UNIV") {
      handleFinalExport("UNIVERSAL");
      return;
    }
    setSelectedCountry(country);
    setStep(2);
  };

  const handleFinalExport = (software: string) => {
    setLoading(true);
    setTimeout(() => {
      if (software === "UNIVERSAL" || software === "EXCEL_CSV") {
        generateCSV(bankData, bookData, matchedData, companyName, tier as any);
      } else {
        generateSoftwareExport(software, bankData, bookData, matchedData, companyName);
      }
      setLoading(false);
      onClose();
      // Reset for next time
      setTimeout(() => {
        setStep(1);
        setSelectedCountry(null);
      }, 500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "📦 Elige tu país" : "⚙️ Elige tu Software"}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {step === 1 ? "Para que el archivo sea compatible con tu contabilidad" : `Software disponibles para ${selectedCountry?.name}`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              {COUNTRIES.map((country) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className="group relative p-6 rounded-3xl border-2 border-slate-50 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {country.flag}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900 text-lg">{country.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  {/* Decorative faint icon */}
                  <Globe className="absolute -right-4 -bottom-4 w-16 h-16 text-slate-100/50 group-hover:text-indigo-100 transition-colors -rotate-12" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={() => setStep(1)}
                className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
              >
                ← Volver a países
              </button>
              
              <div className="grid grid-cols-1 gap-3">
                {selectedCountry?.software.map((sw: string) => (
                  <button
                    key={sw}
                    onClick={() => handleFinalExport(sw)}
                    disabled={loading}
                    className="flex justify-between items-center p-5 rounded-2xl border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400">
                        {sw.substring(0, 3)}
                      </div>
                      <span className="font-extrabold text-slate-800 uppercase tracking-tight">{sw.replace(/_/g, " ")}</span>
                    </div>
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all">
                        <Download className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
            Tu archivo se descargará en formato .CSV listo <br /> para ser importado por tu software.
          </p>
        </div>
      </div>
    </div>
  );
}
