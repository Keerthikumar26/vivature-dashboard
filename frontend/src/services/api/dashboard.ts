import { apiClient } from "./client";
import type { DashboardResponse } from "@/types";

export async function fetchDashboard(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<DashboardResponse>("/dashboard");
  return data;
}
