export interface Session {
  id: number;
  course_id: number;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  qr_code: string;
  created_at?: string;
  updated_at?: string;
  course?: {
    id: number;
    name: string;
    code: string;
  };
  schedule?: {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  };
}

export interface CreateSessionDto {
  course_id: number;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface UpdateSessionDto {
  course_id?: number;
  schedule_id?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
}

export interface SessionListResponse {
  count: number;
  sessions: Session[];
}
