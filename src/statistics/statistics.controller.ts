import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main')

  @Auth()

  getMainStatistics(@CurrentUser('id') id: number) {

  return this.statisticsService.getMain(id) }

}
