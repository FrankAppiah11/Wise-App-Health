import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Calendar, Activity, Zap, ChevronRight, Sparkles } from 'lucide-react';

export const Tracker: React.FC = () => {
  // Brand matched data
  const data = [
    { day: 'Mon', pain: 2 },
    { day: 'Tue', pain: 4 },
    { day: 'Wed', pain: 7 },
    { day: 'Thu', pain: 5 },
    { day: 'Fri', pain: 3 },
    { day: 'Sat', pain: 1 },
    { day: 'Sun', pain: 2 },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 bg-white">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
            <h2 className="text-3xl font-serif font-black text-brand-purple">Your Journal</h2>
            <p className="text-brand-pink text-[10px] font-black uppercase tracking-widest">Tracking Reproductive Wellness</p>
        </div>
        <button className="bg-brand-pink text-brand-black p-4 rounded-3xl shadow-xl shadow-brand-pink/20 hover:scale-110 transition-transform active:scale-95 hover:bg-brand-purple hover:text-white">
            <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="bg-brand-grey/30 backdrop-blur-sm p-6 rounded-[2.5rem] border border-brand-purple/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-brand-pink" /> Pain Intensity Trend
            </h3>
            <span className="text-[9px] font-black text-brand-purple/30 uppercase tracking-tighter">Last 7 Days</span>
        </div>
        <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis 
                        dataKey="day" 
                        tickLine={false} 
                        axisLine={false} 
                        fontSize={10} 
                        fontWeight={900} 
                        stroke="#6B54A7" 
                        opacity={0.4}
                    />
                    <Tooltip 
                        cursor={{fill: '#6B54A7', opacity: 0.05, radius: 10}} 
                        contentStyle={{
                            borderRadius: '20px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#FFFFFF',
                            fontFamily: 'Poppins',
                            fontSize: '12px',
                            fontWeight: '900',
                            color: '#6B54A7'
                        }} 
                    />
                    <Bar dataKey="pain" radius={[8, 8, 8, 8]} barSize={24}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.pain > 5 ? '#6B54A7' : '#D0B9E2'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest ml-1">Recent History</h3>
        <div className="space-y-4">
            {[
                { date: 'OCT 14', event: 'Heavy Flow', details: 'Pain: 7/10 • Fatigue: High' },
                { date: 'OCT 12', event: 'Cycle Start', details: 'Pain: 4/10 • Mood: Stable' },
                { date: 'OCT 10', event: 'Spotted', details: 'Low intensity • Routine' }
            ].map((log, i) => (
                <div key={i} className="flex gap-5 bg-white shadow-sm p-5 rounded-[2rem] border border-brand-purple/5 items-center group hover:bg-brand-pink/5 transition-all">
                    <div className="bg-brand-purple text-white font-black text-[9px] p-3 rounded-2xl text-center min-w-[3.5rem] shadow-sm group-hover:bg-brand-pink group-hover:text-brand-black transition-colors">
                        {log.date.split(' ')[0]}<br/>
                        <span className="text-lg leading-none">{log.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1">
                        <div className="font-serif font-black text-lg text-brand-purple leading-tight">{log.event}</div>
                        <div className="text-[11px] text-brand-purple/50 font-bold uppercase tracking-tighter mt-1">{log.details}</div>
                    </div>
                    <ChevronRight size={20} className="text-brand-purple/20 group-hover:text-brand-pink transition-colors" />
                </div>
            ))}
        </div>
      </div>
      
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-purple/5 to-white border border-brand-purple/10 backdrop-blur-md shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles size={100} color="#6B54A7" />
        </div>
        <div className="relative z-10 space-y-4">
            <h4 className="text-brand-purple font-serif font-black text-2xl leading-tight">Unlock Advanced <br/>Insights</h4>
            <p className="text-brand-purple/70 text-xs font-medium leading-relaxed max-w-[80%]">Get detailed pattern analysis and clinician-ready PDF exports with WISE Membership.</p>
            <button className="px-6 py-3 bg-brand-purple text-white font-sans font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all hover:bg-brand-pink hover:text-brand-black">
                Upgrade Now
            </button>
        </div>
      </div>
    </div>
  );
};