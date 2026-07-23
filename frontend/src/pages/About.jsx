import React from 'react';
import { ChefHat, History, Star, Sparkles, Award, Utensils, ShieldCheck } from 'lucide-react';

const About = () => {
  const chefs = [
    {
      name: 'Chef Marcus Sterling',
      role: 'Executive Culinary Director',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=600&q=80',
      bio: 'Trained in Paris & Tokyo with 20+ years in Michelin kitchens, Chef Marcus specializes in blending authentic royal Indian dum biryanis, Chettinad curries, and modern gastronomy.'
    },
    {
      name: 'Elena Rostova',
      role: 'Master Pastry & Confectionery Specialist',
      image: 'https://images.unsplash.com/photo-1595273670150-db0c3c6665e9?auto=format&fit=crop&w=600&q=80',
      bio: 'Elena crafts dessert art ranging from saffron Pistachio Kulfi and Kesari Rasmalai to Belgian chocolate lava cakes, delivering a sweet conclusion to every feast.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Title */}
      <div className="relative rounded-3xl bg-gray-900/80 border border-gray-800 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-extrabold text-amber-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Our Culinary Heritage
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Crafting Moments of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
            Pure Gastronomic Art
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed font-light">
          Founded in 2018, Gourmet Haven was created to celebrate authentic Indian and international culinary artistry. We believe dining is about deep connection, rich aromas, and memorable moments.
        </p>
      </div>

      {/* Timeline Story */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="font-serif text-2xl font-bold text-center text-amber-400">Our Culinary Chronicles</h2>
        
        <div className="relative border-l border-gray-800 ml-4 sm:ml-32 space-y-8">
          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold">
              <History className="h-2.5 w-2.5" />
            </span>
            <div className="sm:absolute sm:-left-32 sm:top-1 sm:w-24 text-xs font-mono font-bold text-amber-400 sm:text-right">
              2018
            </div>
            <h4 className="font-serif font-bold text-base text-white">The Royal Dum & Dosa Kitchen</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              We started as an intimate 6-table concept kitchen focusing on hand-ground spices, clay tandoors, crisp ghee-roast dosas, and slow-dum biryanis.
            </p>
          </div>

          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold">
              <Star className="h-2.5 w-2.5" />
            </span>
            <div className="sm:absolute sm:-left-32 sm:top-1 sm:w-24 text-xs font-mono font-bold text-amber-400 sm:text-right">
              2021
            </div>
            <h4 className="font-serif font-bold text-base text-white">Critical Acclaim & Expansion</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              Gourmet Haven received top review ratings for its Chettinad Chicken, Butter Chicken, Truffle Pizzas, and South Indian specialties.
            </p>
          </div>

          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold">
              <ChefHat className="h-2.5 w-2.5" />
            </span>
            <div className="sm:absolute sm:-left-32 sm:top-1 sm:w-24 text-xs font-mono font-bold text-amber-400 sm:text-right">
              Today
            </div>
            <h4 className="font-serif font-bold text-base text-white">Digital Order & Live Tracking Network</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              We now bring our artisanal kitchen directly to your home with real-time GPS order tracking and instant online ordering.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Chefs */}
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="font-serif text-2xl font-bold text-center text-amber-400">The Kitchen Masters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {chefs.map((chef, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-gray-800 bg-gray-900/60 p-6 flex flex-col sm:flex-row gap-5 items-center hover:border-amber-500/40 transition-colors shadow-xl"
            >
              <div className="h-32 w-32 shrink-0 rounded-full overflow-hidden border-2 border-amber-500/40 bg-gray-950 shadow-md">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-white">{chef.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">{chef.role}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{chef.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
