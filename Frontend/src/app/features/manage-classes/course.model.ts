export interface Course {
  id: number;
  name: string;
  code: string;
  lecturer_id: number;
  lecturer?: {
    id: number;
    name: string;
    email: string;
    role: number;
    role_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CourseSchedule {
  id: number;
  course_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  course?: Course;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseDto {
  name: string;
  code: string;
}

export interface UpdateCourseDto {
  name?: string;
  code?: string;
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

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

