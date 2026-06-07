import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store';
import type { Teacher } from '../types';
import { formatCurrency, getCourseTypeName } from '../utils';

export const Teachers: React.FC = () => {
  const { teachers, teachingRecords, addTeacher, updateTeacher, deleteTeacher } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hourlyRate: '',
    courseTypes: [] as string[],
  });

  const handleAddClick = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      phone: '',
      hourlyRate: '',
      courseTypes: [],
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      phone: teacher.phone,
      hourlyRate: teacher.hourlyRate.toString(),
      courseTypes: teacher.courseTypes,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const teacherData = {
      name: formData.name,
      phone: formData.phone,
      hourlyRate: parseInt(formData.hourlyRate) || 0,
      courseTypes: formData.courseTypes as any,
      totalTaughtHours: editingTeacher?.totalTaughtHours || 0,
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, teacherData);
    } else {
      addTeacher(teacherData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该教师吗？')) {
      deleteTeacher(id);
    }
  };

  const getTeacherTeachingHours = (teacherId: string) => {
    return teachingRecords
      .filter((tr) => tr.teacherId === teacherId)
      .reduce((sum, tr) => sum + tr.hours, 0);
  };

  const getTeacherSalary = (teacherId: string, hourlyRate: number) => {
    const hours = getTeacherTeachingHours(teacherId);
    return hours * hourlyRate;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>教师管理</CardTitle>
            <Button onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              添加教师
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => {
              const totalHours = getTeacherTeachingHours(teacher.id);
              const totalSalary = getTeacherSalary(teacher.id, teacher.hourlyRate);
              
              return (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">{teacher.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Phone className="w-3 h-3" />
                            <span>{teacher.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(teacher)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <DollarSign className="w-4 h-4" />
                          <span>课时费</span>
                        </div>
                        <span className="font-medium">{formatCurrency(teacher.hourlyRate)}/课时</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>授课时长</span>
                        </div>
                        <span className="font-medium">{totalHours}小时</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">授课类型</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {teacher.courseTypes.map((type) => (
                          <Badge key={type} variant="accent">
                            {getCourseTypeName(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">累计薪酬</span>
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(totalSalary)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>授课记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>授课教师</th>
                  <th>课程</th>
                  <th>授课时长</th>
                  <th>上课人数</th>
                  <th>课时费</th>
                </tr>
              </thead>
              <tbody>
                {[...teachingRecords].reverse().map((record) => {
                  const teacher = teachers.find((t) => t.id === record.teacherId);
                  return (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium">
                            {teacher?.name.charAt(0)}
                          </div>
                          <span>{teacher?.name}</span>
                        </div>
                      </td>
                      <td>{record.courseId}</td>
                      <td>{record.hours}小时</td>
                      <td>{record.studentIds.length}人</td>
                      <td className="font-medium text-green-600">
                        {formatCurrency(record.hours * (teacher?.hourlyRate || 0))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeacher ? '编辑教师' : '添加教师'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="label">教师姓名</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
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
              <label className="label">课时费 (元/小时)</label>
              <Input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="请输入课时费"
              />
            </div>
            <div>
              <label className="label">授课类型</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['beginner', 'intermediate', 'exam'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (formData.courseTypes.includes(type)) {
                        setFormData({
                          ...formData,
                          courseTypes: formData.courseTypes.filter((t) => t !== type),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          courseTypes: [...formData.courseTypes, type],
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      formData.courseTypes.includes(type)
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {getCourseTypeName(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingTeacher ? '保存修改' : '添加教师'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
