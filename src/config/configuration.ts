export interface AppConfig {
  urls: {
    first: string;
    second: string;
  };
  frequency: string;
  pagination: {
    page: number;
    size: number;
  };
  app: {
    name: string;
    version: string;
    port: number;
    env: string;
    corsOrigin: string;
    corsMethods: string;
  };
  postgresql: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

const configuration = (): AppConfig => ({
  urls: {
    first: process.env.FIRST_PROVIDER_URL!,
    second: process.env.SECOND_PROVIDER_URL!,
  },
  frequency: process.env.SCRAPE_CRON || '0 * * * *',
  pagination: {
    page: parseInt(process.env.PAGE || '1', 10),
    size: parseInt(process.env.SIZE || '20', 10),
  },

  app: {
    name: process.env.APP_NAME || 'JobScraper',
    version: process.env.APP_VERSION || '1.0.0',
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    corsMethods: process.env.CORS_METHODS || 'GET,POST',
  },
  postgresql: {
    host: process.env.POSTGRESQL_HOST!,
    port: parseInt(process.env.POSTGRESQL_PORT!, 10),
    username: process.env.POSTGRESQL_USER!,
    password: process.env.POSTGRESQL_PASSWORD!,
    database: process.env.POSTGRESQL_DATABASE_NAME!,
  },
});

export default configuration;
