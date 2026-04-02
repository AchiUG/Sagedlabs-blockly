
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from '@/components/navigation/header';
import Link from 'next/link';
import { BookOpen, PlusCircle, ArrowLeft, Edit, Trash2, Video, FileText, Clock, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CourseContentManagementProps {
  course: any;
}

export default function CourseContentManagement({ course: initialCourse }: CourseContentManagementProps) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState(false);
  const [isEditLessonDialogOpen, setIsEditLessonDialogOpen] = useState(false);
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false);
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: ''
  });

  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: ''
  });

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...moduleFormData,
          orderIndex: course.modules.length
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      const newModule = await response.json();
      setCourse({
        ...course,
        modules: [...course.modules, { ...newModule, lessons: [] }]
      });
      setIsModuleDialogOpen(false);
      setModuleFormData({ title: '', description: '' });
      toast.success('Module created successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create module');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${selectedModule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update module');
      }

      const updatedModule = await response.json();
      setCourse({
        ...course,
        modules: course.modules.map((m: any) => 
          m.id === updatedModule.id ? { ...m, ...updatedModule } : m
        )
      });
      setIsEditModuleDialogOpen(false);
      setSelectedModule(null);
      toast.success('Module updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update module');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${selectedModule.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      setCourse({
        ...course,
        modules: course.modules.filter((m: any) => m.id !== selectedModule.id)
      });
      setIsDeleteModuleDialogOpen(false);
      setSelectedModule(null);
      toast.success('Module deleted successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete module');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${selectedModule.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonFormData,
          orderIndex: selectedModule.lessons.length
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      const newLesson = await response.json();
      setCourse({
        ...course,
        modules: course.modules.map((m: any) => 
          m.id === selectedModule.id 
            ? { ...m, lessons: [...m.lessons, newLesson] }
            : m
        )
      });
      setIsLessonDialogOpen(false);
      setLessonFormData({ title: '', content: '', videoUrl: '', thumbnailUrl: '', duration: '' });
      toast.success('Lesson created successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${selectedModule.id}/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }

      const updatedLesson = await response.json();
      setCourse({
        ...course,
        modules: course.modules.map((m: any) => 
          m.id === selectedModule.id
            ? {
                ...m,
                lessons: m.lessons.map((l: any) => 
                  l.id === updatedLesson.id ? updatedLesson : l
                )
              }
            : m
        )
      });
      setIsEditLessonDialogOpen(false);
      setSelectedLesson(null);
      toast.success('Lesson updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${selectedModule.id}/lessons/${selectedLesson.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      setCourse({
        ...course,
        modules: course.modules.map((m: any) => 
          m.id === selectedModule.id
            ? {
                ...m,
                lessons: m.lessons.filter((l: any) => l.id !== selectedLesson.id)
              }
            : m
        )
      });
      setIsDeleteLessonDialogOpen(false);
      setSelectedLesson(null);
      toast.success('Lesson deleted successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModuleDialog = (module: any) => {
    setSelectedModule(module);
    setModuleFormData({
      title: module.title,
      description: module.description || ''
    });
    setIsEditModuleDialogOpen(true);
  };

  const openDeleteModuleDialog = (module: any) => {
    setSelectedModule(module);
    setIsDeleteModuleDialogOpen(true);
  };

  const openAddLessonDialog = (module: any) => {
    setSelectedModule(module);
    setLessonFormData({ title: '', content: '', videoUrl: '', thumbnailUrl: '', duration: '' });
    setIsLessonDialogOpen(true);
  };

  const openEditLessonDialog = (module: any, lesson: any) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      thumbnailUrl: lesson.thumbnailUrl || '',
      duration: lesson.duration?.toString() || ''
    });
    setIsEditLessonDialogOpen(true);
  };

  const openDeleteLessonDialog = (module: any, lesson: any) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setIsDeleteLessonDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Courses
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <Badge className={course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <p className="text-gray-600">
                Manage modules, lessons, and course content
              </p>
            </div>
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-gray-900">Create New Module</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Add a new module to organize your course content
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateModule}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="module-title" className="text-sm font-medium text-gray-900">Module Title *</Label>
                      <Input
                        id="module-title"
                        placeholder="e.g., Introduction to Variables and Data Types"
                        value={moduleFormData.title}
                        onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})}
                        required
                        className="w-full bg-white text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-description" className="text-sm font-medium text-gray-900">Description</Label>
                      <Textarea
                        id="module-description"
                        placeholder="What will students learn in this module?"
                        value={moduleFormData.description}
                        onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})}
                        rows={3}
                        className="w-full bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-red-600">
                      {isLoading ? 'Creating...' : 'Create Module'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {course.modules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your course by adding your first module
              </p>
              <Button 
                onClick={() => setIsModuleDialogOpen(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add First Module
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Course Content ({course.modules.length} modules)</CardTitle>
              <CardDescription>
                Organize your course into modules and lessons. Students will access content in this order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {course.modules.map((module: any, index: number) => (
                  <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div className="flex items-center space-x-3 text-left">
                          <span className="text-sm font-semibold text-gray-500">Module {index + 1}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <Badge variant="secondary">{module.lessons?.length || 0} lessons</Badge>
                        </div>
                      </AccordionTrigger>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddLessonDialog(module);
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Add Lesson
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModuleDialog(module);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModuleDialog(module);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent className="p-4 bg-white">
                      {module.description && (
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                      )}
                      {module.lessons?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No lessons yet. Click "Add Lesson" to get started.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson: any, lessonIndex: number) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3 flex-1">
                                {lesson.videoUrl ? (
                                  <Video className="w-5 h-5 text-orange-600" />
                                ) : (
                                  <FileText className="w-5 h-5 text-gray-600" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">Lesson {lessonIndex + 1}</span>
                                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  </div>
                                  {lesson.duration && (
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {lesson.duration} min
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditLessonDialog(module, lesson)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteLessonDialog(module, lesson)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Edit Module Dialog */}
        <Dialog open={isEditModuleDialogOpen} onOpenChange={setIsEditModuleDialogOpen}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900">Edit Module</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update module information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateModule}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-module-title" className="text-sm font-medium text-gray-900">Module Title *</Label>
                  <Input
                    id="edit-module-title"
                    value={moduleFormData.title}
                    onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})}
                    required
                    className="w-full bg-white text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-module-description" className="text-sm font-medium text-gray-900">Description</Label>
                  <Textarea
                    id="edit-module-description"
                    value={moduleFormData.description}
                    onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-white text-gray-900"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModuleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-red-600">
                  {isLoading ? 'Updating...' : 'Update Module'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Lesson Dialog */}
        <Dialog open={isLessonDialogOpen || isEditLessonDialogOpen} onOpenChange={(open) => {
          setIsLessonDialogOpen(open);
          setIsEditLessonDialogOpen(open);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900">
                {isEditLessonDialogOpen ? 'Edit Lesson' : 'Create New Lesson'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {isEditLessonDialogOpen ? 'Update lesson information' : 'Add a new lesson to this module'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={isEditLessonDialogOpen ? handleUpdateLesson : handleCreateLesson}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-title" className="text-sm font-medium text-gray-900">Lesson Title *</Label>
                  <Input
                    id="lesson-title"
                    placeholder="e.g., Understanding Variables in Python"
                    value={lessonFormData.title}
                    onChange={(e) => setLessonFormData({...lessonFormData, title: e.target.value})}
                    required
                    className="w-full bg-white text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-content" className="text-sm font-medium text-gray-900">Lesson Description</Label>
                  <Textarea
                    id="lesson-content"
                    placeholder="What will students learn in this lesson?"
                    value={lessonFormData.content}
                    onChange={(e) => setLessonFormData({...lessonFormData, content: e.target.value})}
                    rows={3}
                    className="w-full bg-white text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-videoUrl" className="text-sm font-medium text-gray-900">Video URL</Label>
                  <Input
                    id="lesson-videoUrl"
                    placeholder="https://riverside.fm/studio/... or https://youtube.com/watch?v=..."
                    value={lessonFormData.videoUrl}
                    onChange={(e) => setLessonFormData({...lessonFormData, videoUrl: e.target.value})}
                    className="w-full bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-600">Link to your video on Riverside, YouTube, Google Drive, or Vimeo</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-thumbnailUrl" className="text-sm font-medium text-gray-900">Thumbnail URL</Label>
                  <Input
                    id="lesson-thumbnailUrl"
                    placeholder="https://i.imgur.com/example.jpg"
                    value={lessonFormData.thumbnailUrl}
                    onChange={(e) => setLessonFormData({...lessonFormData, thumbnailUrl: e.target.value})}
                    className="w-full bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-600">Direct link to thumbnail image (upload to ImgBB or Imgur if needed)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-duration" className="text-sm font-medium text-gray-900">Duration (minutes)</Label>
                  <Input
                    id="lesson-duration"
                    type="number"
                    placeholder="e.g., 15"
                    value={lessonFormData.duration}
                    onChange={(e) => setLessonFormData({...lessonFormData, duration: e.target.value})}
                    className="w-full bg-white text-gray-900"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsLessonDialogOpen(false);
                  setIsEditLessonDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-red-600">
                  {isLoading ? (isEditLessonDialogOpen ? 'Updating...' : 'Creating...') : (isEditLessonDialogOpen ? 'Update Lesson' : 'Create Lesson')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Module Dialog */}
        <AlertDialog open={isDeleteModuleDialogOpen} onOpenChange={setIsDeleteModuleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Module?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the module <strong>{selectedModule?.title}</strong> and all its lessons.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteModule}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Module'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Lesson Dialog */}
        <AlertDialog open={isDeleteLessonDialogOpen} onOpenChange={setIsDeleteLessonDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the lesson <strong>{selectedLesson?.title}</strong>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLesson}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Lesson'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
