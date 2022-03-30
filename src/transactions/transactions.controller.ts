import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  HttpCode,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CommissionDto } from '../commissions/dto/commission.dto';
import {
  fromCreateTransactionDtoToTransactionEntity,
  fromTransactionEntityToTransactionDto,
} from './transactions.transformers';
import { CommissionsService } from '../commissions/commissions.service';
import { fromCommissionEntityToCommissionResponseDto } from '../commissions/commissions.transformers';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() payloadDto: CreateTransactionDto,
  ): Promise<CommissionDto> {
    const payload = fromCreateTransactionDtoToTransactionEntity(payloadDto);
    this.transactionsService.create(payload);
    const response = await this.commissionsService.getCommission(payload);
    const responseDto = fromCommissionEntityToCommissionResponseDto(response);
    return responseDto;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<CommissionDto[]> {
    const responses = await this.transactionsService.findAll();
    const responseDtos = responses.map((response) =>
      fromTransactionEntityToTransactionDto(response),
    );
    return responseDtos;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByClientId(
    @Query('client_id') client_id: string,
  ): Promise<CommissionDto[]> {
    const responses = await this.transactionsService.findByClientId(+client_id);
    const responseDtos = responses.map((response) =>
      fromTransactionEntityToTransactionDto(response),
    );
    return responseDtos;
  }
}
