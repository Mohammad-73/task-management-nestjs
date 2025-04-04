import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import TaskStatusEnum from './enums/task-status-enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    const createdTask = await this.tasksService.create(createTaskDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createdTask,
      message: 'Task was created successfully!',
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: TaskStatusEnum,
    @Query('project') projectId?: number,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const tasks = await this.tasksService.findAll(
      status,
      projectId,
      limit,
      page,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: tasks,
      message: 'Tasks list!',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: task,
      message: 'Task is found!',
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    await this.tasksService.update(+id, updateTaskDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Task was updated successfully!',
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.tasksService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Task was deleted successfully!',
    });
  }
}
