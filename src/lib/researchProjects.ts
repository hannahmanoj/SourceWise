import type { SupabaseClient } from "@supabase/supabase-js";
import type { AcademicLevel, ResearchResult } from "@/types/research";

export type SavedResearchProject = {
  id: string;
  topic: string;
  academicLevel: AcademicLevel;
  result: ResearchResult;
  createdAt: string;
  updatedAt: string;
};

type ResearchProjectRow = {
  id: string;
  topic: string;
  academic_level: AcademicLevel;
  result_json: ResearchResult;
  created_at: string;
  updated_at: string;
};

export async function saveResearchProject({
  academicLevel,
  result,
  supabase,
  userId,
}: {
  academicLevel: AcademicLevel;
  result: ResearchResult;
  supabase: SupabaseClient;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("research_projects")
    .insert({
      academic_level: academicLevel,
      result_json: result,
      topic: result.topic,
      user_id: userId,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

export async function listResearchProjects(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("research_projects")
    .select("id, topic, academic_level, result_json, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ResearchProjectRow[]).map(mapResearchProjectRow);
}

export async function getResearchProject({
  id,
  supabase,
}: {
  id: string;
  supabase: SupabaseClient;
}) {
  const { data, error } = await supabase
    .from("research_projects")
    .select("id, topic, academic_level, result_json, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return mapResearchProjectRow(data as ResearchProjectRow);
}

function mapResearchProjectRow(row: ResearchProjectRow): SavedResearchProject {
  return {
    academicLevel: row.academic_level,
    createdAt: row.created_at,
    id: row.id,
    result: row.result_json,
    topic: row.topic,
    updatedAt: row.updated_at,
  };
}
