import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../../core/models/user/user.model';
import { LoginResponse } from '../../core/models/auth/login-response.model';


@Injectable({ providedIn: 'root' })
export class AuthStore {

  private userSubject = new BehaviorSubject<LoginResponse | null>(null);

  user$ = this.userSubject.asObservable();

  setUser(user: LoginResponse | null) {
    this.userSubject.next(user);
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
