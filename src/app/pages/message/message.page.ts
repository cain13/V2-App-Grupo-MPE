import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../../providers/message/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  message: any;
  messageID: any = this.route.snapshot.paramMap.get('id');

  constructor(
    public route: ActivatedRoute,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.message = this.messageService.getItem(this.messageID) ? this.messageService.getItem(this.messageID) : this.messageService.getMessages()[0];
  }

}
