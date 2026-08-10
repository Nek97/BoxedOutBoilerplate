// @ts-nocheck
import { Module, Global } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DYNAMO_DB_CLIENT = 'DYNAMO_DB_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: DYNAMO_DB_CLIENT,
      useFactory: () => {
        const region = process.env.AWS_REGION || 'eu-central-1';
        
        const client = new DynamoDBClient({
          region,
          // Se non fornite, l'SDK utilizza le credenziali dal profilo ~/.aws/credentials 
          // o dalle variabili d'ambiente AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY
        });

        // Il DocumentClient semplifica le interazioni (unmarshals data types from/to JS automatically)
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [DYNAMO_DB_CLIENT],
})
export class DynamoModule {}
