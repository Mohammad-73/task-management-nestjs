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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import ProjectStatusEnum from './enums/project-status-enum';
import { ProjectsService } from './projects.service';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Res() res: Response,
  ) {
    const createdProject = await this.projectsService.create(createProjectDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createdProject,
      message: 'Project was created successfully!',
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: ProjectStatusEnum,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const projects = await this.projectsService.findAll(status, limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: projects,
      message: 'List of projects!',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const project = await this.projectsService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: project,
      message: 'Project is found!',
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    await this.projectsService.update(+id, updateProjectDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Project was updated successfully!',
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.projectsService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Project was deleted successfully!',
    });
  }
}
