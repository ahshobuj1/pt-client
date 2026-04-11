'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/redux/hooks';
import { addExam, TQuestion } from '@/redux/features/exam/examSlice';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperSeparator } from '@/components/ui/stepper';
import { toast } from 'sonner';
import QuestionModal from '@/components/employer/QuestionModal';
import { Trash2, Edit, Plus } from 'lucide-react';

const step1Schema = z.object({
  title: z.string().min(1, 'Title is required'),
  totalCandidates: z.coerce.number().min(1),
  totalSlots: z.coerce.number().min(1),
  questionSets: z.coerce.number().min(1),
  questionType: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  duration: z.coerce.number().min(1),
  negativeMarking: z.boolean().default(false),
});

export default function CreateTestPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TQuestion | null>(null);
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema) as any,
    defaultValues: {
      title: '',
      totalCandidates: 100,
      totalSlots: 1,
      questionSets: 1,
      questionType: 'Multiple Choice',
      startTime: '',
      endTime: '',
      duration: 60,
      negativeMarking: false,
    },
  });

  const onStep1Submit = () => {
    setActiveStep(1);
  };

  const handleAddQuestion = (question: TQuestion) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? question : q));
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, question]);
    }
  };

  const handleEditQuestion = (question: TQuestion) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleFinalSubmit = () => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const examData = {
      id: Math.random().toString(36).substr(2, 9),
      ...form.getValues(),
      questions,
    };

    dispatch(addExam(examData));
    toast.success('Test created successfully!');
    router.push('/employer');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Online Test</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to set up your assessment.</p>
      </div>

      <Stepper value={activeStep} onValueChange={setActiveStep}>
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Basic Info</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={1}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Question Sets</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>

      <div className="bg-card border rounded-xl p-8 shadow-sm">
        {activeStep === 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onStep1Submit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Test Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Backend Developer Assessment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalCandidates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Candidates</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Slots</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Multiple Choice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="negativeMarking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Negative Marking</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Next: Question Sets</Button>
              </div>
            </form>
          </Form>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Manage Questions</h2>
              <Button onClick={() => { setEditingQuestion(null); setIsModalOpen(true); }} size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Q{index + 1}.</span>
                    <span className="ml-2 font-medium">{q.title}</span>
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(q)}>
                      <Edit className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No questions added yet.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setActiveStep(0)}>Back</Button>
              <Button onClick={handleFinalSubmit}>Create Test</Button>
            </div>
          </div>
        )}
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddQuestion}
        initialData={editingQuestion}
      />
    </div>
  );
}
