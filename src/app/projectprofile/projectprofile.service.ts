import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ProjectProfile } from './projectprofile';

@Injectable({
  providedIn: 'root'
})
export class ProjectprofileService {

  private dbPath = '/projects';
 
  projectsRef: AngularFireList<ProjectProfile> = null;
 
  constructor(private db: AngularFireDatabase) {
    this.projectsRef = db.list(this.dbPath);
  }
 
  createProject(project: ProjectProfile): void {
    this.projectsRef.push(project);
  }
 
  updateProject(key: string, value: any): void {
    this.projectsRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteProject(key: string): void {
    this.projectsRef.remove(key).catch(error => this.handleError(error));
  }
 
  getProjectsList(): AngularFireList<ProjectProfile> {
    return this.projectsRef;
  }
 
  deleteAll(): void {
    this.projectsRef.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }
}
