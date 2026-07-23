import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquareShare, Send, Sparkles, Check } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
      setTimeout(() => setSubmitted(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 uppercase tracking-widest">
          <MessageSquareShare className="w-4 h-4" /> Guest Concierge & Reservations
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white">Contact & Event Booking</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Planning an event, reserving a VIP dining table, or having general inquiries? Connect with our team.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info panel */}
        <div className="lg:col-span-5 rounded-3xl border border-gray-800 bg-gray-900/80 p-6 sm:p-8 space-y-6 text-xs text-gray-300 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white border-b border-gray-800 pb-3">Bistro HQ & Concierge</h3>
          
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Restaurant Address</strong>
                <span>452 Culinary Blvd, New York, NY 10018</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Direct Reservations Desk</strong>
                <span className="font-mono text-amber-400 font-bold">+1 (800) 555-0199</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Guest Inquiries Email</strong>
                <span className="font-mono text-amber-300">concierge@gourmethaven.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-gray-800 pt-4">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Dining & Delivery Hours</strong>
                <p>Monday - Friday: 11:30 AM - 10:30 PM</p>
                <p>Saturday - Sunday: 11:00 AM - 11:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry form */}
        <div className="lg:col-span-7 rounded-3xl border border-gray-800 bg-gray-900/80 p-6 sm:p-8 space-y-4 text-xs shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-white border-b border-gray-800 pb-3">Send Guest Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitted && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4" /> Message received! Our concierge desk will respond shortly.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-gray-950 border border-gray-800 px-4 py-2.5 outline-none focus:border-amber-500 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-xl bg-gray-950 border border-gray-800 px-4 py-2.5 outline-none focus:border-amber-500 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Table Reservation / Party Booking"
                required
                className="w-full rounded-xl bg-gray-950 border border-gray-800 px-4 py-2.5 outline-none focus:border-amber-500 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please describe your reservation date, party size, or general inquiry..."
                className="w-full rounded-xl bg-gray-950 border border-gray-800 px-4 py-2.5 outline-none focus:border-amber-500 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Transmitting...' : 'Submit Guest Message'} <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
