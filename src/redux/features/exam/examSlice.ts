import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type TQuestion = {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'text';
  options?: string[];
};

export type TExam = {
  id: string;
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: number;
  questionType: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  negativeMarking: boolean;
  questions: TQuestion[];
};

type TExamState = {
  exams: TExam[];
  activeExam: TExam | null;
};

const initialState: TExamState = {
  exams: [
    {
      id: '1',
      title: 'Senior Frontend React Developer',
      totalCandidates: 45,
      totalSlots: 5,
      questionSets: 3,
      questionType: 'Multiple Choice',
      startTime: '2026-04-12T10:00:00',
      endTime: '2026-04-12T12:00:00',
      duration: 60,
      negativeMarking: true,
      questions: [],
    },
    {
      id: '2',
      title: 'Node.js Backend Engineer',
      totalCandidates: 30,
      totalSlots: 3,
      questionSets: 2,
      questionType: 'Coding & MCQs',
      startTime: '2026-04-13T14:00:00',
      endTime: '2026-04-13T16:00:00',
      duration: 90,
      negativeMarking: false,
      questions: [],
    },
  ],
  activeExam: null,
};

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExams: (state, action: PayloadAction<TExam[]>) => {
      state.exams = action.payload;
    },
    addExam: (state, action: PayloadAction<TExam>) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action: PayloadAction<TExam>) => {
      const index = state.exams.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    deleteExam: (state, action: PayloadAction<string>) => {
      state.exams = state.exams.filter((e) => e.id !== action.payload);
    },
    setActiveExam: (state, action: PayloadAction<TExam | null>) => {
      state.activeExam = action.payload;
    },
  },
});

export const {setExams, addExam, updateExam, deleteExam, setActiveExam} = examSlice.actions;
export default examSlice.reducer;
