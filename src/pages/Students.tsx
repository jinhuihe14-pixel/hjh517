import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
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
import { useAppStore } from '../store';
import type { Student } from '../types';
import { getStatusName, formatDate, formatCurrency } from '../utils';

export const Students: React.FC = () => {
  const { students, channels, addStudent, updateStudent, deleteStudent } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    parentName: '',
    channelId: '',
    status: 'active' as Student['status'],
    remainingHours: '',
    totalHours: '',
    totalPaid: '',
    courseId: '',
  });

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      age: '',
      phone: '',
      parentName: '',
      channelId: '',
      status: 'active',
      remainingHours: '',
      totalHours: '',
      totalPaid: '',
      courseId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age.toString(),
      phone: student.phone,
      parentName: student.parentName,
      channelId: student.channelId,
      status: student.status,
      remainingHours: student.remainingHours.toString(),
      totalHours: student.totalHours.toString(),
      totalPaid: student.totalPaid.toString(),
      courseId: student.courseId || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const studentData = {
      name: formData.name,
      age: parseInt(formData.age) || 0,
      phone: formData.phone,
      parentName: formData.parentName,
      channelId: formData.channelId,
      enrollmentDate: editingStudent?.enrollmentDate || new Date().toISOString().split('T')[0],
      status: formData.status,
      remainingHours: parseInt(formData.remainingHours) || 0,
      totalHours: parseInt(formData.totalHours) || 0,
      totalPaid: parseInt(formData.totalPaid) || 0,
      courseId: formData.courseId || undefined,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该学员吗？')) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>学员管理</CardTitle>
            <Button onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              添加学员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索学员姓名或家长姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>学员信息</th>
                  <th>年龄</th>
                  <th>招生渠道</th>
                  <th>报名日期</th>
                  <th>课时</th>
                  <th>缴费金额</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const channel = channels.find((c) => c.id === student.channelId);
                  return (
                    <tr key={student.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.parentName} · {student.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td>{student.age}岁</td>
                      <td>
                        <Badge variant="secondary">{channel?.name || '-'}</Badge>
                      </td>
                      <td>{formatDate(student.enrollmentDate)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{student.remainingHours}/{student.totalHours}课时</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span>{formatCurrency(student.totalPaid)}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={student.status === 'active' ? 'success' : student.status === 'suspended' ? 'warning' : student.status === 'refunded' ? 'danger' : 'secondary'}>
                          {getStatusName(student.status)}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(student)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              暂无学员数据
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingStudent ? '编辑学员' : '添加学员'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="label">学员姓名</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="label">年龄</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="请输入年龄"
              />
            </div>
            <div>
              <label className="label">联系电话</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入电话"
              />
            </div>
            <div>
              <label className="label">家长姓名</label>
              <Input
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="请输入家长姓名"
              />
            </div>
            <div>
              <label className="label">招生渠道</label>
              <Select value={formData.channelId} onValueChange={(value) => setFormData({ ...formData, channelId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择渠道" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">学员状态</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Student['status'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">在读</SelectItem>
                  <SelectItem value="suspended">停课</SelectItem>
                  <SelectItem value="graduated">结业</SelectItem>
                  <SelectItem value="refunded">已退费</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">总课时</label>
              <Input
                type="number"
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
                placeholder="请输入总课时"
              />
            </div>
            <div>
              <label className="label">剩余课时</label>
              <Input
                type="number"
                value={formData.remainingHours}
                onChange={(e) => setFormData({ ...formData, remainingHours: e.target.value })}
                placeholder="请输入剩余课时"
              />
            </div>
            <div>
              <label className="label">缴费金额</label>
              <Input
                type="number"
                value={formData.totalPaid}
                onChange={(e) => setFormData({ ...formData, totalPaid: e.target.value })}
                placeholder="请输入缴费金额"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingStudent ? '保存修改' : '添加学员'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
