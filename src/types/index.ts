export type StudentStatus = 'active' | 'suspended' | 'graduated' | 'refunded';
export type CourseType = 'beginner' | 'intermediate' | 'exam';
export type ChannelName = '地推' | '短视频' | '老学员转介绍';
export type FinanceType = 'payment' | 'refund' | 'expense';
export type RefundStatus = 'pending' | 'approved' | 'rejected';

export interface Student {
  id: string;
  name: string;
  age: number;
  phone: string;
  parentName: string;
  channelId: string;
  enrollmentDate: string;
  status: StudentStatus;
  remainingHours: number;
  totalHours: number;
  totalPaid: number;
  courseId?: string;
}

export interface Course {
  id: string;
  name: string;
  type: CourseType;
  pricePerHour: number;
  totalHours: number;
  teacherId: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  venueCost: number;
}

export interface Channel {
  id: string;
  name: ChannelName;
  totalCost: number;
  leadsCount: number;
  conversionCount: number;
  renewalCount: number;
}

export interface FinanceRecord {
  id: string;
  type: FinanceType;
  studentId?: string;
  courseId?: string;
  amount: number;
  date: string;
  category: string;
  remark: string;
}

export interface RefundRecord {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  date: string;
  status: RefundStatus;
}

export interface TeachingRecord {
  id: string;
  teacherId: string;
  courseId: string;
  date: string;
  hours: number;
  studentIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  hourlyRate: number;
  courseTypes: CourseType[];
  totalTaughtHours: number;
}

export interface MonthlyReport {
  month: string;
  isPeakSeason: boolean;
  totalRevenue: number;
  totalExpense: number;
  newStudents: number;
  totalStudents: number;
  refundAmount: number;
  teachingHours: number;
}

export interface ChannelAnalysis {
  channelId: string;
  channelName: string;
  totalCost: number;
  conversionCount: number;
  customerAcquisitionCost: number;
  conversionRate: number;
  renewalRate: number;
}

export interface CourseProfit {
  courseId: string;
  courseName: string;
  courseType: CourseType;
  revenue: number;
  venueCost: number;
  teacherCost: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
}
