import React from "react";
import { CheckCircle, ArrowRight, Download, Globe, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ConciliacionQuickbooksPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100 animate-pulse">
            🌎 AI-Powered Reconciliation for QuickBooks
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Reconcile <span className="text-emerald-600">QuickBooks</span> in Seconds.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Stop manually matching bank statements. Use ConciliAI to turn raw bank data into QuickBooks-ready imports with 100% precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/dashboard" 
              className="btn btn-primary h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Zero Manual Data Entry</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Upload your bank PDFs and get a perfectly formatted CSV for QuickBooks Online. No more copy-pasting.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI Data Cleaning</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our AI automatically removes noise from bank descriptions and categorizes transactions for faster matching.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">QBO Ready</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We generate the exact columns QuickBooks expects: Date, Description, and Amount. Just hit "Import".
            </p>
          </div>
        </div>
      </section>

      {/* Guide Content (SEO) */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-black text-slate-900">How to automate QuickBooks Reconciliation with AI</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Bank reconciliation is the most time-consuming task for QuickBooks users. 
              While QuickBooks has direct bank feeds, they often fail or lack the detail needed for complex reconciliations.
            </p>
            <h3>Steps to automate with ConciliAI:</h3>
            <ol>
              <li><strong>Upload Bank Statement:</strong> Drop your PDF from Chase, Wells Fargo, or any global bank.</li>
              <li><strong>AI Extraction:</strong> Our LLaMA-powered engine extracts all transactions instantly.</li>
              <li><strong>Cross-Reference:</strong> Compare against your accounting records or export directly.</li>
              <li><strong>Export for QuickBooks:</strong> Choose the 🇺🇸 QuickBooks format and download your optimized CSV.</li>
            </ol>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold">Ready to save 20 hours a month?</h3>
              <p className="text-slate-400">Join forward-thinking accountants using AI to scale their practice.</p>
              <Link href="/dashboard" className="btn bg-white text-slate-900 border-none hover:bg-slate-100 rounded-xl px-8">
                Try it Free Now
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>

      {/* Footer SEO Tags */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50 overflow-hidden">
         <div className="max-w-5xl mx-auto px-6 flex flex-wrap gap-4 justify-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">QuickBooks Online AI</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Bank Reconciliation Automation</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI Bookkeeping</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Chase to QuickBooks</span>
         </div>
      </footer>
    </div>
  );
}
