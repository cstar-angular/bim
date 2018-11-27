import { Component, OnInit,ViewChild ,ElementRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService } from '../_services/chat.service';
import { map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

@Component({
  selector: 'app-sidebarright',
  templateUrl: './sidebarright.component.html',
  styleUrls: ['./sidebarright.component.scss']
})
export class SidebarrightComponent implements OnInit, AfterViewChecked  {

  isLoading = false;
  url;
  projectId;
  urlType;
  routerEvent;
  messages;
  msgtext = '';
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  @ViewChild('scroller') feedContainer;
  @ViewChild('images_for_send') images_for_send;
  

  constructor(
    private router: Router,
    private chatService: ChatService,
    private afStorage: AngularFireStorage,

  ) { 
    this.routerEvent = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.url = val['url'];
      } else {
        this.url = val['url'];
      }
     
      if(this.url) {
        this.projectId = this.url.split('/')[3];
        this.urlType = this.url.split('/')[2];
        this.loadMessages();
      } 
    });
  }

  ngOnInit() {    
  }

  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

  loadMessages() {
    this.isLoading = true;
    this.messages = [];
    
    this.chatService.getMessages(this.projectId, this.urlType).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.messages = data;
      this.isLoading = false;
    });
  }

  sendMsg() {
    if(this.msgtext != ''){
      var msgBody = {
        message: this.msgtext,
        type: 'txt'
      }
      this.chatService.sendMsg(msgBody, this.projectId, this.urlType);
      this.msgtext = '';
    }
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      if(!event.shiftKey){
        this.sendMsg();
      }
      
    }
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  popupforImage() {
    this.images_for_send.nativeElement.click();
  }

  handleFileInput(files) {
    console.log(files);
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('files/' + this.projectId+'/'+this.urlType + '/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    this.task.then(function (data) {
      
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
        var msgBody = {
          message: data,
          type: 'img'
        }
        me.chatService.sendMsg(msgBody, me.projectId, me.urlType);
      });
    });   
  }


}
