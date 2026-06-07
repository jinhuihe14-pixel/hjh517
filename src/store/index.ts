import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Student,
  Course,
  Channel,
  FinanceRecord,
  RefundRecord,
  TeachingRecord,
  Teacher,
  ChannelAnalysis,
  CourseProfit,
  MonthlyReport,
} from '../types';
import { generateId, calculatePercentage, isPeakSeason } from '../utils';

interface AppState {
  students: Student[];
  courses: Course[];
  channels: Channel[];
  financeRecords: FinanceRecord[];
  refundRecords: RefundRecord[];
  teachingRecords: TeachingRecord[];
  teachers: Teacher[];
  
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  addChannel: (channel: Omit<Channel, 'id'>) => void;
  updateChannel: (id: string, channel: Partial<Channel>) => void;
  
  addFinanceRecord: (record: Omit<FinanceRecord, 'id'>) => void;
  addRefundRecord: (record: Omit<RefundRecord, 'id'>) => void;
  updateRefundStatus: (id: string, status: RefundRecord['status']) => void;
  
  addTeachingRecord: (record: Omit<TeachingRecord, 'id'>) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  getChannelAnalysis: () => ChannelAnalysis[];
  getCourseProfits: () => CourseProfit[];
  getMonthlyReports: () => MonthlyReport[];
  getRefundReasons: () => { reason: string; count: number; amount: number }[];
  getDashboardStats: () => {
    totalStudents: number;
    totalRevenue: number;
    totalCourses: number;
    totalTeachers: number;
    activeStudents: number;
    monthlyRevenue: number;
    refundRate: number;
  };
}

const initialTeachers: Teacher[] = [
  { id: 't1', name: '李老师', phone: '13800138001', hourlyRate: 200, courseTypes: ['beginner', 'intermediate'], totalTaughtHours: 120 },
  { id: 't2', name: '王老师', phone: '13800138002', hourlyRate: 250, courseTypes: ['intermediate', 'exam'], totalTaughtHours: 95 },
  { id: 't3', name: '张老师', phone: '13800138003', hourlyRate: 180, courseTypes: ['beginner'], totalTaughtHours: 80 },
];

const initialChannels: Channel[] = [
  { id: 'c1', name: '地推', totalCost: 15000, leadsCount: 150, conversionCount: 45, renewalCount: 18 },
  { id: 'c2', name: '短视频', totalCost: 25000, leadsCount: 300, conversionCount: 60, renewalCount: 24 },
  { id: 'c3', name: '老学员转介绍', totalCost: 5000, leadsCount: 80, conversionCount: 50, renewalCount: 35 },
];

const initialCourses: Course[] = [
  { id: 'course1', name: '街舞启蒙班A', type: 'beginner', pricePerHour: 150, totalHours: 48, teacherId: 't1', schedule: '周六日 10:00-11:30', maxStudents: 15, currentStudents: 12, venueCost: 3000 },
  { id: 'course2', name: '街舞启蒙班B', type: 'beginner', pricePerHour: 150, totalHours: 48, teacherId: 't3', schedule: '周六日 14:00-15:30', maxStudents: 15, currentStudents: 10, venueCost: 3000 },
  { id: 'course3', name: '街舞进阶班', type: 'intermediate', pricePerHour: 200, totalHours: 60, teacherId: 't1', schedule: '周二四 18:30-20:00', maxStudents: 12, currentStudents: 8, venueCost: 4000 },
  { id: 'course4', name: '街舞考级特训班', type: 'exam', pricePerHour: 280, totalHours: 36, teacherId: 't2', schedule: '周日 09:00-12:00', maxStudents: 10, currentStudents: 6, venueCost: 5000 },
];

