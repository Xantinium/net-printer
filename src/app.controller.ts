import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { scan } from './utils/scan';

@Controller('scan')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  scan() {
    return scan(Date.now().toString());
  }
}
