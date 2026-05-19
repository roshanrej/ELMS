import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { LeaveApi } from '../../http/leave/leave-api';
import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';
import { LeaveService } from './leave.service';

describe('LeaveService', () => {
  let service: LeaveService;
  let leaveApi: {
    getEmployeeLeaves: ReturnType<typeof vi.fn>;
    requestLeave: ReturnType<typeof vi.fn>;
    saveDraft: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    leaveApi = {
      getEmployeeLeaves: vi.fn(),
      requestLeave: vi.fn(),
      saveDraft: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LeaveService,
        { provide: LeaveApi, useValue: leaveApi },
      ],
    });

    service = TestBed.inject(LeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map raw api data to LeaveModel before components receive it', async () => {
    leaveApi.getEmployeeLeaves.mockReturnValue(of([
      {
        id: 12,
        userId: 7,
        leaveType: 'SICK',
        startDate: '2026-04-22T00:00:00.000Z',
        endDate: '2026-04-23T00:00:00.000Z',
        reason: 'Fever',
        status: 'APPROVED',
        createdAt: '2026-04-20T10:30:00.000Z',
        submittedAt: '2026-04-20T12:00:00.000Z',
        approverId: 2,
        approverName: 'Manager One',
        decisionAt: '2026-04-21T08:00:00.000Z',
        comments: 'Approved',
      },
    ]));

    const leaves = await firstValueFrom(service.getEmployeeLeaves());

    expect(leaves[0]).toEqual({
      id: 12,
      leaveType: 'SICK',
      startDate: '2026-04-22T00:00:00.000Z',
      endDate: '2026-04-23T00:00:00.000Z',
      reason: 'Fever',
      status: LeaveStatusEnum.Approved,
      createdAt: new Date('2026-04-20T10:30:00.000Z'),
      submittedAt: new Date('2026-04-20T12:00:00.000Z'),
      approverId: 2,
      approverName: 'Manager One',
      decisionAt: new Date('2026-04-21T08:00:00.000Z'),
    });
  });
});
