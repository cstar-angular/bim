import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ProjectProfile } from './projectprofile';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectprofileService {

  private dbPath = '/projects';
 
  projectsRef: AngularFireList<ProjectProfile> = null;
 
  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient
    ) {
    this.projectsRef = db.list(this.dbPath);
  }
 
  createProject(project: ProjectProfile): any {
    return this.projectsRef.push(project);
  }
 
  updateProject(key: string, value: any): any {
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

  getProjectProfile(key: string): any {
    return  this.db.object(this.dbPath + "/" + key);
  }

  getProjectRoleInfo(userId: string, projectId: string) {
    return this.db.list('/teams/' + projectId, ref => ref.orderByChild('userid').equalTo(userId));
  }
 
  private handleError(error) {
    console.log(error);
  }

  saveTemplate(params) {
    return this.http.post(environment.apiUrl + 'saveTemplate', params);
  }

  loadTemplate(params) {
    console.log(params);
    return this.http.post(environment.apiUrl + 'loadTemplate', params);
  }
}
