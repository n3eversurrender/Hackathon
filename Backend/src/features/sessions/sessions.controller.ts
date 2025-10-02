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
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { User } from 'src/features/user/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { SessionsService } from './sessions.service';
import { sessionIdParamSchema } from './validations/param/sessions-id.param';
import { createSessionsSchema } from './validations/request/create-sessions.request';
import { updateSessionsSchema } from './validations/request/update-sessions.request';

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @CurrentUser() user: User) {
    return this.sessionsService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationParamPipe(sessionIdParamSchema))
    session: Session,
  ) {
    return this.sessionsService.findOne(session);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createSessionsSchema))
    body: CreateSessionDto,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.create(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new JoiValidationParamPipe(sessionIdParamSchema))
    session: Session,
    @Body(new JoiValidationPipe(updateSessionsSchema))
    body: UpdateSessionDto,
  ) {
    return this.sessionsService.update(session, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationParamPipe(sessionIdParamSchema))
    session: Session,
  ) {
    return this.sessionsService.remove(session);
  }
}
