import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

export async function fetchAnalytics(): Promise<ApiResponse> {
  const { data } = await apiClient.get<ApiResponse>("/api/analytics");
  return data;
}

export async function fetchReports(): Promise<ApiResponse> {
  const { data } = await apiClient.get<ApiResponse>("/api/reports");
  return data;
}
