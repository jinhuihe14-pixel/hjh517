import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Users, DollarSign, Calendar } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store';
import type { Course } from '../types';
import { getCourseTypeName, formatCurrency } from '../utils';

export const Courses: React.FC = () => {
  const { courses, teachers, addCourse, updateCourse, deleteCourse, getCourseProfits, students } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'beginner' as Course['type'],
    pricePerHour: '',
    totalHours: '',
    teacherId: '',
    schedule: '',
    maxStudents: '',
    venueCost: '',
  });

  const courseProfits = getCourseProfits();

  const handleAddClick = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      type: 'beginner',
      pricePerHour: '',
      totalHours: '',
      teacherId: '',
      schedule: '',
      maxStudents: '',
      venueCost: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      type: course.type,
      pricePerHour: course.pricePerHour.toString(),
      totalHours: course.totalHours.toString(),
      teacherId: course.teacherId,
      schedule: course.schedule,
      maxStudents: course.maxStudents.toString(),
      venueCost: course.venueCost.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const courseData = {
      name: formData.name,
      type: formData.type,
      pricePerHour: parseInt(formData.pricePerHour) || 0,
      totalHours: parseInt(formData.totalHours) || 0,
      teacherId: formData.teacherId,
      schedule: formData.schedule,
      maxStudents: parseInt(formData.maxStudents) || 0,
      currentStudents: editingCourse?.currentStudents || 0,
      venueCost: parseInt(formData.venueCost) || 0,
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该课程吗？')) {
      deleteCourse(id);
    }
  };

  const getCourseStudents = (courseId: string) => {
    return students.filter((s) => s.courseId === courseId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>课程管理</CardTitle>
            <Button onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              添加课程
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => {
              const teacher = teachers.find((t) => t.id === course.teacherId);
              const profit = courseProfits.find((p) => p.courseId === course.id);
              const courseStudents = getCourseStudents(course.id);
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">{course.name}</h3>
                        <Badge variant="accent" className="mt-1">
                          {getCourseTypeName(course.type)}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(course)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <DollarSign className="w-4 h-4" />
                          <span>课时单价</span>
                        </div>
                        <span className="font-medium">{formatCurrency(course.pricePerHour)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>总课时</span>
                        </div>
                        <span className="font-medium">{course.totalHours}课时</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Users className="w-4 h-4" />
                          <span>学员人数</span>
                        </div>
                        <span className="font-medium">{courseStudents.length}/{course.maxStudents}人</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>排课时间</span>
                        </div>
                        <span className="font-medium text-xs">{course.schedule}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">授课教师</span>
                        <span className="text-sm font-medium">{teacher?.name || '-'}</span>
                      </div>
                      {profit && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-slate-500">净利润</span>
                          <span className={`text-sm font-bold ${profit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profit.netProfit)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${(courseStudents.length / course.maxStudents) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-right">
                        满班率 {Math.round((courseStudents.length / course.maxStudents) * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCourse ? '编辑课程' : '添加课程'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="label">课程名称</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入课程名称"
              />
            </div>
            <div>
              <label className="label">课程类型</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Course['type'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">启蒙班</SelectItem>
                  <SelectItem value="intermediate">进阶班</SelectItem>
                  <SelectItem value="exam">考级班</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">授课教师</label>
              <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择教师" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label">课时单价 (元)</label>
              <Input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                placeholder="请输入单价"
              />
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
              <label className="label">最大人数</label>
              <Input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                placeholder="请输入最大人数"
              />
            </div>
            <div>
              <label className="label">场地成本 (元)</label>
              <Input
                type="number"
                value={formData.venueCost}
                onChange={(e) => setFormData({ ...formData, venueCost: e.target.value })}
                placeholder="请输入场地成本"
              />
            </div>
            <div className="col-span-2">
              <label className="label">排课时间</label>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="例如：周六日 10:00-11:30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingCourse ? '保存修改' : '添加课程'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
