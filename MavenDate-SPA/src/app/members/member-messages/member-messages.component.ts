import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Message } from 'src/app/_models/message';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipentId: number;
  messages: Message[];
  newMessage: any = {};

  constructor( private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipentId)
    .pipe(
      tap(messages => {
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].isRead === false && this.messages[i].recipentId === currentUserId) {
            this.userService.markAsRead(currentUserId, this.messages[i].id);
          }
        }
      })
    )
        .subscribe(messages => {
          this.messages = messages;
        }, error => {
          this.alertify.error(error);
        });
  }

  sendMessage() {
    this.newMessage.recipentId = this.recipentId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
        .subscribe((message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        }, error => {
          this.alertify.error(error);
        });
  }

}
