import { supabase } from '../supabaseClient';
import type { UserProfile, AnalysisResult } from '../types';

const ANON_ID_KEY = 'wise_anonymous_id';

export function getAnonymousId(): string {
  let id = typeof localStorage !== 'undefined' ? localStorage.getItem(ANON_ID_KEY) : null;
  if (!id) {
    id = crypto.randomUUID?.() ?? `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      localStorage.setItem(ANON_ID_KEY, id);
    } catch (_) {}
  }
  return id;
}

function profileToRow(p: UserProfile) {
  return {
    name: p.name || null,
    email: p.email || null,
    phone: p.phone || null,
    age: p.age ?? 28,
    user_persona: p.userPersona ?? 'Self',
    is_pregnant: p.isPregnant ?? false,
    is_postpartum: p.isPostpartum ?? false,
    contraception: p.contraception || null,
    known_conditions: p.knownConditions ?? [],
    medications: p.medications ?? [],
    is_upgraded: p.isUpgraded ?? false,
  };
}

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    name: (row.name as string) ?? '',
    email: (row.email as string) ?? '',
    phone: (row.phone as string) ?? '',
    age: (row.age as number) ?? 28,
    userPersona: (row.user_persona as 'Self' | 'Parent') ?? 'Self',
    isPregnant: (row.is_pregnant as boolean) ?? false,
    isPostpartum: (row.is_postpartum as boolean) ?? false,
    contraception: (row.contraception as string) ?? 'Pill',
    knownConditions: Array.isArray(row.known_conditions) ? row.known_conditions as string[] : [],
    medications: Array.isArray(row.medications) ? row.medications as string[] : [],
    isUpgraded: (row.is_upgraded as boolean) ?? false,
  };
}

export async function loadProfile(anonymousId: string): Promise<UserProfile | null> {
  const url = (process.env as any).SUPABASE_URL;
  if (!url) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('anonymous_id', anonymousId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return rowToProfile(data);
}

export async function saveProfile(anonymousId: string, profile: UserProfile): Promise<string | null> {
  const url = (process.env as any).SUPABASE_URL;
  if (!url) return null;
  const row = profileToRow(profile);
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('anonymous_id', anonymousId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing?.id) {
    await supabase.from('profiles').update(row).eq('id', existing.id);
    return existing.id;
  }
  const { data: inserted, error } = await supabase
    .from('profiles')
    .insert({ ...row, anonymous_id: anonymousId })
    .select('id')
    .single();
  if (error || !inserted?.id) return null;
  return inserted.id;
}

export async function saveSurveyAndAnalysis(
  profileId: string | null,
  anonymousId: string,
  answers: Record<string, unknown>,
  selectedDate: string,
  analysis: AnalysisResult
): Promise<void> {
  const url = (process.env as any).SUPABASE_URL;
  if (!url) return;
  const { data: surveyRow, error: surveyErr } = await supabase
    .from('survey_responses')
    .insert({
      profile_id: profileId || null,
      anonymous_id: anonymousId,
      answers,
      selected_date: selectedDate,
    })
    .select('id')
    .single();
  if (surveyErr || !surveyRow?.id) return;
  await supabase.from('analysis_results').insert({
    survey_response_id: surveyRow.id,
    triage_status: analysis.triageStatus,
    ranked_conditions: analysis.rankedConditions,
    red_flag_messages: analysis.redFlagMessages,
    summary: analysis.summary,
    report_date: analysis.reportDate,
  });
}
