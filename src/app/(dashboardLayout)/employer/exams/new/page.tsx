'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  LayoutPanelLeft,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  PlusCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateExamMutation, useCreateQuestionMutation } from '@/redux/api/assessment.api';
import { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator } from '@/components/ui/stepper';

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  totalCandidates: z.coerce.number().min(1),
  totalSlots: z.coerce.number().min(1),
  questionSets: z.coerce.number().min(1),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.coerce.number().min(1),
});

const questionSchema = z.object({
  questionTitle: z.string().min(1, 'Question title is required'),
  type: z.enum(['RADIO', 'CHECKBOX', 'TEXT']),
  options: z.array(z.string()).min(2, 'At least 2 options required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export default function CreateExamPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [examId, setExamId] = useState<string | null>(null);

  const [createExam, { isLoading: isCreatingExam }] = useCreateExamMutation();
  const [createQuestion, { isLoading: isCreatingQuestion }] = useCreateQuestionMutation();

  const examForm = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema) as any,
    defaultValues: {
      title: '',
      totalCandidates: 100,
      totalSlots: 50,
      questionSets: 1,
      startTime: '',
      endTime: '',
      duration: 60,
    },
  });

  const questionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionTitle: '',
      type: 'RADIO',
      options: ['', ''],
      correctAnswer: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: questionForm.control,
    name: 'options' as never,
  });

  const onExamSubmit = async (values: z.infer<typeof examSchema> | any) => {
    const toastId = toast.loading('Saving assessment settings...');
    try {
      const res = await createExam(values).unwrap();
      const id = res.data?.id || res.id;
      setExamId(id);
      setActiveStep(1);
      toast.success('Assessment settings saved!', { id: toastId });
    } catch (error) {
      toast.error('Failed to create assessment', { id: toastId });
    }
  };

  const onQuestionSubmit = async (values: z.infer<typeof questionSchema> | any) => {
    if (!examId) return;
    const toastId = toast.loading('Adding question...');
    try {
      await createQuestion({ ...values, examId }).unwrap();
      questionForm.reset();
      toast.success('Question added successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to add question', { id: toastId });
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create New Assessment</h1>
        <p className="text-slate-500 font-medium">Follow the steps below to set up your online assessment and add questions.</p>
      </div>

      <Stepper value={activeStep} onValueChange={setActiveStep} className="mb-12">
        <StepperItem step={0}>
          <StepperIndicator />
          <div className="flex flex-col gap-0.5">
            <StepperTitle>Basic Details</StepperTitle>
            <StepperDescription>Set assessment rules</StepperDescription>
          </div>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={1} disabled={!examId}>
          <StepperIndicator />
          <div className="flex flex-col gap-0.5">
            <StepperTitle>Add Questions</StepperTitle>
            <StepperDescription>Create evaluation sets</StepperDescription>
          </div>
        </StepperItem>
      </Stepper>

      {activeStep === 0 && (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <LayoutPanelLeft className="text-indigo-400" />
              <CardTitle className="text-2xl">Step 1: Assessment Configuration</CardTitle>
            </div>
            <CardDescription className="text-slate-400 font-medium">Define the core settings for your evaluation platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...examForm}>
              <form onSubmit={examForm.handleSubmit(onExamSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    control={examForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Assessment Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Frontend Engineer Test" {...field} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={examForm.control}
                  name="totalCandidates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Total Candidates</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={examForm.control}
                  name="totalSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Total Slots</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={examForm.control}
                  name="questionSets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Question Sets</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={examForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Duration (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={examForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={examForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2 pt-4">
                  <Button type="submit" disabled={isCreatingExam} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center gap-2">
                    {isCreatingExam ? <Loader2 className="animate-spin" /> : <><span>Save & Continue</span><ChevronRight size={20} /></>}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <HelpCircle />
                <CardTitle className="text-2xl">Step 2: Add Questions</CardTitle>
              </div>
              <CardDescription className="text-indigo-100 font-medium">Add questions one by one to your assessment. Exam ID: {examId}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...questionForm}>
                <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)} className="space-y-6">
                  <FormField
                    control={questionForm.control}
                    name="questionTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Question Text</FormLabel>
                        <FormControl>
                          <Input placeholder="What is the output of 1 + '1' in JavaScript?" {...field} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={questionForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Question Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="RADIO">Single Choice (Radio)</SelectItem>
                              <SelectItem value="CHECKBOX">Multiple Choice (Checkbox)</SelectItem>
                              <SelectItem value="TEXT">Short Text</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={questionForm.control}
                      name="correctAnswer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Correct Answer</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the correct answer exactly" {...field} className="h-12 rounded-xl border-indigo-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-bold text-slate-700">Options</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={() => append('')} className="bg-indigo-50 text-indigo-600 border-none hover:bg-indigo-100 font-bold">
                        <Plus size={16} className="mr-1" /> Add Option
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Input
                            {...questionForm.register(`options.${index}` as never)}
                            placeholder={`Option ${index + 1}`}
                            className="h-12 rounded-xl"
                          />
                          {fields.length > 2 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-rose-500 hover:bg-rose-50 h-12 w-12 rounded-xl">
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button type="submit" disabled={isCreatingQuestion} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl transition-all flex items-center gap-2">
                      {isCreatingQuestion ? <Loader2 className="animate-spin" /> : <><PlusCircle size={20} /><span>Add Question</span></>}
                    </Button>
                    <Button type="button" variant="outline" className="h-14 px-8 font-bold border-slate-200 text-slate-900 rounded-2xl shadow-sm hover:bg-white" onClick={() => (window.location.href = '/employer/dashboard')}>
                      <Save size={20} className="mr-2" />
                      Finish Creation
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Button variant="ghost" onClick={() => setActiveStep(0)} className="text-slate-400 hover:text-slate-600 font-bold">
            <ChevronLeft size={18} className="mr-1" /> Back to Assessment Settings
          </Button>
        </div>
      )}
    </div>
  );
}
