import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller({ path: 'health' })
export class HealthController {
  @Get('status')
  @HttpCode(200)
  status(): object {
    return { status: true };
  }
}
