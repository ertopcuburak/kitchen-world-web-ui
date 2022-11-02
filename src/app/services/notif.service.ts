import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifService {
  unreadNotifs:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() { }

  public setUnreadNotifs(arr:any[]) {
    this.unreadNotifs.next(arr);
  }

  public getUnreadNotifs() {
    return this.unreadNotifs.getValue();
  }
}
