import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import TaskStatusEnum from './enums/task-status-enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const { projectId, ...taskData } = createTaskDto;
      const project = await this.projectRepository.findOneByOrFail({
        id: projectId,
      });
      const newTask = this.taskRepository.create({ ...taskData, project });
      return await this.taskRepository.save(newTask);
    } catch (error) {
      throw new BadRequestException(`Error creating task ${error}`);
    }
  }

  async findAll(status?: TaskStatusEnum, limit: number = 10, page: number = 1) {
    const query = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project');

    if (status) {
      query.where('tasks.status = :status', { status: status });
    }

    query.skip((page - 1) * limit).take(limit);

    return await query.getMany();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!task) throw new NotFoundException(`Task #${id} is not found!`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { projectId, ...taskData } = updateTaskDto;

    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task #${id} is not found!`);

    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project #${id} is not found!`);

    try {
      const updateTask = await this.taskRepository.update(id, {
        ...taskData,
        project,
      });
      return updateTask;
    } catch (error) {
      throw new BadRequestException(`Error updating task ${error}`);
    }
  }

  async remove(id: number) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task #${id} is not found!`);
  }
}
