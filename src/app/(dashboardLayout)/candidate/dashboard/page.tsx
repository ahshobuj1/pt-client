'use client';

import { useGetCandidateExamsQuery } from '@/redux/api/assessment.api';
import CandidateExamCard from '@/components/candidate/CandidateExamCard';
import { Loader2, GraduationCap, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CandidateDashboardPage() {
  const { data: response, isLoading, isError } = useGetCandidateExamsQuery(undefined);
  const exams = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md border-rose-100 bg-rose-50/50">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h3 className="text-xl font-bold text-slate-900">Failed to load assessments</h3>
            <p className="text-slate-500">We encountered an error while fetching your assigned assessments. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">Refresh Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
              <GraduationCap size={16} />
              <span>Candidate Portal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Available Assessments</h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
              Welcome back! Here are the assessments assigned to you. Ensure you are in a quiet environment before starting.
            </p>
          </div>
          
          <div className="w-full md:w-80 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <Input 
              placeholder="Search assessments..." 
              className="h-14 pl-12 pr-4 bg-white/70 backdrop-blur-md border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 transition-all text-lg" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 min-w-max">Your Tests</h2>
          <div className="h-px w-full bg-slate-100" />
          <div className="bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm text-sm font-bold text-slate-600">
            {exams.length} Assigned
          </div>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam: any) => (
              <CandidateExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
            <div className="p-8 bg-slate-50 rounded-[2rem] text-slate-300">
              <GraduationCap size={48} strokeWidth={1} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Perfectly Clear!</h3>
              <p className="text-slate-500 max-w-sm font-medium">No assessments are currently assigned to your account. Check back later or contact your instructor.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-indigo-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">Prepare for Success</h2>
            <ul className="space-y-4">
              {[
                "Stable internet connection is required",
                "Total focus: Tab switching is monitored",
                "Ensure your camera and mic are ready (if requested)",
                "Assessments are timed: Watch the countdown"
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-4 text-indigo-100 font-medium">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 max-w-xs">
              <p className="text-indigo-100 text-sm italic font-medium">
                "Preparation and focus are the keys to demonstrating your true potential. Good luck with your assessments!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500" />
                <div className="text-xs">
                  <div className="font-bold">Platform Admin</div>
                  <div className="text-indigo-300">System generated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
