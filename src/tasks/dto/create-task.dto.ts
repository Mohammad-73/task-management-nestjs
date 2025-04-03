import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import TaskStatusEnum from '../enums/task-status-enum';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: TaskStatusEnum;
}
