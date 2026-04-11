'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Layers, LayoutGrid, Monitor, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    totalCandidates: number;
    totalSlots: number;
    questionSets: number;
  };
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="group relative overflow-hidden border-none bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1">
            Active Assessment
          </Badge>
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
            <LayoutGrid size={20} />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 mt-4 leading-tight group-hover:text-indigo-600 transition-colors">
          {exam.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Candidates</span>
              <span className="text-sm font-semibold">{exam.totalCandidates}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Layers size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Question Sets</span>
              <span className="text-sm font-semibold">{exam.questionSets}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Monitor size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Slots</span>
              <span className="text-sm font-semibold">{exam.totalSlots}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-slate-50">
        <Button className="w-full h-11 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all gap-2 group/btn">
          <span>View Candidates</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
