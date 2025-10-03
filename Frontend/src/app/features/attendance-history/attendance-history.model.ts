export interface AttendanceDetail {
  id: number;
  session_id: number;
  student_id: number;
  status: 'present' | 'late' | null;
  confirmed: boolean;
  timestamp: string | null;
  student?: {
    id: number;
    name: string;
    username: string;
    email?: string;
  };
}

export interface SessionWithAttendances {
  id: number;
  course_id: number;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  qr_code: string;
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
  attendances?: AttendanceDetail[];
}

export interface AttendanceHistoryFilter {
  course_id?: number;
  date_from?: string;
  date_to?: string;
  session_id?: number;
}
