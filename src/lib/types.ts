export type ScheduleStatus = "scheduled" | "live" | "completed" | "cancelled";

export interface Streamer {
  id: number;
  name: string;
  phone: string | null;
  platform: string;
  is_active: number;
  created_at: string;
}

export interface Schedule {
  id: number;
  streamer_id: number;
  title: string;
  platform: string;
  start_at: string;
  end_at: string;
  status: ScheduleStatus;
  notes: string | null;
  created_at: string;
}

export interface Sale {
  id: number;
  schedule_id: number;
  streamer_id: number;
  amount: number;
  order_count: number;
  notes: string | null;
  submitted_at: string;
}

export interface ScheduleWithStreamer extends Schedule {
  streamer_name: string;
}

export interface SaleWithDetails extends Sale {
  schedule_title: string;
  streamer_name: string;
  start_at: string;
}

export const PLATFORMS = [
  "Shopee Live",
  "TikTok Live",
  "Tokopedia Live",
  "Lazada Live",
  "Instagram Live",
] as const;
