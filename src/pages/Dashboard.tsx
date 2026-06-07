import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { formatCurrency, getChannelColor, getSeasonType } from '../utils';

export const Dashboard: React.FC = () => {
  const { getDashboardStats, getMonthlyReports, getChannelAnalysis, students } = useAppStore();
  const stats = getDashboardStats();
  const monthlyReports = getMonthlyReports();
  const channelAnalysis = getChannelAnalysis();

  const statCards = [
    {
      title: '总学员数',
      value: stats.totalStudents,
      subValue: `在读 ${stats.activeStudents} 人`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: '累计营收',
      value: formatCurrency(stats.totalRevenue),
      subValue: `本月 ${formatCurrency(stats.monthlyRevenue)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: '开设课程',
      value: stats.totalCourses,
      subValue: '3个课程类型',
      icon: GraduationCap,
      color: 'bg-primary-500',
    },
    {
      title: '教师团队',
      value: stats.totalTeachers,
      subValue: '专业舞蹈教师',
      icon: TrendingUp,
      color: 'bg-accent-500',
    },
  ];

  const channelData = channelAnalysis.map((item) => ({
    name: item.channelName,
    value: item.conversionCount,
    fill: getChannelColor(item.channelName),
  }));

  const revenueChartData = monthlyReports.map((item) => ({
    month: item.month.slice(5),
    营收: item.totalRevenue,
    支出: item.totalExpense,
    类型: getSeasonType(item.month + '-01'),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{card.subValue}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>月度营收趋势</CardTitle>
              <Badge variant="accent">{new Date().getFullYear()}年度</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value as number)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="营收" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="支出" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>渠道获客分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {channelData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-sm text-slate-600">{item.name} ({item.value}人)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>淡旺季对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value as number)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="营收"
                    stroke="#1e3a5f"
                    strokeWidth={3}
                    dot={{ fill: '#1e3a5f', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-600">旺季: 1,2,7,8月</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-sm text-slate-600">淡季: 其他月份</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近注册学员</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.age}岁 · {student.parentName}</p>
                    </div>
                  </div>
                  <Badge variant={student.status === 'active' ? 'success' : 'warning'}>
                    {student.status === 'active' ? '在读' : student.status === 'suspended' ? '停课' : '其他'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
