import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  private projects = [{ id: '1', name: 'Example Project' }];

  findAll() {
    return this.projects;
  }
}
