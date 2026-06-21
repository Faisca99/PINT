import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly db: DatabaseService) {}

  async send(event: string, payload: Record<string, any>) {
    try {
      const res = await this.db.query(
        `SELECT provider, config FROM integration_configs WHERE is_active = TRUE`,
      );

      for (const row of res.rows) {
        const url = row.config?.webhook_url;
        if (!url) continue;

        const body = row.provider === 'teams'
          ? {
              "@type": "MessageCard",
              "@context": "http://schema.org/extensions",
              summary: payload.text,
              sections: [{ activityTitle: payload.title, activityText: payload.text }],
            }
          : { text: `*${payload.title}*\n${payload.text}` };

        try {
          await axios.post(url, body, { timeout: 5000 });
          this.logger.log(`Webhook [${row.provider}] sent: ${event}`);
        } catch (err) {
          this.logger.warn(`Webhook [${row.provider}] failed: ${err}`);
        }
      }
    } catch (err) {
      this.logger.error(`WebhookService error: ${err}`);
    }
  }

  async badgeAwarded(consultantName: string, badgeName: string) {
    await this.send('badge_awarded', {
      title: '🏅 Novo Badge Atribuído',
      text: `${consultantName} obteve o badge **${badgeName}** na Softinsa Badges Platform.`,
    });
  }
}
