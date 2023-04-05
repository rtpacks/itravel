import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createSpotsDB')
  async createSpotsDB(): Promise<string> {
    await this.appService.createSpotsDB();
    return 'success';
  }

  @Post('createSpotMonthSpotFeatureDB')
  async createSpotMonthsDB() {
    await this.appService.createSpotMonthSpotFeatureDB();
    return 'success';
  }
}
