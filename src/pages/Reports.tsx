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
  ComposedChart,
  Area,
  Legend,
} from 'recharts';
import { Download, TrendingUp, Calendar, Sun, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { formatCurrency, getCourseTypeName } from '../utils';

export const Reports: React.FC = () => {
  const { getMonthlyReports, getCourseProfits, getChannelAnalysis, students } = useAppStore();
  const monthlyReports = getMonthlyReports();
  const courseProfits = getCourseProfits();
  getChannelAnalysis();

  const seasonData = monthlyReports.map((item) => ({
    month: item.month.slice(5),
    新学员: item.newStudents,
    营收: item.totalRevenue,
    授课时长: item.teachingHours,
    类型: item.isPeakSeason ? '旺季' : '淡季',
  }));

  const courseProfitData = courseProfits.map((item) => ({
    name: item.courseName,
    类型: getCourseTypeName(item.courseType),
    营收: item.revenue,
    成本: item.totalCost,
    净利润: item.netProfit,
    利润率: item.profitMargin,
  }));

  const totalNetProfit = courseProfits.reduce((sum, item) => sum + item.netProfit, 0);
  const totalStudents = students.length;
  const peakSeasonMonths = monthlyReports.filter((m) => m.isPeakSeason);
  const offSeasonMonths = monthlyReports.filter((m) => !m.isPeakSeason);

  const peakSeasonAvgRevenue = peakSeasonMonths.length > 0
    ? peakSeasonMonths.reduce((sum, m) => sum + m.totalRevenue, 0) / peakSeasonMonths.length
    : 0;
  const offSeasonAvgRevenue = offSeasonMonths.length > 0
    ? offSeasonMonths.reduce((sum, m) => sum + m.totalRevenue, 0) / offSeasonMonths.length
    : 0;

  const handleExport = () => {
    const csvContent = [
      ['月份', '营收', '支出', '新学员', '授课时长', '季节类型'].join(','),
      ...monthlyReports.map((item) => [
        item.month,
        item.totalRevenue,
        item.totalExpense,
        item.newStudents,
        item.teachingHours,
        item.isPeakSeason ? '旺季' : '淡季',
      ].join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `经营报表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">经营报表</h2>
          <p className="text-sm text-slate-500">数据驱动的经营决策支持</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          导出报表
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Sun className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-slate-500">旺季平均营收</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(peakSeasonAvgRevenue)}</p>
            <p className="text-xs text-slate-400 mt-1">1月、2月、7月、8月</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">淡季平均营收</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(offSeasonAvgRevenue)}</p>
            <p className="text-xs text-slate-400 mt-1">其他月份</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-500">总净利润</span>
            </div>
            <p className={`text-2xl font-bold ${totalNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalNetProfit)}
            </p>
            <p className="text-xs text-slate-400 mt-1">所有课程累计</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm text-slate-500">报表周期</span>
            </div>
            <p className="text-2xl font-bold text-primary-600">{monthlyReports.length}个月</p>
            <p className="text-xs text-slate-400 mt-1">{totalStudents}名学员</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>淡旺季招生对比分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={seasonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="新学员" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="新学员数" />
                <Area yAxisId="right" type="monotone" dataKey="营收" fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" name="营收" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-slate-600">旺季月份</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-sm text-slate-600">淡季月份</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>课程盈利排行榜</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProfitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === '营收' || name === '成本' || name === '净利润') {
                        return [formatCurrency(value as number), name];
                      }
                      return [`${value}%`, name];
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="营收" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="成本" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="净利润" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>月度教学质量趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="授课时长" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>月度经营明细</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>月份</th>
                  <th>季节类型</th>
                  <th>营收</th>
                  <th>支出</th>
                  <th>新学员</th>
                  <th>退费金额</th>
                  <th>授课时长</th>
                  <th>净利润</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyReports].reverse().map((item) => (
                  <tr key={item.month}>
                    <td className="font-medium">{item.month}</td>
                    <td>
                      <Badge variant={item.isPeakSeason ? 'accent' : 'secondary'}>
                        {item.isPeakSeason ? '旺季' : '淡季'}
                      </Badge>
                    </td>
                    <td className="text-green-600 font-medium">{formatCurrency(item.totalRevenue)}</td>
                    <td className="text-red-600 font-medium">{formatCurrency(item.totalExpense)}</td>
                    <td>{item.newStudents}人</td>
                    <td className="text-orange-600">{formatCurrency(item.refundAmount)}</td>
                    <td>{item.teachingHours}小时</td>
                    <td className={`font-bold ${item.totalRevenue - item.totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.totalRevenue - item.totalExpense)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>经营建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📈 优化建议</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• 老学员转介绍渠道效果最好，建议加大激励政策</li>
                <li>• 启蒙班学员基数大，可考虑增加班次</li>
                <li>• 旺季（寒暑假）营收明显更高，提前做好招生准备</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💰 成本控制</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• 短视频渠道获客成本偏高，建议优化投放内容</li>
                <li>• 考级班利润率最高，可重点推广</li>
                <li>• 淡季可推出短期特色课程，提高课消</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 需关注</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• 退费主要原因为家庭搬家和兴趣下降</li>
                <li>• 建议加强学员关怀，提高学习兴趣</li>
                <li>• 地推渠道效率一般，可考虑缩减预算</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 下阶段目标</h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• 重点发展老学员转介绍，目标转化率80%+</li>
                <li>• 新增2个考级班，提高高利润课程占比</li>
                <li>• 下季度退费率控制在5%以内</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
