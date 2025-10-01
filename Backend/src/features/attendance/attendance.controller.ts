import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { attendanceIdParamSchema } from './validations/param/attendance-id.param';
import { createAttendanceSchema } from './validations/request/create-attendance.request';
import { updateAttendanceSchema } from './validations/request/update-attendace.request';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any) {
    return this.attendanceService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendanceService.findOne(attendance);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createAttendanceSchema))
    body: CreateAttendanceDto,
  ) {
    return this.attendanceService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
    @Body(new JoiValidationPipe(updateAttendanceSchema))
    body: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(attendance, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendanceService.remove(attendance);
  }
}
