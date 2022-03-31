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
  Delete,
} from '@nestjs/common';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';
import {
  fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto,
  fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity,
} from './commissions-override-rules.transformers';
import { CommissionOverrideRuleDto } from './dto/commissions-override-rule.dto';
import { DeleteCommissionOverrideRuleDto } from './dto/delete-commissions-override-rule.dto';

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
    @Body() payloadDto: CommissionOverrideRuleDto,
  ): Promise<void> {
    const payload =
      fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity(
        payloadDto,
      );
    this.commissionOverrideRulesService.createCommissionOverrideRule(payload);
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
    this.commissionOverrideRulesService.deleteCommissionOverrideRule(payload);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findCommissionsOverrideRule(@Query('client_id') client_id?: string) {
    if (client_id) {
      const response =
        await this.commissionOverrideRulesService.findCommissionOverrideRuleByClientId(
          +client_id,
        );
      const responseDto =
        fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto(response);
      return responseDto;
    } else {
      const responses =
        await this.commissionOverrideRulesService.findAllCommissionOverrideRules();
      const responseDtos = responses.map((response) =>
        fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto(response),
      );
      return responseDtos;
    }
  }
}
