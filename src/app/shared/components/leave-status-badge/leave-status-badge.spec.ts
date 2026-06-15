import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStatusBadge } from './leave-status-badge';

describe('LeaveStatusBadge', () => {
  let component: LeaveStatusBadge;
  let fixture: ComponentFixture<LeaveStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveStatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveStatusBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and class for known status', () => {
    component.status = 'APPROVED';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('span');
    expect(el.textContent.trim()).toBe('Approved');
    expect(el.className).toContain('badge-soft-green');
  });

  it('should fallback gracefully for unknown status', () => {
    component.status = 'UNKNOWN_FOO';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('span');
    expect(el.textContent.trim()).toBe('UNKNOWN_FOO');
    expect(el.className).toContain('badge-soft-gray');
  });

  it('should render leave type ACTIVE/INACTIVE correctly', () => {
    component.status = 'ACTIVE';
    fixture.detectChanges();
    let el = fixture.nativeElement.querySelector('span');
    expect(el.textContent.trim()).toBe('Active');
    expect(el.className).toContain('badge-soft-green');

    component.status = 'INACTIVE';
    fixture.detectChanges();
    el = fixture.nativeElement.querySelector('span');
    expect(el.textContent.trim()).toBe('Inactive');
  });
});
