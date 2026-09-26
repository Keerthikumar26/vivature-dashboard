import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

export async function fetchAnalytics(): Promise<ApiResponse> {
  const { data } = await apiClient.get<ApiResponse>("/analytics");
  return data;
}

export async function fetchReports(): Promise<ApiResponse> {
  const { data } = await apiClient.get<ApiResponse>("/reports");
  return data;
}
