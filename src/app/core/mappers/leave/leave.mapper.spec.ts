import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';
import { LeaveTypeEnum } from '../../types-enums/leave-type-enum';
import { mapLeaveDtoToModel } from './leave.mapper';

describe('mapLeaveDtoToModel', () => {
  it('should map api data to LeaveModel', () => {
    const leave = mapLeaveDtoToModel({
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
    });

    expect(leave).toEqual({
      id: 12,
      userId: 7,
      leaveType: LeaveTypeEnum.Sick,
      startDate: new Date('2026-04-22T00:00:00.000Z'),
      endDate: new Date('2026-04-23T00:00:00.000Z'),
      reason: 'Fever',
      status: LeaveStatusEnum.Approved,
      createdAt: new Date('2026-04-20T10:30:00.000Z'),
      submittedAt: new Date('2026-04-20T12:00:00.000Z'),
      approverId: 2,
      approverName: 'Manager One',
      decisionAt: new Date('2026-04-21T08:00:00.000Z'),
      comments: 'Approved',
    });
  });

  it('should throw if required fields are missing', () => {
    expect(() =>
      mapLeaveDtoToModel({
        id: 1,
        userId: 1,
      } as any)
    ).toThrow();
  });
});
