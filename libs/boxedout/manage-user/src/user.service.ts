// @ts-nocheck
import { Injectable, Provider } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { ActiveSession } from '@boxedout-libs/db-boxedout/entities/active-session.entity';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import {
  ActiveSessionRepository,
  UserRepository,
} from '@boxedout-libs/db-boxedout/boxedout.repository';

export function UserServiceFactory(boxedoutDbConnName: string): Provider {
  return {
    provide: UserService,
    useFactory: (
      userRepository: UserRepository,
      activeSessionRepository: ActiveSessionRepository,
    ) => {
      return new UserService(userRepository, activeSessionRepository);
    },
    inject: [
      getRepositoryToken(User, boxedoutDbConnName),
      getRepositoryToken(ActiveSession, boxedoutDbConnName),
    ],
  };
}

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    userRepository: UserRepository,
    private activeSessionRepository: ActiveSessionRepository,
  ) {
    super(userRepository);
  }

  /**
   *  Get the active session of an user
   *
   * @param guid - The user id/guid
   * @returns the data of the active session
   */
  async createActiveSession(
    guid: string,
    sessionId: string,
    audience: string,
    device: string,
    csrf: string,
    ip: string,
  ): Promise<InsertResult> {
    const newActiveSession = this.activeSessionRepository.create({
      guid,
      sessionId,
      audience,
      device,
      csrf,
      ip,
    });
    return this.activeSessionRepository.insert(newActiveSession);
  }

  /**
   *  Get the last Active Session for a Session ID
   *
   * @param sessionId - The session Id
   * @returns the data of the active session
   */
  async getActiveSession(
    sessionId: string,
    fields: (keyof ActiveSession)[] | undefined = undefined,
  ): Promise<ActiveSession | undefined> {
    return this.activeSessionRepository.findOne({
      where: { sessionId },
      select: fields,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  /**
   *  Get the all active session of an user
   *
   * @param guid - The user id/guid
   * @returns the data of the active session
   */
  async getActiveSessionList(
    guid: string,
    fields: (keyof ActiveSession)[] | undefined = undefined,
  ): Promise<ActiveSession[]> {
    return this.activeSessionRepository.find({
      where: { guid },
      select: fields,
    });
  }

  /**
   *  Delete sessionId row to invalidate the specific session
   *
   * @param sessionId - The session id
   * @returns the data of the active session
   */
  async deleteActiveSession(sessionId: string): Promise<boolean> {
    await this.activeSessionRepository.delete({ sessionId });
    return true;
  }

  /**
   *  Delete all sessions of an user by its id
   *
   * @param guid - The user id
   * @returns the data of the active session
   */
  async deleteAllActiveSession(guid: string): Promise<boolean> {
    await this.activeSessionRepository.delete({ guid });
    return true;
  }

  /**
   *  Check and update the bruteforce count
   *
   * @param sessionId - The session Id
   * @returns true if the bruteforce count is less than 100
   * @returns false if the bruteforce count is more than 100 or less than 0
   */
  async limitBruteForce(sessionId: string): Promise<boolean> {
    const sessionData = await this.activeSessionRepository.findOne({
      where: { sessionId },
    });
    if (!sessionData) {
      return false;
    }
    if (sessionData.bruteForceCount > 99 || sessionData.bruteForceCount < 0) {
      await this.deleteActiveSession(sessionId);
      return false;
    }
    this.activeSessionRepository.save({
      xx: sessionData.xx,
      sessionId,
      bruteForceCount: sessionData.bruteForceCount + 1,
    });
    return true;
  }
}
