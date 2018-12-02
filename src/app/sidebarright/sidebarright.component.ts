import { Component, OnInit,ViewChild ,ElementRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService } from '../_services/chat.service';
import { map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

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
  messagesShow;
  msgtext = '';
  searchTxt = '';
  isProgressForuploading = false;
  isEmojji = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  authUser: firebase.User;

  @ViewChild('feedContainer') feedContainer: ElementRef;
  @ViewChild('images_for_send') images_for_send: ElementRef;
  @ViewChild('files_for_send') files_for_send: ElementRef;
  
  constructor(
    private router: Router,
    private chatService: ChatService,
    private afStorage: AngularFireStorage,
    private auth: AngularFireAuth
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

    this.authUser = this.auth.auth.currentUser;
    console.log(this.authUser);
    
  }

  ngOnInit() {    
  }

  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

  loadMessages() {
    this.isLoading = true;
    this.messages = [];
    this.messagesShow = [];
    
    this.chatService.getMessages(this.projectId, this.urlType).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(data => {
      this.messages = data;
      this.messagesShow = data;
      this.isLoading = false;
      this.search(this.searchTxt)
    });
  }

  sendMsg() {
    if(this.msgtext != ''){
      var msgBody = {
        message: this.msgtext,
        type: 'txt',
        userId: this.authUser.uid
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
    // this.scrollToBottom();
  }

  popupforImage() {
    this.images_for_send.nativeElement.click();
  }

  popupforFile() {
    this.files_for_send.nativeElement.click();
  }

  handleFileInput(files) {
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('files/' + this.projectId+'/'+this.urlType + '/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    this.isProgressForuploading = true;
    this.task.then(function (data) {
      
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
        var msgBody = {
          message: data,
          type: 'img',
          userId: me.authUser.uid
        }
        me.isProgressForuploading = false;
        me.chatService.sendMsg(msgBody, me.projectId, me.urlType);
      });
    });   
  }

  handleFileInputFile(files) {
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('files/' + this.projectId+'/'+this.urlType + '/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    
    this.isProgressForuploading = true;
    this.task.then(function (data) {
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
        var msgBody = {
          message: data,
          type: 'file',
          name: files[0]['name'],
          userId: me.authUser.uid
        }
        me.isProgressForuploading = false;
        me.chatService.sendMsg(msgBody, me.projectId, me.urlType);
      });
    });   
  }

  search(val) {
   this.searchTxt = val;
   if (this.searchTxt == "") {
     return;
   }
   this.messagesShow = this.messages.filter(message => message.message.includes(this.searchTxt));
  }

  addEmoji(event) {
    this.isEmojji = !this.isEmojji;
    this.msgtext += event.emoji.native;
  }
}
