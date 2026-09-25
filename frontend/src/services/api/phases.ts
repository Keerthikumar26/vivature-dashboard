import { apiClient } from "./client";
import type { PhaseResponse } from "@/types";

export async function fetchPhase1(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase1");
  return data;
}

export async function fetchPhase2(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase2");
  return data;
}

export async function fetchPhase3(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase3");
  return data;
}

export async function fetchPhase4(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase4");
  return data;
}

export async function fetchPhase5(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase5");
  return data;
}

export async function fetchPhase6(): Promise<PhaseResponse> {
  const { data } = await apiClient.get<PhaseResponse>("/api/phase6");
  return data;
}


