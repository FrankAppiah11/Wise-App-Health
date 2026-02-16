
import React, { useState } from 'react';
import { Tagline } from '../App';
import { 
  ShieldCheck, 
  Star, 
  Trash2, 
  ArrowLeft, 
  User,
  Activity,
  ChevronRight,
  Database
} from 'lucide-react';

interface AdminEntry {
  id: string;
  type: 'FEEDBACK' | 'MESSAGE';
  rating: number;
  message: string;
  timestamp: string;
}

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [logs, setLogs] = useState<AdminEntry[]>([
    { id: '1', type: 'FEEDBACK', rating: 5, message: 'Really helps tracking my PCOS symptoms!', timestamp: '2023-11-01 14:30' },
    { id: '2', type: 'MESSAGE', rating: 0, message: 'When will Dr. Appiah be available for chat?', timestamp: '2023-11-01 10:15' },
    { id: '3', type: 'FEEDBACK', rating: 4, message: 'Love the new roadmap feature. Very informative.', timestamp: '2023-11-01 09:45' }
  ]);

  const deleteEntry = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-brand-purple">
      <div className="px-8 py-10 space-y-8 bg-white/5 border-b border-white/10">
        <button 
          onClick={onBack} 
          className="p-3 bg-white/10 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="space-y-4">
            <h2 className="text-4xl font-serif font-black text-white leading-none">Admin <br/>Terminal</h2>
            <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300">
                    <ShieldCheck size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Clinical Access Verified</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60">
                    <Database size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">v2.5.0 STABLE</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Recent Activity Logs</h3>
          <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black text-white/60">{logs.length} Total</div>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
              <div key={log.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-6 space-y-4 animate-in slide-in-from-bottom-4 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      log.type === 'MESSAGE' ? 'bg-brand-sky/20 text-white' : 'bg-brand-gold/20 text-brand-gold'
                    }`}>
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        log.type === 'MESSAGE' ? 'text-white/60' : 'text-brand-gold'
                      }`}>{log.type}</span>
                      <h4 className="text-xs font-black text-white mt-0.5">{log.timestamp}</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteEntry(log.id)} 
                    className="p-3 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {log.rating > 0 && (
                  <div className="flex gap-1 px-1">
                    {[1,2,3,4,5].map(s => (
                      <Star 
                        key={s} 
                        size={14} 
                        className={s <= log.rating ? "text-brand-gold" : "text-white/10"} 
                        fill={s <= log.rating ? "currentColor" : "none"} 
                        strokeWidth={3}
                      />
                    ))}
                  </div>
                )}
                <div className="bg-brand-purple/50 p-5 rounded-[1.5rem] border border-white/10 text-sm font-bold text-white/80 leading-relaxed shadow-inner italic">
                  "{log.message}"
                </div>
                <div className="flex justify-end pt-2">
                  <button className="text-[10px] font-black text-brand-pink uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Details <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
          ))}
        </div>
        
        {logs.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
              <Activity size={32} />
            </div>
            <p className="text-sm font-black text-white/20 uppercase tracking-widest">No activity found</p>
          </div>
        )}
      </div>
      
      <div className="py-8 bg-white/5 border-t border-white/5">
        <Tagline />
      </div>
    </div>
  );
};
