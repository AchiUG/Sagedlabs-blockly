
/**
 * Application Configuration
 * Centralized configuration management
 */

export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  timeout: number;
}

export interface AuthConfig {
  secret: string;
  sessionMaxAge: number;
  tokenExpiry: number;
}

export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  port: number;
  apiUrl: string;
  database: DatabaseConfig;
  auth: AuthConfig;
  features: {
    gamificationEnabled: boolean;
    certificatesEnabled: boolean;
    walletEnabled: boolean;
  };
  limits: {
    maxFileSize: number;
    maxRequestSize: number;
    rateLimit: number;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      env: (process.env.NODE_ENV as any) || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      
      database: {
        url: process.env.DATABASE_URL || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
        timeout: parseInt(process.env.DB_TIMEOUT || '5000', 10),
      },
      
      auth: {
        secret: process.env.NEXTAUTH_SECRET || 'development-secret',
        sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
        tokenExpiry: 7 * 24 * 60 * 60, // 7 days
      },
      
      features: {
        gamificationEnabled: process.env.FEATURE_GAMIFICATION !== 'false',
        certificatesEnabled: process.env.FEATURE_CERTIFICATES !== 'false',
        walletEnabled: process.env.FEATURE_WALLET === 'true',
      },
      
      limits: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
        maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '1048576', 10), // 1MB
        rateLimit: parseInt(process.env.RATE_LIMIT || '100', 10),
      },
    };
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  isDevelopment(): boolean {
    return this.config.env === 'development';
  }

  isProduction(): boolean {
    return this.config.env === 'production';
  }
}

export const config = new ConfigManager();
