import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/transaction.dto';
import { CommissionDto } from '../commissions/dto/commission.dto';
import {
  fromTransactionDtoToTransactionEntity,
  fromTransactionEntityToTransactionDto,
} from './transactions.transformers';
import { CommissionsService } from '../commissions/commissions.service';
import { fromCommissionEntityToCommissionDto } from '../commissions/commissions.transformers';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async createTransaction(
    @Body() payloadDto: TransactionDto,
  ): Promise<CommissionDto> {
    const payload = fromTransactionDtoToTransactionEntity(payloadDto);
    const response = await this.commissionsService.getCommission(payload);
    await this.transactionsService.createTransaction(payload);
    const responseDto = fromCommissionEntityToCommissionDto(response);
    return responseDto;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findTransactions(
    @Query('client_id') client_id?: string,
  ): Promise<CommissionDto[]> {
    if (client_id) {
      const responses =
        await this.transactionsService.findTransactionsByClientId(+client_id);
      const responseDtos = responses.map((response) =>
        fromTransactionEntityToTransactionDto(response),
      );
      return responseDtos;
    } else {
      const responses = await this.transactionsService.findAllTransactions();
      const responseDtos = responses.map((response) =>
        fromTransactionEntityToTransactionDto(response),
      );
      return responseDtos;
    }
  }
}
