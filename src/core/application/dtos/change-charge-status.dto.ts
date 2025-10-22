import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChargeStatus } from 'src/core/domain/enums/charge-status.enum';

export class ChangeChargeStatusDto {
  @IsNotEmpty({ message: "O status não pode estar vazio" })
  @IsEnum(ChargeStatus, { message: 'Status deve ser PENDING, CANCELLED, PAID,  FAILED ou EXPIRED' })
  status!: ChargeStatus;
}
