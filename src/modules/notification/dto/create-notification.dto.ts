import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../../common/enums/notification-type.enum';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
