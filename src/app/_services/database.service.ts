import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbPath = "/projects";
 
  dbRef: AngularFireList<any> = null;

  result;

  constructor(private db: AngularFireDatabase) {
    this.dbRef = db.list(this.dbPath);
  }
 
  createRow(path: string, data: any): any {
    this.dbRef = this.db.list(path);
    return this.dbRef.push(data);
  }

  createRowWithKey(path: string, data: any): any {
    this.db.object(path).set(data);
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
    
    this.db.object(path + "/" + key).snapshotChanges().subscribe(data=>{
      this.result = data.payload.val();
    });
    return this.result;
  }
 
  private handleError(error) {
    console.log(error);
  }
}
