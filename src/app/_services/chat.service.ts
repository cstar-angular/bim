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
    msgbody['timesent'] = this.getTimeStamp();
    return this.db.list(this.dbPath+'/'+projectId + '/'+urlType).push(msgbody);
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }
}
