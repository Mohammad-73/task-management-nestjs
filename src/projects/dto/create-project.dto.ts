import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import ProjectStatusEnum from '../enums/project-status-enum';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(ProjectStatusEnum)
  status: ProjectStatusEnum;
}
