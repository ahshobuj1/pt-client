import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 group-hover:bg-indigo-700 transition-colors">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
      </div>
      <span className="text-xl font-black text-slate-900 tracking-tight uppercase">
        <span className="text-indigo-600">Exam</span>Engine
      </span>
    </Link>
  );
}
