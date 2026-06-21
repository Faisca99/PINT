import { Global, Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
