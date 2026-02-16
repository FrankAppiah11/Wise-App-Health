/**
 * WISE Symptom Tracker - Complete UI
 * 
 * Features:
 * - Real-time data from Supabase
 * - Pain trend visualization
 * - Symptom logging
 * - Cycle tracking and prediction
 * - Calendar view
 * - Recent history
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Calendar, Activity, Droplet, ChevronRight, Sparkles, TrendingUp, Moon, Zap, Edit2 } from 'lucide-react';
import { 
  getSymptomLogs, 
  getCycleHistory, 
  predictNextPeriod, 
  getCurrentCycleDay,
  getAverageCycleLength,
  type SymptomLog 
} from '../services/symptomTracker';
import { getAnonymousId } from '../services/db';
import SymptomEntryForm from './SymptomEntryForm';

export const Tracker: React.FC = () => {
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [painChartData, setPainChartData] = useState<any[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<{ date: string; daysUntil: number } | null>(null);
  const [avgCycleLength, setAvgCycleLength] = useState<number>(28);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const anonymousId = getAnonymousId();
    
    try {
      // Get last 30 days of symptom logs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      
      const logsData = await getSymptomLogs(anonymousId, startDate);
      setLogs(logsData);
      
      // Prepare chart data (last 7 days)
      const last7Days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayLog = logsData.find(log => log.log_date === dateStr);
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        last7Days.push({
          day: dayNames[date.getDay()],
          date: dateStr,
          pain: dayLog?.pain_level || 0,
          flow: dayLog?.flow_level || 'none'
        });
      }
      setPainChartData(last7Days);
      
      // Get cycle information
      const currentDay = await getCurrentCycleDay(anonymousId);
      setCycleDay(currentDay);
      
      const prediction = await predictNextPeriod(anonymousId);
      setNextPeriod(prediction);
      
      const avgLength = await getAverageCycleLength(anonymousId);
      setAvgCycleLength(avgLength);
      
    } catch (error) {
      console.error('Error loading tracker data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSymptom = (date?: string) => {
    setSelectedDate(date);
    setShowEntryForm(true);
  };

  const handleSaveSymptom = () => {
    loadData(); // Reload data after saving
  };

  const getFlowEmoji = (flowLevel?: string) => {
    switch (flowLevel) {
      case 'very_heavy': return '🔴🔴🔴';
      case 'heavy': return '🔴🔴';
      case 'moderate': return '🔴';
      case 'light': return '🟠';
      case 'spotting': return '🟡';
      default: return '';
    }
  };

  const getFlowLabel = (flowLevel?: string) => {
    switch (flowLevel) {
      case 'very_heavy': return 'Very Heavy';
      case 'heavy': return 'Heavy';
      case 'moderate': return 'Moderate';
      case 'light': return 'Light';
      case 'spotting': return 'Spotting';
      default: return 'None';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 animate-in fade-in duration-500 bg-white flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-brand-pink border-t-brand-purple rounded-full animate-spin mx-auto"></div>
          <p className="text-brand-purple font-bold text-sm uppercase tracking-wider">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 bg-white">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-black text-brand-purple">Your Journal</h2>
          <p className="text-brand-pink text-[10px] font-black uppercase tracking-widest">Tracking Reproductive Wellness</p>
        </div>
        <button 
          onClick={() => handleAddSymptom()}
          className="bg-brand-pink text-brand-black p-4 rounded-3xl shadow-xl shadow-brand-pink/20 hover:scale-110 transition-transform active:scale-95 hover:bg-brand-purple hover:text-white"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Cycle Information Cards */}
      {cycleDay !== null && (
        <div className="grid grid-cols-3 gap-4">
          {/* Current Cycle Day */}
          <div className="bg-gradient-to-br from-brand-purple to-brand-purple/80 p-5 rounded-[2rem] shadow-lg text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="opacity-80" />
              <span className="text-[9px] font-black uppercase tracking-wider opacity-80">Cycle Day</span>
            </div>
            <div className="text-3xl font-black">{cycleDay}</div>
          </div>

          {/* Next Period Prediction */}
          {nextPeriod && (
            <div className="bg-gradient-to-br from-brand-pink to-brand-pink/80 p-5 rounded-[2rem] shadow-lg text-brand-black">
              <div className="flex items-center gap-2 mb-2">
                <Droplet size={16} className="opacity-80" />
                <span className="text-[9px] font-black uppercase tracking-wider opacity-80">Next Period</span>
              </div>
              <div className="text-lg font-black">
                {nextPeriod.daysUntil > 0 ? `${nextPeriod.daysUntil} days` : 'Today'}
              </div>
            </div>
          )}

          {/* Average Cycle */}
          <div className="bg-gradient-to-br from-brand-grey/40 to-brand-grey/20 p-5 rounded-[2rem] shadow-lg text-brand-purple">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="opacity-60" />
              <span className="text-[9px] font-black uppercase tracking-wider opacity-60">Avg Cycle</span>
            </div>
            <div className="text-2xl font-black">{avgCycleLength} days</div>
          </div>
        </div>
      )}

      {/* Pain Trend Chart */}
      <div className="bg-brand-grey/30 backdrop-blur-sm p-6 rounded-[2.5rem] border border-brand-purple/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest flex items-center gap-2">
            <Activity size={16} className="text-brand-pink" /> Pain Intensity Trend
          </h3>
          <span className="text-[9px] font-black text-brand-purple/30 uppercase tracking-tighter">Last 7 Days</span>
        </div>
        
        {painChartData.length > 0 ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={painChartData}>
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={10} 
                  fontWeight={900} 
                  stroke="#6B54A7" 
                  opacity={0.4}
                />
                <YAxis 
                  hide 
                  domain={[0, 10]}
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
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-2xl shadow-lg border border-brand-purple/10">
                          <p className="font-black text-brand-purple text-xs mb-1">{data.day}</p>
                          <p className="font-bold text-brand-purple/70 text-[10px]">Pain: {data.pain}/10</p>
                          {data.flow && data.flow !== 'none' && (
                            <p className="font-bold text-brand-pink text-[10px] mt-1">
                              {getFlowEmoji(data.flow)} {getFlowLabel(data.flow)}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="pain" 
                  radius={[8, 8, 8, 8]} 
                  barSize={24}
                  onClick={(data: any) => handleAddSymptom(data.date)}
                  cursor="pointer"
                >
                  {painChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.pain > 5 ? '#6B54A7' : entry.pain > 0 ? '#D0B9E2' : '#E5E7EB'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Activity size={40} className="text-brand-purple/20 mx-auto" />
              <p className="text-sm font-bold text-brand-purple/40">No data yet</p>
              <p className="text-xs text-brand-purple/30">Start logging to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest ml-1">Recent History</h3>
        
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.slice(0, 10).map((log, i) => (
              <div 
                key={log.id || i} 
                className="flex gap-5 bg-white shadow-sm p-5 rounded-[2rem] border border-brand-purple/5 items-center group hover:bg-brand-pink/5 transition-all cursor-pointer"
                onClick={() => handleAddSymptom(log.log_date)}
              >
                <div className="bg-brand-purple text-white font-black text-[9px] p-3 rounded-2xl text-center min-w-[3.5rem] shadow-sm group-hover:bg-brand-pink group-hover:text-brand-black transition-colors">
                  {formatDate(log.log_date).split(' ')[0]}<br/>
                  <span className="text-lg leading-none">{formatDate(log.log_date).split(' ')[1]}</span>
                </div>
                
                <div className="flex-1">
                  <div className="font-serif font-black text-lg text-brand-purple leading-tight">
                    {log.flow_level && log.flow_level !== 'none' 
                      ? `${getFlowLabel(log.flow_level)} Flow ${getFlowEmoji(log.flow_level)}`
                      : log.symptoms && log.symptoms.length > 0
                        ? log.symptoms[0]
                        : 'Logged Symptoms'
                    }
                  </div>
                  <div className="text-[11px] text-brand-purple/50 font-bold uppercase tracking-tighter mt-1">
                    {log.pain_level !== undefined && log.pain_level > 0 && `Pain: ${log.pain_level}/10`}
                    {log.pain_level !== undefined && log.pain_level > 0 && log.mood && log.mood.length > 0 && ' • '}
                    {log.mood && log.mood.length > 0 && `Mood: ${log.mood[0]}`}
                    {((log.pain_level !== undefined && log.pain_level > 0) || (log.mood && log.mood.length > 0)) && log.energy_level && ' • '}
                    {log.energy_level && `Energy: ${log.energy_level}/5`}
                  </div>
                  {log.symptoms && log.symptoms.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.symptoms.slice(1, 4).map((symptom, idx) => (
                        <span 
                          key={idx}
                          className="text-[9px] font-bold bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-lg"
                        >
                          {symptom}
                        </span>
                      ))}
                      {log.symptoms.length > 4 && (
                        <span className="text-[9px] font-bold text-brand-purple/40 px-2 py-1">
                          +{log.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <Edit2 size={16} className="text-brand-purple/20 group-hover:text-brand-pink transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm p-8 rounded-[2rem] border border-brand-purple/5 text-center space-y-3">
            <Calendar size={48} className="text-brand-purple/20 mx-auto" />
            <p className="text-brand-purple font-bold">No entries yet</p>
            <p className="text-sm text-brand-purple/50">Click the + button to log your first symptom</p>
            <button 
              onClick={() => handleAddSymptom()}
              className="px-6 py-3 bg-brand-pink text-brand-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-brand-purple hover:text-white transition-all mx-auto inline-block"
            >
              Start Logging
            </button>
          </div>
        )}
      </div>

      {/* Insights Section */}
      {logs.length >= 7 && (
        <div className="bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 p-6 rounded-[2.5rem] border border-brand-purple/10 space-y-4">
          <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className="text-brand-pink" /> Your Patterns
          </h3>
          
          <div className="space-y-3">
            {/* Most common symptoms */}
            {(() => {
              const symptomCounts = new Map<string, number>();
              logs.forEach(log => {
                if (log.symptoms) {
                  log.symptoms.forEach(symptom => {
                    symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1);
                  });
                }
              });
              
              const topSymptoms = Array.from(symptomCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
              
              return topSymptoms.length > 0 ? (
                <div className="bg-white/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-brand-purple/60 uppercase tracking-wider mb-2">Most Common Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {topSymptoms.map(([symptom, count]) => (
                      <span 
                        key={symptom}
                        className="bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full text-xs font-bold"
                      >
                        {symptom} ({count}x)
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Average pain level */}
            {(() => {
              const painLogs = logs.filter(log => log.pain_level && log.pain_level > 0);
              if (painLogs.length > 0) {
                const avgPain = Math.round(
                  painLogs.reduce((sum, log) => sum + (log.pain_level || 0), 0) / painLogs.length * 10
                ) / 10;
                
                return (
                  <div className="bg-white/50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-brand-purple/60 uppercase tracking-wider mb-2">Average Pain Level</p>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-black text-brand-purple">{avgPain}/10</div>
                      <div className="flex-1 h-2 bg-brand-grey/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-pink rounded-full transition-all"
                          style={{ width: `${(avgPain / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
      
      {/* Upgrade Section */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-purple/5 to-white border border-brand-purple/10 backdrop-blur-md shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles size={100} color="#6B54A7" />
        </div>
        <div className="relative z-10 space-y-4">
          <h4 className="text-brand-purple font-serif font-black text-2xl leading-tight">Unlock Advanced <br/>Insights</h4>
          <p className="text-brand-purple/70 text-xs font-medium leading-relaxed max-w-[80%]">Get detailed pattern analysis, cycle predictions, and clinician-ready PDF exports with WISE Membership.</p>
          <button className="px-6 py-3 bg-brand-purple text-white font-sans font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all hover:bg-brand-pink hover:text-brand-black">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Symptom Entry Form Modal */}
      {showEntryForm && (
        <SymptomEntryForm
          selectedDate={selectedDate}
          onClose={() => {
            setShowEntryForm(false);
            setSelectedDate(undefined);
          }}
          onSave={handleSaveSymptom}
        />
      )}
    </div>
  );
};

export default Tracker;
