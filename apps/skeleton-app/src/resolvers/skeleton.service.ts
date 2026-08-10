import { Injectable } from '@nestjs/common';
import { SkeletonEntity } from './skeleton.entity';

@Injectable()
export class SkeletonService {
  private data: SkeletonEntity[] = [
    { id: '1', name: 'Zero', description: 'Zero config' },
    { id: '2', name: 'Low', description: 'Low config' },
    { id: '3', name: 'High', description: 'High config' },
  ];

  async getEntityListAgGrid(options: any, withCount?: boolean): Promise<[SkeletonEntity[], number]> {
    return [this.data, this.data.length];
  }

  async getEntityAgGrid(id: string): Promise<SkeletonEntity> {
    return this.data.find(d => d.id === id);
  }
}
