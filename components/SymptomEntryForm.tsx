/**
 * Symptom Entry Form Component
 * 
 * Allows users to log daily symptoms including:
 * - Pain level and location
 * - Menstrual flow
 * - Mood and energy
 * - Activities affected
 * - Medications taken
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Calendar } from 'lucide-react';
import { addSymptomLog, updateSymptomLog, getSymptomLogForDate, type SymptomLog } from '../services/symptomTracker';
import { getAnonymousId } from '../services/db';

interface SymptomEntryFormProps {
  selectedDate?: string;
  onClose: () => void;
  onSave: () => void;
}

export const SymptomEntryForm: React.FC<SymptomEntryFormProps> = ({
  selectedDate,
  onClose,
  onSave
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(selectedDate || today);
  const [existingLogId, setExistingLogId] = useState<string | undefined>();
  
  // Form state
  const [painLevel, setPainLevel] = useState<number>(0);
  const [painLocation, setPainLocation] = useState<string[]>([]);
  const [flowLevel, setFlowLevel] = useState<string>('none');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [activitiesAffected, setActivitiesAffected] = useState<string[]>([]);
  const [medications, setMedications] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);

  // Load existing log if editing
  useEffect(() => {
    const loadExistingLog = async () => {
      const anonymousId = getAnonymousId();
      const existing = await getSymptomLogForDate(anonymousId, date);
      
      if (existing) {
        setExistingLogId(existing.id);
        setPainLevel(existing.pain_level || 0);
        setPainLocation(existing.pain_location || []);
        setFlowLevel(existing.flow_level || 'none');
        setSymptoms(existing.symptoms || []);
        setMood(existing.mood || []);
        setEnergyLevel(existing.energy_level || 3);
        setSleepQuality(existing.sleep_quality || 3);
        setActivitiesAffected(existing.activities_affected || []);
        setMedications(existing.medications_taken?.join(', ') || '');
        setNotes(existing.notes || '');
      }
    };
    
    loadExistingLog();
  }, [date]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const logData: SymptomLog = {
      log_date: date,
      pain_level: painLevel,
      pain_location: painLocation,
      flow_level: flowLevel as any,
      symptoms,
      mood,
      energy_level: energyLevel,
      sleep_quality: sleepQuality,
      activities_affected: activitiesAffected,
      medications_taken: medications ? medications.split(',').map(m => m.trim()) : [],
      notes
    };

    try {
      if (existingLogId) {
        // Update existing
        await updateSymptomLog(existingLogId, logData);
      } else {
        // Create new
        const anonymousId = getAnonymousId();
        await addSymptomLog(logData, anonymousId);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving symptom log:', error);
      alert('Failed to save symptom log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-purple/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-serif font-black text-brand-purple">Log Symptoms</h2>
            <p className="text-xs text-brand-purple/50 font-bold uppercase tracking-wider mt-1">Daily Health Journal</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-grey/30 rounded-full transition-colors"
          >
            <X size={24} className="text-brand-purple" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-brand-pink" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="w-full px-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-bold text-brand-purple"
            />
          </div>

          {/* Pain Level */}
          <div className="space-y-3">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Pain Level: {painLevel}/10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value))}
              className="w-full h-3 bg-brand-grey/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #D0B9E2 0%, #D0B9E2 ${painLevel * 10}%, #f3f4f6 ${painLevel * 10}%, #f3f4f6 100%)`
              }}
            />
            <div className="flex justify-between text-[10px] font-bold text-brand-purple/40">
              <span>No Pain</span>
              <span>Worst Pain</span>
            </div>
          </div>

          {/* Pain Location */}
          {painLevel > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
                Pain Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Lower abdomen', 'Lower back', 'Pelvis', 'Thighs', 'Head', 'Breasts'].map(location => (
                  <button
                    key={location}
                    onClick={() => toggleArrayItem(painLocation, location, setPainLocation)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      painLocation.includes(location)
                        ? 'bg-brand-purple text-white'
                        : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flow Level */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Menstrual Flow
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'none', label: 'None' },
                { value: 'spotting', label: 'Spotting' },
                { value: 'light', label: 'Light' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'heavy', label: 'Heavy' },
                { value: 'very_heavy', label: 'Very Heavy' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFlowLevel(value)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    flowLevel === value
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Symptoms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Cramping', 'Bloating', 'Headache', 'Nausea', 'Fatigue', 'Breast tenderness', 'Acne', 'Diarrhea', 'Constipation', 'Dizziness'].map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleArrayItem(symptoms, symptom, setSymptoms)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    symptoms.includes(symptom)
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Mood
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Happy', 'Sad', 'Anxious', 'Irritable', 'Calm', 'Angry'].map(m => (
                <button
                  key={m}
                  onClick={() => toggleArrayItem(mood, m, setMood)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    mood.includes(m)
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Energy Level
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setEnergyLevel(level)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    energyLevel === level
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-brand-purple/40">
              <span>Exhausted</span>
              <span>Energetic</span>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-3">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Sleep Quality
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setSleepQuality(level)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    sleepQuality === level
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-brand-purple/40">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Activities Affected */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Activities Affected
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Work', 'School', 'Exercise', 'Social', 'Sleep', 'None'].map(activity => (
                <button
                  key={activity}
                  onClick={() => toggleArrayItem(activitiesAffected, activity, setActivitiesAffected)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activitiesAffected.includes(activity)
                      ? 'bg-brand-purple text-white'
                      : 'bg-brand-grey/20 text-brand-purple hover:bg-brand-pink/20'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Medications Taken
            </label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g., Ibuprofen 600mg, Heating pad"
              className="w-full px-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-medium text-brand-purple placeholder:text-brand-purple/30"
            />
            <p className="text-[10px] text-brand-purple/40 font-medium">Separate multiple items with commas</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-widest">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-medium text-brand-purple placeholder:text-brand-purple/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-brand-purple/10 px-6 py-4 flex gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-brand-grey/20 text-brand-purple font-black text-sm uppercase tracking-wider rounded-xl hover:bg-brand-grey/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-brand-purple text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Check size={18} />
                Save Entry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomEntryForm;
