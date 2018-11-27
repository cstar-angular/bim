import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dbPath = "/messages";
  dbRef: AngularFireList<any> = null;
  constructor(
    private db: AngularFireDatabase,
  ) {
    this.dbRef = db.list(this.dbPath);
   }

  getMessages(projectId, urlType) : AngularFireList<any>{
    // query to create our message feed binding
    this.dbRef = this.db.list(this.dbPath+'/'+projectId+'/'+urlType);
    return this.dbRef;
  }

  sendMsg(msgbody, projectId, urlType): any {
    return this.db.list(this.dbPath+'/'+projectId + '/'+urlType).push(msgbody);
  }
}
