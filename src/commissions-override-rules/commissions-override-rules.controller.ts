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
  Delete,
} from '@nestjs/common';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';
import {
  fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto,
  fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity,
} from './commissions-override-rules.transformers';
import { DeleteCommissionOverrideRuleDto } from './dto/delete-commissions-override-rule.dto';
import { SetCommissionOverrideRuleDto } from './dto/set-commissions-override-rule.dto';

@Controller('commissions-override-rules')
export class CommissionOverrideRulesController {
  constructor(
    private readonly commissionOverrideRulesService: CommissionsOverrideRulesService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async setCommissionsOverrideRule(
    @Body() payloadDto: SetCommissionOverrideRuleDto,
  ): Promise<void> {
    const payload =
      fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity(
        payloadDto,
      );
    this.commissionOverrideRulesService.create(payload);
  }

  @Delete()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async deleteCommissionsOverrideRule(
    @Body() payloadDto: DeleteCommissionOverrideRuleDto,
  ): Promise<void> {
    const payload =
      fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity(
        payloadDto,
      );
    this.commissionOverrideRulesService.delete(payload);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@Query('client_id') client_id: string) {
    if (client_id) {
      const response = await this.commissionOverrideRulesService.findByClientId(
        +client_id,
      );
      const responseDto =
        fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto(response);
      return responseDto;
    } else {
      const responses = await this.commissionOverrideRulesService.findAll();
      const responseDtos = responses.map((response) =>
        fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto(response),
      );
      return responseDtos;
    }
  }
}
