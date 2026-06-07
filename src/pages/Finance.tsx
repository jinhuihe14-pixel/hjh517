import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store';
import { formatCurrency, formatDate, getStatusName } from '../utils';

export const Finance: React.FC = () => {
  const {
    financeRecords,
    refundRecords,
    students,
    getRefundReasons,
    getMonthlyReports,
    getStudentRefundable,
    addFinanceRecord,
    addRefundRecord,
    updateRefundStatus,
    approveRefund,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('records');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: '',
    category: '学费',
    remark: '',
  });
  const [refundForm, setRefundForm] = useState({
    studentId: '',
    amount: '',
    reason: '',
  });
  const [refundError, setRefundError] = useState('');
  const [approveError, setApproveError] = useState('');

  const refundReasons = getRefundReasons();
  const monthlyReports = getMonthlyReports();

  const totalRevenue = financeRecords
    .filter((r) => r.type === 'payment')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financeRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalRefund = financeRecords
    .filter((r) => r.type === 'refund')
    .reduce((sum, r) => sum + Math.abs(r.amount), 0);

  const profitChartData = monthlyReports.map((item) => ({
    month: item.month.slice(5),
    营收: item.totalRevenue,
    支出: item.totalExpense,
    净利润: item.totalRevenue - item.totalExpense,
  }));

  const reasonChartData = refundReasons.map((item) => ({
    name: item.reason.length > 8 ? item.reason.slice(0, 8) + '...' : item.reason,
    fullName: item.reason,
    value: item.count,
    amount: item.amount,
  }));

  const REASON_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const handleAddPayment = () => {
    students.find((s) => s.id === paymentForm.studentId);
    addFinanceRecord({
      type: 'payment',
      studentId: paymentForm.studentId,
      amount: parseInt(paymentForm.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      category: paymentForm.category,
      remark: paymentForm.remark,
    });
    setIsPaymentDialogOpen(false);
    setPaymentForm({ studentId: '', amount: '', category: '学费', remark: '' });
  };

  const handleAddRefund = () => {
    const amount = parseInt(refundForm.amount) || 0;

    if (!refundForm.studentId) {
      setRefundError('请选择学员');
      return;
    }

    if (amount <= 0) {
      setRefundError('退费金额必须大于0');
      return;
    }

    const refundable = getStudentRefundable(refundForm.studentId);
    if (amount > refundable) {
      setRefundError(`退费金额不能超过可退余额 ${formatCurrency(refundable)}`);
      return;
    }

    if (!refundForm.reason.trim()) {
      setRefundError('请填写退费原因');
      return;
    }

    addRefundRecord({
      studentId: refundForm.studentId,
      amount,
      reason: refundForm.reason,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setIsRefundDialogOpen(false);
    setRefundForm({ studentId: '', amount: '', reason: '' });
    setRefundError('');
  };

  const handleApproveRefund = (id: string) => {
    const result = approveRefund(id);
    if (!result.success) {
      setApproveError(result.message);
      setTimeout(() => setApproveError(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">累计营收</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">累计支出</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">净利润</p>
                <p className={`text-2xl font-bold mt-1 ${totalRevenue - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalRevenue - totalExpense - totalRefund)}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">累计退费</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalRefund)}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <ArrowLeftRight className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>月度收支趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value as number)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="营收" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="净利润" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>退费原因分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {reasonChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={REASON_COLORS[index % REASON_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => {
                      if (name === 'value') return [value + '次', props.payload.fullName];
                      return [formatCurrency(value as number), name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>财务管理</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setIsPaymentDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                登记收费
              </Button>
              <Button variant="secondary" onClick={() => setIsRefundDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                申请退费
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="records">收支记录</TabsTrigger>
              <TabsTrigger value="refunds">退费申请</TabsTrigger>
            </TabsList>
            <TabsContent value="records">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>类型</th>
                      <th>学员</th>
                      <th>分类</th>
                      <th>金额</th>
                      <th>备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...financeRecords].reverse().map((record) => {
                      const student = students.find((s) => s.id === record.studentId);
                      return (
                        <tr key={record.id}>
                          <td>{formatDate(record.date)}</td>
                          <td>
                            <Badge
                              variant={
                                record.type === 'payment'
                                  ? 'success'
                                  : record.type === 'refund'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {record.type === 'payment' ? '收入' : record.type === 'refund' ? '退费' : '支出'}
                            </Badge>
                          </td>
                          <td>{student?.name || '-'}</td>
                          <td>{record.category}</td>
                          <td className={record.type === 'payment' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {record.type === 'payment' ? '+' : ''}
                            {formatCurrency(record.amount)}
                          </td>
                          <td className="text-slate-500">{record.remark}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="refunds">
              {approveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {approveError}
                </div>
              )}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>申请日期</th>
                      <th>学员</th>
                      <th>退费金额</th>
                      <th>退费原因</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundRecords.map((record) => {
                      const student = students.find((s) => s.id === record.studentId);
                      return (
                        <tr key={record.id}>
                          <td>{formatDate(record.date)}</td>
                          <td>{student?.name || '-'}</td>
                          <td className="text-red-600 font-medium">-{formatCurrency(record.amount)}</td>
                          <td className="max-w-xs truncate">{record.reason}</td>
                          <td>
                            <Badge
                              variant={
                                record.status === 'approved'
                                  ? 'success'
                                  : record.status === 'rejected'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {getStatusName(record.status)}
                            </Badge>
                          </td>
                          <td>
                            {record.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleApproveRefund(record.id)}>
                                  通过
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => updateRefundStatus(record.id, 'rejected')}>
                                  拒绝
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>登记收费</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="label">选择学员</label>
              <Select value={paymentForm.studentId} onValueChange={(value) => setPaymentForm({ ...paymentForm, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择学员" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">收费金额</label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="请输入金额"
              />
            </div>
            <div>
              <label className="label">收费类别</label>
              <Select value={paymentForm.category} onValueChange={(value) => setPaymentForm({ ...paymentForm, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="学费">学费</SelectItem>
                  <SelectItem value="报名费">报名费</SelectItem>
                  <SelectItem value="考级费">考级费</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">备注</label>
              <Input
                value={paymentForm.remark}
                onChange={(e) => setPaymentForm({ ...paymentForm, remark: e.target.value })}
                placeholder="请输入备注"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsPaymentDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddPayment}>确认收费</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申请退费</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {refundError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {refundError}
              </div>
            )}
            <div>
              <label className="label">选择学员</label>
              <Select
                value={refundForm.studentId}
                onValueChange={(value) => {
                  setRefundForm({ ...refundForm, studentId: value });
                  setRefundError('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择学员" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => {
                    const refundable = getStudentRefundable(student.id);
                    return (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} (可退: {formatCurrency(refundable)})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {refundForm.studentId && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  可退余额：<span className="font-semibold">{formatCurrency(getStudentRefundable(refundForm.studentId))}</span>
                </p>
              </div>
            )}
            <div>
              <label className="label">退费金额</label>
              <Input
                type="number"
                value={refundForm.amount}
                onChange={(e) => {
                  setRefundForm({ ...refundForm, amount: e.target.value });
                  setRefundError('');
                }}
                placeholder="请输入金额"
              />
            </div>
            <div>
              <label className="label">退费原因</label>
              <Input
                value={refundForm.reason}
                onChange={(e) => {
                  setRefundForm({ ...refundForm, reason: e.target.value });
                  setRefundError('');
                }}
                placeholder="请输入退费原因"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRefundDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddRefund}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
