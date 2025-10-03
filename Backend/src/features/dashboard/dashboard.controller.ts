import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { User } from 'src/features/user/entities/user.entity';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  async getStatistics(
    @Query('date') date: string,
    @CurrentUser() user: User,
  ) {
    return this.dashboardService.getStatistics(date, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('today-sessions')
  async getTodaySessions(
    @Query('date') date: string,
    @CurrentUser() user: User,
  ) {
    return this.dashboardService.getTodaySessions(date, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recent-attendances')
  async getRecentAttendances(@CurrentUser() user: User) {
    return this.dashboardService.getRecentAttendances(user);
  }
}
