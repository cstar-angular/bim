import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbPath = "/projects";
 
  dbRef: AngularFireList<any> = null;
 
  constructor(private db: AngularFireDatabase) {
    this.dbRef = db.list(this.dbPath);
  }
 
  createRow(path: string, data: any): any {
    this.dbRef = this.db.list(path);
    return this.dbRef.push(data);
  }
 
  updateRow(path: string, key: string, value: any): any {
    this.dbRef = this.db.list(path);
    this.dbRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteRow(path: string, key: string): void {
    this.dbRef = this.db.list(path);
    this.dbRef.remove(key).catch(error => this.handleError(error));
  }
 
  getLists(path: string): AngularFireList<any> {
    this.dbRef = this.db.list(path);
    return this.dbRef;
  }
 
  deleteAll(path: string): void {
    this.dbRef = this.db.list(path);
    this.dbRef.remove().catch(error => this.handleError(error));
  }

  getRowDetails(path: string, key: string): any {
    this.dbRef = this.db.list(path);
    return  this.db.object(this.dbPath + "/" + key);
  }
 
  private handleError(error) {
    console.log(error);
  }
}
