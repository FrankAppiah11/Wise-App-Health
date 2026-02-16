/**
 * Symptom Tracker Database Service
 * 
 * Handles all database operations for symptom tracking and cycle tracking
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// TYPES
// ============================================================================

export interface SymptomLog {
  id?: string;
  user_id?: string;
  profile_id?: string;
  anonymous_id?: string;
  log_date: string; // YYYY-MM-DD
  log_time?: string;
  
  // Pain tracking
  pain_level?: number; // 0-10
  pain_location?: string[];
  pain_character?: string[];
  
  // Menstrual flow
  flow_level?: 'none' | 'spotting' | 'light' | 'moderate' | 'heavy' | 'very_heavy';
  flow_color?: string;
  clot_size?: 'none' | 'small' | 'quarter' | 'golf ball' | 'larger';
  pad_changes_count?: number;
  
  // Symptoms
  symptoms?: string[];
  
  // Mood and energy
  mood?: string[];
  energy_level?: number; // 1-5
  sleep_quality?: number; // 1-5
  sleep_hours?: number;
  
  // Activity impact
  activities_affected?: string[];
  missed_work_school?: boolean;
  
  // Medications
  medications_taken?: string[];
  
  // Notes
  notes?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface CycleTracking {
  id?: string;
  user_id?: string;
  profile_id?: string;
  anonymous_id?: string;
  
  period_start_date: string;
  period_end_date?: string;
  cycle_length_days?: number;
  
  flow_pattern?: string;
  pain_peak_day?: number;
  
  ovulation_date?: string;
  
  notes?: string;
  cycle_number?: number;
  
  created_at?: string;
  updated_at?: string;
}

export interface SymptomTrend {
  symptom: string;
  occurrence_count: number;
  avg_pain_level: number;
}

// ============================================================================
// SYMPTOM LOG FUNCTIONS
// ============================================================================

/**
 * Add a new symptom log entry
 */
