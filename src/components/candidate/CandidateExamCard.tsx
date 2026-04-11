'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CandidateExamCardProps {
  exam: {
    id: string;
    title: string;
    duration: number;
    _count?: {
      questions: number;
    };
    startTime: string;
  };
}

export default function CandidateExamCard({ exam }: CandidateExamCardProps) {
  const formattedDate = new Date(exam.startTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group border-none bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 py-1">
          Available
        </Badge>
      </div>
      
      <CardHeader className="pb-4 pt-8">
        <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
          {exam.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100/50">
            <Clock size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold">{exam.duration} Minutes</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100/50">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-sm font-semibold">{exam._count?.questions || 0} Questions</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100/50">
            <Calendar size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-8">
        <Link href={`/candidate/exam/${exam.id}`} className="w-full">
          <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group/btn">
            <span>Start Assessment</span>
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
