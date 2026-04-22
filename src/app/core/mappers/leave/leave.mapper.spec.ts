import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';
import { LeaveTypeEnum } from '../../types-enums/leave-type-enum';
import { mapLeaveDtoToModel } from './leave.mapper';

describe('mapLeaveDtoToModel', () => {
  it('should map snake_case api data to LeaveModel', () => {
    const leave = mapLeaveDtoToModel({
      id: '12',
      user_id: '7',
      leave_type: 'SICK',
      start_date: '2026-04-22',
      end_date: '2026-04-23',
      reason: 'Fever',
      status: 'APPROVED',
      applied_at: '2026-04-20T10:30:00.000Z',
      approver_id: '2',
      approver_name: 'Manager One',
      decision_at: '2026-04-21T08:00:00.000Z',
      comments: 'Approved',
    });

    expect(leave).toEqual({
      id: 12,
      userId: 7,
      leaveType: LeaveTypeEnum.Sick,
      startDate: new Date('2026-04-22'),
      endDate: new Date('2026-04-23'),
      reason: 'Fever',
      status: LeaveStatusEnum.Approved,
      appliedAt: new Date('2026-04-20T10:30:00.000Z'),
      approverId: 2,
      approverName: 'Manager One',
      decisionAt: new Date('2026-04-21T08:00:00.000Z'),
      comments: 'Approved',
    });
  });

  it('should fall back to safe defaults for missing or invalid fields', () => {
    const leave = mapLeaveDtoToModel({
      leave_type: 'UNKNOWN',
      status: 'UNKNOWN',
      start_date: 'bad-date',
      end_date: 'bad-date',
      applied_at: 'bad-date',
    });

    expect(leave.id).toBe(0);
    expect(leave.userId).toBe(0);
    expect(leave.leaveType).toBe(LeaveTypeEnum.Annual);
    expect(leave.status).toBe(LeaveStatusEnum.Pending);
    expect(leave.startDate).toBeInstanceOf(Date);
    expect(leave.endDate).toBeInstanceOf(Date);
    expect(leave.appliedAt).toBeInstanceOf(Date);
  });
});
