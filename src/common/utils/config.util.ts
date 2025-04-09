import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/configuration';

export function getConfig<K extends keyof AppConfig>(
  configService: ConfigService<AppConfig, true>,
  key: K,
): NonNullable<AppConfig[K]> {
  const value = configService.get(key, { infer: true });
  if (value === undefined || value === null) {
    throw new Error(`Missing config for key: ${key}`);
  }
  return value;
}