const initialStudents: Student[] = [
  { id: 's1', name: '小明', age: 6, phone: '13900139001', parentName: '明爸爸', channelId: 'c1', enrollmentDate: '2026-01-15', status: 'active', remainingHours: 36, totalHours: 48, totalPaid: 7200, courseId: 'course1' },
  { id: 's2', name: '小红', age: 7, phone: '13900139002', parentName: '红妈妈', channelId: 'c2', enrollmentDate: '2026-01-20', status: 'active', remainingHours: 40, totalHours: 48, totalPaid: 7200, courseId: 'course1' },
  { id: 's3', name: '小华', age: 8, phone: '13900139003', parentName: '华爸爸', channelId: 'c3', enrollmentDate: '2026-02-01', status: 'active', remainingHours: 28, totalHours: 48, totalPaid: 7200, courseId: 'course2' },
  { id: 's4', name: '小强', age: 9, phone: '13900139004', parentName: '强妈妈', channelId: 'c1', enrollmentDate: '2026-02-10', status: 'active', remainingHours: 52, totalHours: 60, totalPaid: 12000, courseId: 'course3' },
  { id: 's5', name: '小丽', age: 10, phone: '13900139005', parentName: '丽爸爸', channelId: 'c2', enrollmentDate: '2026-03-01', status: 'active', remainingHours: 24, totalHours: 36, totalPaid: 10080, courseId: 'course4' },
  { id: 's6', name: '小刚', age: 7, phone: '13900139006', parentName: '刚妈妈', channelId: 'c3', enrollmentDate: '2026-03-15', status: 'active', remainingHours: 45, totalHours: 48, totalPaid: 7200, courseId: 'course1' },
  { id: 's7', name: '小美', age: 8, phone: '13900139007', parentName: '美爸爸', channelId: 'c1', enrollmentDate: '2026-04-01', status: 'suspended', remainingHours: 48, totalHours: 48, totalPaid: 7200, courseId: 'course2' },
  { id: 's8', name: '小亮', age: 6, phone: '13900139008', parentName: '亮妈妈', channelId: 'c3', enrollmentDate: '2026-04-10', status: 'refunded', remainingHours: 40, totalHours: 48, totalPaid: 7200, courseId: 'course1' },
  { id: 's9', name: '小宇', age: 9, phone: '13900139009', parentName: '宇爸爸', channelId: 'c2', enrollmentDate: '2026-05-01', status: 'active', remainingHours: 55, totalHours: 60, totalPaid: 12000, courseId: 'course3' },
  { id: 's10', name: '小琪', age: 10, phone: '13900139010', parentName: '琪妈妈', channelId: 'c1', enrollmentDate: '2026-05-15', status: 'active', remainingHours: 30, totalHours: 36, totalPaid: 10080, courseId: 'course4' },
  { id: 's11', name: '小俊', age: 7, phone: '13900139011', parentName: '俊爸爸', channelId: 'c2', enrollmentDate: '2026-06-01', status: 'active', remainingHours: 48, totalHours: 48, totalPaid: 7200, courseId: 'course1' },
  { id: 's12', name: '小雅', age: 8, phone: '13900139012', parentName: '雅妈妈', channelId: 'c3', enrollmentDate: '2026-06-01', status: 'active', remainingHours: 48, totalHours: 48, totalPaid: 7200, courseId: 'course2' },
];

const initialFinanceRecords: FinanceRecord[] = [
  { id: 'f1', type: 'payment', studentId: 's1', courseId: 'course1', amount: 7200, date: '2026-01-15', category: '学费', remark: '启蒙班学费' },
  { id: 'f2', type: 'payment', studentId: 's2', courseId: 'course1', amount: 7200, date: '2026-01-20', category: '学费', remark: '启蒙班学费' },
  { id: 'f3', type: 'payment', studentId: 's3', courseId: 'course2', amount: 7200, date: '2026-02-01', category: '学费', remark: '启蒙班学费' },
  { id: 'f4', type: 'payment', studentId: 's4', courseId: 'course3', amount: 12000, date: '2026-02-10', category: '学费', remark: '进阶班学费' },
  { id: 'f5', type: 'payment', studentId: 's5', courseId: 'course4', amount: 10080, date: '2026-03-01', category: '学费', remark: '考级班学费' },
  { id: 'f6', type: 'payment', studentId: 's6', courseId: 'course1', amount: 7200, date: '2026-03-15', category: '学费', remark: '启蒙班学费' },
  { id: 'f7', type: 'payment', studentId: 's7', courseId: 'course2', amount: 7200, date: '2026-04-01', category: '学费', remark: '启蒙班学费' },
  { id: 'f8', type: 'refund', studentId: 's8', amount: -6000, date: '2026-04-20', category: '退费', remark: '因搬家退费' },
  { id: 'f9', type: 'payment', studentId: 's9', courseId: 'course3', amount: 12000, date: '2026-05-01', category: '学费', remark: '进阶班学费' },
  { id: 'f10', type: 'payment', studentId: 's10', courseId: 'course4', amount: 10080, date: '2026-05-15', category: '学费', remark: '考级班学费' },
  { id: 'f11', type: 'payment', studentId: 's11', courseId: 'course1', amount: 7200, date: '2026-06-01', category: '学费', remark: '启蒙班学费' },
  { id: 'f12', type: 'payment', studentId: 's12', courseId: 'course2', amount: 7200, date: '2026-06-01', category: '学费', remark: '启蒙班学费' },
  { id: 'f13', type: 'expense', amount: 15000, date: '2026-01-01', category: '场地租金', remark: '1月场地租金' },
  { id: 'f14', type: 'expense', amount: 15000, date: '2026-02-01', category: '场地租金', remark: '2月场地租金' },
  { id: 'f15', type: 'expense', amount: 15000, date: '2026-03-01', category: '场地租金', remark: '3月场地租金' },
  { id: 'f16', type: 'expense', amount: 15000, date: '2026-04-01', category: '场地租金', remark: '4月场地租金' },
  { id: 'f17', type: 'expense', amount: 15000, date: '2026-05-01', category: '场地租金', remark: '5月场地租金' },
  { id: 'f18', type: 'expense', amount: 15000, date: '2026-06-01', category: '场地租金', remark: '6月场地租金' },
];