export async function addSymptomLog(
  log: SymptomLog,
  anonymousId: string
): Promise<{ success: boolean; data?: SymptomLog; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('symptom_logs')
      .insert({
        anonymous_id: anonymousId,
        log_date: log.log_date,
        log_time: log.log_time || new Date().toTimeString().split(' ')[0],
        pain_level: log.pain_level,
        pain_location: log.pain_location || [],
        pain_character: log.pain_character || [],
        flow_level: log.flow_level,
        flow_color: log.flow_color,
        clot_size: log.clot_size,
        pad_changes_count: log.pad_changes_count,
        symptoms: log.symptoms || [],
        mood: log.mood || [],
        energy_level: log.energy_level,
        sleep_quality: log.sleep_quality,
        sleep_hours: log.sleep_hours,
        activities_affected: log.activities_affected || [],
        missed_work_school: log.missed_work_school || false,
        medications_taken: log.medications_taken || [],
        notes: log.notes
      })
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data: data as SymptomLog };
  } catch (error) {
    console.error('Error adding symptom log:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get symptom logs for a date range
 */
export async function getSymptomLogs(
  anonymousId: string,
  startDate?: string,
  endDate?: string
): Promise<SymptomLog[]> {
  try {
    let query = supabase
      .from('symptom_logs')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .order('log_date', { ascending: false });

    if (startDate) {
      query = query.gte('log_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('log_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return (data || []) as SymptomLog[];
  } catch (error) {
    console.error('Error fetching symptom logs:', error);
    return [];
  }
}

/**
 * Get symptom log for a specific date
 */
export async function getSymptomLogForDate(
  anonymousId: string,
  date: string
): Promise<SymptomLog | null> {
  try {
    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .eq('log_date', date)
      .maybeSingle();

    if (error) throw error;
    
    return data as SymptomLog | null;
  } catch (error) {
    console.error('Error fetching symptom log:', error);
    return null;
  }
}

/**
 * Update an existing symptom log
 */
export async function updateSymptomLog(
  logId: string,
  updates: Partial<SymptomLog>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('symptom_logs')
      .update(updates)
      .eq('id', logId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating symptom log:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a symptom log
 */
export async function deleteSymptomLog(
  logId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('symptom_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting symptom log:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get symptom trends (most common symptoms and average pain)
 */
export async function getSymptomTrends(
  anonymousId: string,
  daysBack: number = 30
): Promise<SymptomTrend[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get all logs in the time period
    const logs = await getSymptomLogs(anonymousId, startDateStr);
    
    // Count symptom occurrences and calculate average pain
    const symptomMap = new Map<string, { count: number; totalPain: number; painCount: number }>();
    
    logs.forEach(log => {
      if (log.symptoms && Array.isArray(log.symptoms)) {
        log.symptoms.forEach(symptom => {
          const existing = symptomMap.get(symptom) || { count: 0, totalPain: 0, painCount: 0 };
          existing.count++;
          
          if (log.pain_level !== undefined && log.pain_level > 0) {
            existing.totalPain += log.pain_level;
            existing.painCount++;
          }
          
          symptomMap.set(symptom, existing);
        });
      }
    });
    
    // Convert to array and calculate averages
    const trends: SymptomTrend[] = Array.from(symptomMap.entries()).map(([symptom, data]) => ({
      symptom,
      occurrence_count: data.count,
      avg_pain_level: data.painCount > 0 ? Math.round((data.totalPain / data.painCount) * 10) / 10 : 0
    }));
    
    // Sort by occurrence count (most common first)
    return trends.sort((a, b) => b.occurrence_count - a.occurrence_count);
  } catch (error) {
    console.error('Error getting symptom trends:', error);
    return [];
  }
}

// ============================================================================
// CYCLE TRACKING FUNCTIONS
// ============================================================================

/**
 * Start a new cycle
 */
export async function startNewCycle(
  anonymousId: string,
  periodStartDate: string
): Promise<{ success: boolean; data?: CycleTracking; error?: string }> {
  try {
    // Get the last cycle to calculate cycle number
    const { data: lastCycle } = await supabase
      .from('cycle_tracking')
      .select('cycle_number, period_start_date')
      .eq('anonymous_id', anonymousId)
      .order('period_start_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const cycleNumber = lastCycle ? (lastCycle.cycle_number || 0) + 1 : 1;
    
    // Calculate cycle length if there was a previous cycle
    let cycleLength: number | undefined;
    if (lastCycle?.period_start_date) {
      const lastStart = new Date(lastCycle.period_start_date);
      const currentStart = new Date(periodStartDate);
      const diffTime = Math.abs(currentStart.getTime() - lastStart.getTime());
      cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Update the previous cycle with the cycle length
      if (lastCycle) {
        await supabase
          .from('cycle_tracking')
          .update({ cycle_length_days: cycleLength })
          .eq('anonymous_id', anonymousId)
          .eq('period_start_date', lastCycle.period_start_date);
      }
    }

    const { data, error } = await supabase
      .from('cycle_tracking')
      .insert({
        anonymous_id: anonymousId,
        period_start_date: periodStartDate,
        cycle_number: cycleNumber
      })
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data: data as CycleTracking };
  } catch (error) {
    console.error('Error starting new cycle:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * End current cycle (mark period end date)
 */
export async function endCurrentCycle(
  anonymousId: string,
  periodEndDate: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the most recent cycle without an end date
    const { data: currentCycle } = await supabase
      .from('cycle_tracking')
      .select('id')
      .eq('anonymous_id', anonymousId)
      .is('period_end_date', null)
      .order('period_start_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!currentCycle) {
      return { success: false, error: 'No active cycle found' };
    }

    const { error } = await supabase
      .from('cycle_tracking')
      .update({ period_end_date: periodEndDate })
      .eq('id', currentCycle.id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error ending cycle:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get cycle history
 */
export async function getCycleHistory(
  anonymousId: string,
  limit: number = 12
): Promise<CycleTracking[]> {
  try {
    const { data, error } = await supabase
      .from('cycle_tracking')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .order('period_start_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []) as CycleTracking[];
  } catch (error) {
    console.error('Error fetching cycle history:', error);
    return [];
  }
}

/**
 * Calculate average cycle length
 */
export async function getAverageCycleLength(
  anonymousId: string
): Promise<number> {
  try {
    const cycles = await getCycleHistory(anonymousId, 6); // Last 6 cycles
    
    const validCycles = cycles.filter(c => 
      c.cycle_length_days && 
      c.cycle_length_days >= 21 && 
      c.cycle_length_days <= 45
    );
    
    if (validCycles.length === 0) return 28; // Default
    
    const total = validCycles.reduce((sum, c) => sum + (c.cycle_length_days || 0), 0);
    return Math.round(total / validCycles.length);
  } catch (error) {
    console.error('Error calculating average cycle length:', error);
    return 28;
  }
}

/**
 * Predict next period
 */
export async function predictNextPeriod(
  anonymousId: string
): Promise<{ date: string; daysUntil: number } | null> {
  try {
    const cycles = await getCycleHistory(anonymousId, 1);
    
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[0];
    const avgLength = await getAverageCycleLength(anonymousId);
    
    const lastStart = new Date(lastCycle.period_start_date);
    const nextStart = new Date(lastStart);
    nextStart.setDate(nextStart.getDate() + avgLength);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextStart.setHours(0, 0, 0, 0);
    
    const diffTime = nextStart.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      date: nextStart.toISOString().split('T')[0],
      daysUntil
    };
  } catch (error) {
    console.error('Error predicting next period:', error);
    return null;
  }
}

/**
 * Get current cycle day
 */
export async function getCurrentCycleDay(
  anonymousId: string
): Promise<number | null> {
  try {
    const cycles = await getCycleHistory(anonymousId, 1);
    
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[0];
    const startDate = new Date(lastCycle.period_start_date);
    const today = new Date();
    
    const diffTime = today.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return daysSinceStart;
  } catch (error) {
    console.error('Error getting current cycle day:', error);
    return null;
  }
}

export default {
  // Symptom logs
  addSymptomLog,
  getSymptomLogs,
  getSymptomLogForDate,
  updateSymptomLog,
  deleteSymptomLog,
  getSymptomTrends,
  
  // Cycle tracking
  startNewCycle,
  endCurrentCycle,
  getCycleHistory,
  getAverageCycleLength,
  predictNextPeriod,
  getCurrentCycleDay
};
