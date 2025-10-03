export interface DashboardStatistics {
  totalSessions: number;
  totalAttendances: number;
  averageAttendance: number;
  date: string;
}

export interface SessionWithStats {
  id: number;
  course_id: number;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  qr_code: string;
  attendanceCount: number;
  isActive: boolean;
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

export interface RecentAttendance {
  id: number;
  session_id: number;
  student_id: number;
  status: string;
  confirmed: boolean;
  timestamp: string;
  session?: {
    id: number;
    date: string;
    course?: {
      id: number;
      name: string;
      code: string;
    };
  };
  student?: {
    id: number;
    name: string;
    username: string;
  };
}
