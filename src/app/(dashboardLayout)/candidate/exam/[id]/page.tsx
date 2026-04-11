'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetExamQuestionsQuery,
  useSubmitAttemptMutation,
  useGetCandidateExamsQuery
} from '@/redux/api/assessment.api';
import { useBehavioralTracking } from '@/hooks/useBehavioralTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Lock
} from 'lucide-react';

export default function ExamScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const { data: examsRes } = useGetCandidateExamsQuery(undefined);
  const { data: questionsRes, isLoading: isLoadingQuestions } = useGetExamQuestionsQuery(id, { skip: !isExamStarted });
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const submitRef = useRef<() => void>(() => { });

  const { tabSwitchCount, fullscreenExitCount, enterFullScreen } = useBehavioralTracking(() => submitRef.current?.());

  const handleFinalSubmit = useCallback(async () => {
    const toastId = toast.loading('Finalizing and submitting your assessment...');
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer: Array.isArray(answer) ? answer.join(',') : String(answer),
    }));

    try {
      await submitAttempt({
        examId: id,
        tabSwitchCount,
        fullscreenExitCount,
        answers: formattedAnswers,
      }).unwrap();

      toast.success('Assessment submitted successfully!', { id: toastId });
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      router.push('/candidate/dashboard');
    } catch (error) {
      toast.error('Submission failed. Please contact support.', { id: toastId });
    }
  }, [id, answers, router, submitAttempt, tabSwitchCount, fullscreenExitCount]);

  useEffect(() => {
    submitRef.current = handleFinalSubmit;
  }, [handleFinalSubmit, submitRef]);

  useEffect(() => {
    if (examsRes?.data) {
      const currentExam = examsRes.data.find((e: any) => e.id === id);
      if (currentExam && timeLeft === null) {
        setTimeLeft(currentExam.duration * 60);
      }
    }
  }, [examsRes, id, timeLeft]);

  useEffect(() => {
    if (isExamStarted && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleFinalSubmit();
    }
  }, [isExamStarted, timeLeft, handleFinalSubmit]);

  const startExam = async () => {
    await enterFullScreen();
    setIsExamStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isExamStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-xl w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-indigo-600 text-white p-10 text-center">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-white" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">System Integrity Check</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-lg">Terms of Engagement:</h4>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li className="flex items-start gap-3">
                  <div className="min-w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <span>The assessment will run in Full Screen Mode.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <span>Tab switching is strictly monitored and will lead to auto-submission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <span>Exiting full screen will be flagged as a violation.</span>
                </li>
              </ul>
            </div>
            <Button onClick={startExam} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-2xl transition-all shadow-xl shadow-indigo-100">
              Enter Secure Exam Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = questionsRes?.data || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-20 bg-white border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Clock size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Remaining</span>
            <span className={`text-2xl font-black ${timeLeft && timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment Integrity</span>
            <span className="text-sm font-bold text-slate-600">{tabSwitchCount + fullscreenExitCount} Violations Detected</span>
          </div>
          <AlertTriangle className="text-amber-500" size={20} />
        </div>

        <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold flex gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /><span>End Exam</span></>}
        </Button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-12 space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-400 whitespace-nowrap">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {isLoadingQuestions ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : currentQuestion ? (
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
            <div className="p-8 lg:p-12 space-y-10">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                {currentQuestion.questionTitle}
              </h2>

              <div className="space-y-6">
                {currentQuestion.type === 'RADIO' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option: string, i: number) => (
                      <div key={i} className={`flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer ${answers[currentQuestion.id] === option ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                        <RadioGroupItem value={option} id={`q-${i}`} className="text-indigo-600" />
                        <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-bold text-slate-700 text-lg">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'CHECKBOX' && (
                  <div className="space-y-4">
                    {currentQuestion.options.map((option: string, i: number) => {
                      const currentAnswers = answers[currentQuestion.id] || [];
                      return (
                        <div key={i} className={`flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer ${currentAnswers.includes(option) ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                          <Checkbox
                            id={`q-${i}`}
                            checked={currentAnswers.includes(option)}
                            onCheckedChange={(checked) => {
                              const newSet = checked
                                ? [...currentAnswers, option]
                                : currentAnswers.filter((a: string) => a !== option);
                              setAnswers({ ...answers, [currentQuestion.id]: newSet });
                            }}
                          />
                          <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-bold text-slate-700 text-lg">{option}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'TEXT' && (
                  <Textarea
                    placeholder="Type your answer here..."
                    className="min-h-[200px] rounded-2xl border-2 border-slate-100 p-6 text-lg focus:border-indigo-600 transition-all font-medium"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  />
                )}
              </div>
            </div>

            <CardFooter className="bg-slate-50/50 p-8 flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="h-14 px-8 rounded-xl font-bold border-slate-200 text-slate-700"
              >
                <ChevronLeft className="mr-2" /> Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                  } else {
                    handleFinalSubmit();
                  }
                }}
                className="h-14 px-8 rounded-xl font-bold bg-slate-900 hover:bg-indigo-600 transition-colors"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish & Submit' : <>Next Question <ChevronRight className="ml-2" /></>}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-400">No questions available for this assessment.</h3>
          </div>
        )}
      </main>
    </div>
  );
}
