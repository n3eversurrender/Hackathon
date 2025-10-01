export class CreateSessionDto {
  course_id: number;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  qr_code: string;
}
