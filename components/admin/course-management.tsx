'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from '@/components/navigation/header';
import Link from 'next/link';
import { BookOpen, PlusCircle, Search, Edit, Trash2, ArrowLeft, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CourseManagementProps {
  courses: any[];
  instructors: any[];
}

export default function CourseManagement({ courses: initialCourses, instructors }: CourseManagementProps) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    instructorId: '',
    price: '',
    duration: '',
    level: 'BEGINNER',
    imageUrl: '',
    isPublished: false
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && course.isPublished) ||
                         (statusFilter === 'draft' && !course.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create course');
      }

      const newCourse = await response.json();
      setCourses([newCourse, ...courses]);
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        instructorId: '',
        price: '',
        duration: '',
        level: 'BEGINNER',
        imageUrl: '',
        isPublished: false
      });
      toast.success('Course created successfully!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const updatedCourse = await response.json();
      setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      toast.success('Course updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      toast.success('Course deleted successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      instructorId: course.instructorId || '',
      price: course.price?.toString() || '',
      duration: course.duration || '',
      level: course.level || 'BEGINNER',
      imageUrl: course.imageUrl || '',
      isPublished: course.isPublished
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (course: any) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
              </div>
              <p className="text-gray-600">
                Create, edit, and manage all platform courses
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-gray-900">Create New Course</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Add a new course to the platform. All fields marked with * are required.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse}>
                  <div className="grid gap-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-900">Course Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Introduction to Ancient Philosophy"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-900">Short Description</Label>
                        <Input
                          id="shortDescription"
                          placeholder="Brief one-liner about the course"
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                          className="w-full bg-white text-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-900">Full Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed course description, learning outcomes, and what students will gain..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          required
                          className="w-full bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Course Details</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="instructorId" className="text-sm font-medium text-gray-900">Instructor *</Label>
                          <Select
                            value={formData.instructorId}
                            onValueChange={(value) => setFormData({...formData, instructorId: value})}
                          >
                            <SelectTrigger className="w-full bg-white text-gray-900">
                              <SelectValue placeholder="Select instructor" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {instructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.id}>
                                  {instructor.name} ({instructor.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level" className="text-sm font-medium text-gray-900">Level *</Label>
                          <Select
                            value={formData.level}
                            onValueChange={(value) => setFormData({...formData, level: value})}
                          >
                            <SelectTrigger className="w-full bg-white text-gray-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="BEGINNER">Beginner</SelectItem>
                              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                              <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-sm font-medium text-gray-900">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 8 weeks, 40 hours"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="w-full bg-white text-gray-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-sm font-medium text-gray-900">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full bg-white text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-900">Course Image URL</Label>
                        <Input
                          id="imageUrl"
                          placeholder="https://i.pinimg.com/736x/a8/3a/18/a83a180eebcb10a2e1e880d90123fe48.jpg"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          className="w-full bg-white text-gray-900"
                        />
                        <p className="text-xs text-gray-600">Paste a URL to an image hosted online</p>
                      </div>
                    </div>

                    {/* Publishing Options */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Publishing</h4>
                      
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="isPublished"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                          Publish immediately (make visible to students)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-red-600">
                      {isLoading ? 'Creating...' : 'Create Course'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
            <CardDescription>
              Manage all platform courses with full read/write access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex items-start justify-between p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <Badge className={course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}>
                        {course.isPublished ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    
                    {/* Course Description */}
                    {course.shortDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.shortDescription}
                      </p>
                    )}
                    {course.description && !course.shortDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                      <span className="font-medium">Instructor: {course.instructor?.name || 'Not assigned'}</span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course._count.enrollments} students
                      </span>
                      {course.duration && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </span>
                      )}
                      {course.price > 0 && (
                        <span className="font-semibold text-orange-600">
                          ${course.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="whitespace-nowrap bg-gradient-to-r from-orange-600 to-red-600"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Manage Content
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(course)}
                      className="whitespace-nowrap"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(course)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900">Edit Course</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update course information. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCourse}>
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-sm font-medium text-gray-900">Course Title *</Label>
                    <Input
                      id="edit-title"
                      placeholder="e.g., Introduction to Ancient Philosophy"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-shortDescription" className="text-sm font-medium text-gray-900">Short Description</Label>
                    <Input
                      id="edit-shortDescription"
                      placeholder="Brief one-liner about the course"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-sm font-medium text-gray-900">Full Description *</Label>
                    <Textarea
                      id="edit-description"
                      placeholder="Detailed course description..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      required
                      className="w-full bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Course Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-instructorId" className="text-sm font-medium text-gray-900">Instructor *</Label>
                      <Select
                        value={formData.instructorId}
                        onValueChange={(value) => setFormData({...formData, instructorId: value})}
                      >
                        <SelectTrigger className="w-full bg-white text-gray-900">
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {instructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              {instructor.name} ({instructor.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-level" className="text-sm font-medium text-gray-900">Level *</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => setFormData({...formData, level: value})}
                      >
                        <SelectTrigger className="w-full bg-white text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-duration" className="text-sm font-medium text-gray-900">Duration</Label>
                      <Input
                        id="edit-duration"
                        placeholder="e.g., 8 weeks, 40 hours"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="w-full bg-white text-gray-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-price" className="text-sm font-medium text-gray-900">Price ($)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-imageUrl" className="text-sm font-medium text-gray-900">Course Image URL</Label>
                    <Input
                      id="edit-imageUrl"
                      placeholder="https://i.pinimg.com/736x/08/7b/3a/087b3a4b4cf46d58bb1ed5c7b777cdf4.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-600">Paste a URL to an image hosted online</p>
                  </div>
                </div>

                {/* Publishing Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Publishing</h4>
                  
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="edit-isPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="edit-isPublished" className="text-sm font-medium cursor-pointer">
                      Published (visible to students)
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-red-600">
                  {isLoading ? 'Updating...' : 'Update Course'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course
                <strong> {selectedCourse?.title}</strong> and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCourse}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Course'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
