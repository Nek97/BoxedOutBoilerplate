// @ts-nocheck
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_APP = 'FIREBASE_APP';

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_APP,
      useFactory: () => {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        if (!projectId) return null; // Non inizializzato se non ci sono le env var (fallback sicuro per boilerplate)

        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      },
    },
  ],
  exports: [FIREBASE_APP],
})
export class FirebaseModule {}
