import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private connection: Connection) {}

  check() {
    const isDbConnected =
      this.connection.readyState === ConnectionStates.connected;

    return {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      service: 'products-service',
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        type: 'mongodb',
      },
    };
  }
}
