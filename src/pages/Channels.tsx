import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';

export const Channels: React.FC = () => {
  const { getChannelAnalysis } = useAppStore();
  const channelAnalysis = getChannelAnalysis();

  const comparisonData = channelAnalysis.map((item) => ({
    name: item.channelName,
    获客成本: item.customerAcquisitionCost,
    转化率: item.conversionRate,
    续费率: item.renewalRate,
    转化数: item.conversionCount,
  }));

  const radarData = channelAnalysis.map((item) => ({
    subject: item.channelName,
    转化效率: item.conversionRate,
    留存质量: item.renewalRate,
    成本优势: Math.max(0, 100 - (item.customerAcquisitionCost / 1000) * 50),
  }));

  const getEfficiencyRank = (cac: number, conversionRate: number, renewalRate: number) => {
    const score = conversionRate * 2 + renewalRate * 1.5 - cac / 100;
    if (score > 80) return { label: '优秀', color: 'success' };
    if (score > 60) return { label: '良好', color: 'accent' };
    if (score > 40) return { label: '一般', color: 'warning' };
    return { label: '低效', color: 'danger' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channelAnalysis.map((item, index) => {
          const rank = getEfficiencyRank(item.customerAcquisitionCost, item.conversionRate, item.renewalRate);
          return (
            <Card key={item.channelId} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.channelName}</CardTitle>
                  <Badge variant={rank.color as any}>{rank.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <DollarSign className="w-4 h-4" />
                      <span>获客成本</span>
                    </div>
                    <span className="font-semibold text-slate-800">{formatCurrency(item.customerAcquisitionCost)}/人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Target className="w-4 h-4" />
                      <span>报名转化率</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <RefreshCw className="w-4 h-4" />
                      <span>学员续费率</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.renewalRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>成功转化</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.conversionCount}人</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>渠道获客成本对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === '获客成本') return [formatCurrency(value as number), name];
                      return [`${value}%`, name];
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="获客成本" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>渠道综合效能雷达</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                  <PolarRadiusAxis stroke="#94a3b8" />
                  <Radar name="转化效率" dataKey="转化效率" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="留存质量" dataKey="留存质量" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Radar name="成本优势" dataKey="成本优势" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>渠道转化与续费对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="转化率" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="续费率" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>投放建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">重点投入</span>
              </div>
              <p className="text-sm text-green-700">
                老学员转介绍渠道获客成本最低，转化率最高，建议加大老带新激励政策。
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">优化投放</span>
              </div>
              <p className="text-sm text-yellow-700">
                短视频渠道获客成本较高，建议优化内容，提高目标用户精准度。
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">缩减预算</span>
              </div>
              <p className="text-sm text-red-700">
                地推渠道效率一般，可考虑缩减线下投入，转为线上渠道。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
