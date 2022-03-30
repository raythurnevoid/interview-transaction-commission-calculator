import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommissionsCalculatorConfigsService } from './commissions-override-rules.service';
import {
  fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto,
  fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity,
} from './commissions-override-rules.transformers';
import { CommissionsCalculatorConfigsDto } from './dto/commissions-calculator-configs.dto';

@Controller('configs')
export class CommissionsCalculatorConfigsController {
  constructor(
    private readonly commissionsCalculatorConfigsService: CommissionsCalculatorConfigsService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async setCommissionsOverrideRule(
    @Body() payloadDto: CommissionsCalculatorConfigsDto,
  ): Promise<void> {
    const payload =
      fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity(
        payloadDto,
      );
    await this.commissionsCalculatorConfigsService.setConfigs(payload);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getConfigs(): Promise<CommissionsCalculatorConfigsDto> {
    const response =
      await this.commissionsCalculatorConfigsService.getConfigs();
    const responseDto =
      fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto(
        response,
      );
    return responseDto;
  }
}
