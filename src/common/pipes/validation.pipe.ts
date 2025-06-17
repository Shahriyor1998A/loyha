import { ValidationPipe as BaseValidationPipe } from '@nestjs/common';

export class ValidationPipe extends BaseValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  }
}
