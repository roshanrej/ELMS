export interface CreateLeavePolicyResponseDTO {
  id: number;
  leaveType: string;
  year: number;
  allocatedLeave: number;
  noticePeriodDays: number;
}