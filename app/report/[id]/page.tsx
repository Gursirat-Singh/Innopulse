import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Startup from '@/server/models/startup';
import User from '@/server/models/User'; // Prevent tree-shaking
import Logo from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Banknote, Globe, Mail, Phone, CalendarRange } from 'lucide-react';

const formatIndianCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  // Prevent tree-shaking
  if (!User) {
    console.warn("User model failed to load");
  }

  const startup = await Startup.findById(id).lean();

  if (!startup) {
    notFound();
  }

  const reportDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            background-color: white !important; 
          }
          @page { 
            margin: 0; 
            size: A4;
          }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <main className="max-w-4xl mx-auto px-8 py-12 relative">
        
        {/* Header Region */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-8 mb-10">
          <div className="flex items-center gap-4">
            <Logo size="lg" showText={false} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">InnoPulse</h1>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Intelligence Platform</span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
              Startup Analytics Report
            </div>
          </div>
        </header>

        {/* Startup Title Area */}
        <div className="mb-12">
          <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">{startup.name}</h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
              Sector: {startup.sector}
            </span>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
              Stage: {startup.stage}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Banknote className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold uppercase tracking-widest">Total Funding</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{formatIndianCurrency(startup.funding)}</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest">Team Size</span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {startup.employees ? `${startup.employees.toLocaleString()} Employees` : 'N/A'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-widest">Headquarters</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{startup.city}</p>
          </div>
        </section>

        {/* Business Overview */}
        <section className="mb-10">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-6">Business Overview</h3>
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue Range</p>
              <p className="font-semibold text-slate-900">{startup.revenueRange || 'Undisclosed'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${startup.status === 'approved' ? 'bg-green-500' : startup.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                <span className="font-semibold capitalize text-slate-900">{startup.status}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-20">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-6">Contact Information</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
              <Globe className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Website</p>
                <p className="font-semibold text-slate-900">{startup.website || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Email Address</p>
                <p className="font-semibold text-slate-900">{startup.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
              <Phone className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Phone Number</p>
                <p className="font-semibold text-slate-900">{startup.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} className="text-slate-400 grayscale" />
            Generated by InnoPulse
          </div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            {reportDate}
          </div>
        </footer>

      </main>
    </div>
  );
}
