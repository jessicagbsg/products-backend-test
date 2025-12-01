import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async check() {
    let isDbConnected = false;
    try {
      isDbConnected = this.dataSource.isInitialized;
      if (isDbConnected) {
        await this.dataSource.query('SELECT 1');
      }
    } catch {
      isDbConnected = false;
    }

    return {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      service: 'cart-service',
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        type: 'postgresql',
      },
    };
  }
}
