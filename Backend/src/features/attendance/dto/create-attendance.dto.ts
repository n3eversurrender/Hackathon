export class CreateAttendanceDto {
  session_id: number;
  student_id: number;
  status: string;
  confirmed: boolean;
  timestamp: Date;
}
