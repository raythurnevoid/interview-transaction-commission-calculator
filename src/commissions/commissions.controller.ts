import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommissionDto } from './dto/commission.dto';
import { CommissionsService } from './commissions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { fromCreateTransactionDtoToTransactionEntity } from '../transactions/transactions.transformers';
import { fromCommissionEntityToCommissionResponseDto } from './commissions.transformers';

@Controller('commission')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async getCommission(
    @Body() payloadDto: CreateTransactionDto,
  ): Promise<CommissionDto> {
    const payload = fromCreateTransactionDtoToTransactionEntity(payloadDto);
    const response = await this.commissionsService.getCommission(payload);
    const responseDto = fromCommissionEntityToCommissionResponseDto(response);
    return responseDto;
  }
}