const initialRefundRecords: RefundRecord[] = [
  { id: 'r1', studentId: 's8', amount: 6000, reason: '因家庭搬家，距离太远', date: '2026-04-18', status: 'approved' },
  { id: 'r2', studentId: 's7', amount: 5000, reason: '孩子兴趣下降，不想继续', date: '2026-05-10', status: 'pending' },
];

const initialTeachingRecords: TeachingRecord[] = [
  { id: 'tr1', teacherId: 't1', courseId: 'course1', date: '2026-06-01', hours: 1.5, studentIds: ['s1', 's2', 's6', 's11'] },
  { id: 'tr2', teacherId: 't1', courseId: 'course1', date: '2026-06-02', hours: 1.5, studentIds: ['s1', 's2', 's6', 's11'] },
  { id: 'tr3', teacherId: 't3', courseId: 'course2', date: '2026-06-01', hours: 1.5, studentIds: ['s3', 's12'] },
  { id: 'tr4', teacherId: 't1', courseId: 'course3', date: '2026-06-04', hours: 1.5, studentIds: ['s4', 's9'] },
  { id: 'tr5', teacherId: 't2', courseId: 'course4', date: '2026-06-02', hours: 3, studentIds: ['s5', 's10'] },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      students: initialStudents,
      courses: initialCourses,
      channels: initialChannels,
      financeRecords: initialFinanceRecords,
      refundRecords: initialRefundRecords,
      teachingRecords: initialTeachingRecords,
      teachers: initialTeachers,

      addStudent: (student) =>
        set((state) => ({
          students: [...state.students, { ...student, id: generateId() }],
        })),

      updateStudent: (id, student) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...student } : s
          ),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, { ...course, id: generateId() }],
        })),

      updateCourse: (id, course) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...course } : c
          ),
        })),

      deleteCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        })),

      addChannel: (channel) =>
        set((state) => ({
          channels: [...state.channels, { ...channel, id: generateId() }],
        })),

      updateChannel: (id, channel) =>
        set((state) => ({
          channels: state.channels.map((c) =>
            c.id === id ? { ...c, ...channel } : c
          ),
        })),

      addFinanceRecord: (record) =>
        set((state) => ({
          financeRecords: [...state.financeRecords, { ...record, id: generateId() }],
        })),

      addRefundRecord: (record) =>
        set((state) => ({
          refundRecords: [...state.refundRecords, { ...record, id: generateId() }],
        })),

      updateRefundStatus: (id, status) =>
        set((state) => ({
          refundRecords: state.refundRecords.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      addTeachingRecord: (record) =>
        set((state) => ({
          teachingRecords: [...state.teachingRecords, { ...record, id: generateId() }],
        })),

      addTeacher: (teacher) =>
        set((state) => ({
          teachers: [...state.teachers, { ...teacher, id: generateId() }],
        })),

      updateTeacher: (id, teacher) =>
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? { ...t, ...teacher } : t
          ),
        })),

      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      getChannelAnalysis: () => {
        const { channels, students } = get();
        return channels.map((channel) => {
          const channelStudents = students.filter((s) => s.channelId === channel.id);
          channelStudents.filter((s) => s.status === 'active').length;
          channelStudents.filter((s) => s.totalHours > 48).length;
          
          return {
            channelId: channel.id,
            channelName: channel.name,
            totalCost: channel.totalCost,
            conversionCount: channel.conversionCount,
            customerAcquisitionCost: channel.conversionCount > 0 ? Math.round(channel.totalCost / channel.conversionCount) : 0,
            conversionRate: calculatePercentage(channel.conversionCount, channel.leadsCount),
            renewalRate: calculatePercentage(channel.renewalCount, channel.conversionCount),
          };
        });
      },

      getCourseProfits: () => {
        const { courses, students, teachers, teachingRecords } = get();
        return courses.map((course) => {
          const courseStudents = students.filter((s) => s.courseId === course.id);
          const revenue = courseStudents.reduce((sum, s) => sum + s.totalPaid, 0);
          const teacher = teachers.find((t) => t.id === course.teacherId);
          const courseTeachingRecords = teachingRecords.filter((tr) => tr.courseId === course.id);
          const totalTaughtHours = courseTeachingRecords.reduce((sum, tr) => sum + tr.hours, 0);
          const teacherCost = totalTaughtHours * (teacher?.hourlyRate || 0);
          const totalCost = course.venueCost + teacherCost;
          const netProfit = revenue - totalCost;
          
          return {
            courseId: course.id,
            courseName: course.name,
            courseType: course.type,
            revenue,
            venueCost: course.venueCost,
            teacherCost,
            totalCost,
            netProfit,
            profitMargin: revenue > 0 ? calculatePercentage(netProfit, revenue) : 0,
          };
        });
      },

      getMonthlyReports: () => {
        const { financeRecords, students, teachingRecords } = get();
        
        const monthMap = new Map<string, MonthlyReport>();
        
        financeRecords.forEach((record) => {
          const month = record.date.substring(0, 7);
          if (!monthMap.has(month)) {
            monthMap.set(month, {
              month,
              isPeakSeason: isPeakSeason(record.date + '-01'),
              totalRevenue: 0,
              totalExpense: 0,
              newStudents: 0,
              totalStudents: 0,
              refundAmount: 0,
              teachingHours: 0,
            });
          }
          const report = monthMap.get(month)!;
          if (record.type === 'payment') {
            report.totalRevenue += record.amount;
          } else if (record.type === 'expense') {
            report.totalExpense += record.amount;
          } else if (record.type === 'refund') {
            report.refundAmount += Math.abs(record.amount);
          }
        });
        
        students.forEach((student) => {
          const month = student.enrollmentDate.substring(0, 7);
          if (monthMap.has(month)) {
            monthMap.get(month)!.newStudents++;
          }
        });
        
        teachingRecords.forEach((record) => {
          const month = record.date.substring(0, 7);
          if (monthMap.has(month)) {
            monthMap.get(month)!.teachingHours += record.hours;
          }
        });
        
        return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
      },

      getRefundReasons: () => {
        const { refundRecords } = get();
        const reasonMap = new Map<string, { count: number; amount: number }>();
        
        refundRecords.forEach((record) => {
          if (record.status === 'approved') {
            const existing = reasonMap.get(record.reason) || { count: 0, amount: 0 };
            reasonMap.set(record.reason, {
              count: existing.count + 1,
              amount: existing.amount + record.amount,
            });
          }
        });
        
        return Array.from(reasonMap.entries())
          .map(([reason, data]) => ({ reason, ...data }))
          .sort((a, b) => b.count - a.count);
      },

      getDashboardStats: () => {
        const { students, financeRecords, courses, teachers } = get();
        
        const totalRevenue = financeRecords
          .filter((r) => r.type === 'payment')
          .reduce((sum, r) => sum + r.amount, 0);
          
        const totalRefund = financeRecords
          .filter((r) => r.type === 'refund')
          .reduce((sum, r) => sum + Math.abs(r.amount), 0);
          
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyRevenue = financeRecords
          .filter((r) => r.type === 'payment' && r.date.startsWith(currentMonth))
          .reduce((sum, r) => sum + r.amount, 0);
        
        return {
          totalStudents: students.length,
          totalRevenue,
          totalCourses: courses.length,
          totalTeachers: teachers.length,
          activeStudents: students.filter((s) => s.status === 'active').length,
          monthlyRevenue,
          refundRate: totalRevenue > 0 ? calculatePercentage(totalRefund, totalRevenue) : 0,
        };
      },
    }),
    {
      name: 'dance-studio-storage',
    }
  )
);
