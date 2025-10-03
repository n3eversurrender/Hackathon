export interface CourseSchedule {
  id: number;
  course_id: number;
  day_of_week: number; // 0 = Minggu, 1 = Senin, dst
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseScheduleDto {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpdateCourseScheduleDto {
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
}

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
