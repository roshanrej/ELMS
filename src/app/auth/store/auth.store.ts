import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../../core/models/user/user.model';


@Injectable({ providedIn: 'root' })
export class AuthStore {

  private userSubject = new BehaviorSubject<UserModel | null>(null);

  user$ = this.userSubject.asObservable();

  setUser(user: UserModel | null) {
    this.userSubject.next(user);
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
