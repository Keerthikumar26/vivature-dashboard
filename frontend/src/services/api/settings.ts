import { apiClient } from "./client";
import type { SettingsResponse } from "@/types";

export async function fetchSettings(): Promise<SettingsResponse> {
  const { data } = await apiClient.get<SettingsResponse>("/settings");
  return data;
}
