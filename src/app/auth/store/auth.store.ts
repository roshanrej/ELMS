import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserContextDTO } from '../../core/dtos/user/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private userSubject = new BehaviorSubject<UserContextDTO | null>(null);

  user$ = this.userSubject.asObservable();

  setUser(user: UserContextDTO | null): void {
    this.userSubject.next(user);
  }

  get currentUser(): UserContextDTO | null {
    return this.userSubject.value;
  }


  clearUser(): void {
    this.userSubject.next(null);
  }
}
