// @ts-nocheck
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'postgresConnection', // Identificativo per connessioni multiple
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASS || 'postgres',
        database: process.env.POSTGRES_DB || 'boxedout_pg',
        entities: [], // Aggiungere qui le entità PostgreSQL
        synchronize: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
