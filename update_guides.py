import sys

file_path = r'c:\Users\poste 2\Downloads\منصة المسافر-20260608T105153Z-3-001\منصة المسافر\app\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace heavy backdrop-blur to reduce lag
content = content.replace('backdrop-blur-2xl', 'backdrop-blur-md')
content = content.replace('backdrop-blur-xl', 'backdrop-blur-md')

# Find the start of the Guides tab
start_marker = "{/* ======================================= */}\n          {/* 3. GUIDES & APPS VIEW (الأدلة والتطبيقات) */}"
end_marker = "{/* ======================================= */}\n          {/* 4. EMERGENCY VIEW (الطوارئ والدعم) */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    sys.exit(1)

guides_content = """{/* ======================================= */}
          {/* 3. GUIDES & APPS VIEW (الأدلة والتطبيقات) */}
          {/* ======================================= */}
          {activeTab === 'guides' && (
            <div className="space-y-6 pb-10">
              
              {/* Top Search Hero */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-[32px] p-6 shadow-sm border border-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2"></div>
                
                <h2 className="text-xl font-black text-slate-800 mb-4 relative z-10">عن ماذا تبحث؟</h2>
                <div className="relative w-full max-w-sm z-10">
                  <input 
                    type="text" 
                    placeholder="ابحث عن مدينة، سوق، أو تطبيق..." 
                    className="w-full bg-white border border-slate-200/60 shadow-sm rounded-full py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
                </div>
              </div>

              {/* Category Chips (Glass Style) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {[
                  { id: 'apps', label: 'تطبيقات مهمة' },
                  { id: 'markets', label: 'أسواق الجملة' },
                  { id: 'tourism', label: 'أماكن سياحية' },
                  { id: 'halal', label: 'دليل حلال' }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => {
                      setActiveGuideFilter(flt.id)
                      setSelectedAppForGuide(null)
                    }}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-bold rounded-full transition-all border ${
                      activeGuideFilter === flt.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                        : 'bg-white/60 backdrop-blur-md text-slate-600 border-slate-200/60 hover:bg-white shadow-sm'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Content Grid */}
              <div className="space-y-5">
                {activeGuideFilter === 'apps' && APPS.map(app => (
                  <div key={app.name} className="bg-white rounded-[28px] p-4 flex gap-4 items-center shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-20 h-20 rounded-[22px] flex items-center justify-center text-3xl text-white ${app.bg} shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {app.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-slate-800 text-base">{app.name.split(' ')[0]}</h3>
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{app.badge}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{app.desc}</p>
                      <div className="flex text-amber-400 text-xs mt-2">⭐⭐⭐⭐⭐</div>
                    </div>
                    <button className="hidden sm:block bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800">
                      فتح الدليل
                    </button>
                  </div>
                ))}

                {activeGuideFilter === 'markets' && MARKETS_LIST.map(market => (
                  <div key={market.name} className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-pointer">
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1549221535-9018e6c46a6f?q=80&w=600&auto=format&fit=crop" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Market" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 right-4 flex items-center gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">📍 {market.city}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-slate-800 text-lg mb-1">{market.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{market.suitability}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${market.difficultyColor}`}>
                          مناسب للمبتدئين
                        </span>
                        <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800">
                          فتح الدليل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeGuideFilter === 'tourism' && SIGHTSEEING.map(place => (
                  <div key={place.name} className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-pointer">
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=600&auto=format&fit=crop" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Tourism" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 right-4">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">⏱️ {place.duration}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-slate-800 text-lg mb-1">{place.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{place.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400 text-sm">⭐⭐⭐⭐⭐</div>
                        <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800">
                          فتح الدليل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeGuideFilter === 'halal' && HALAL_RESTAURANTS.map(rest => (
                  <div key={rest.name} className="bg-white rounded-[28px] p-5 flex flex-col shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-black text-slate-800 text-lg">{rest.name}</h3>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full mt-1 inline-block">حلال 100%</span>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl shadow-inner border border-slate-100">🍽️</div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{rest.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-bold text-slate-400">📍 {rest.location}</span>
                      <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800">
                        فتح الدليل
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          """

content = content[:start_idx] + guides_content + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Guides tab updated successfully and backdrop-blur lag reduced!")
