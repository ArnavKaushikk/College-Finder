import Link from 'next/link';
import AskQuestionForm from '@/components/qa/AskQuestionForm';

export default function NewQuestionPage() {
  return (
    <div className="space-y-4">
      <Link href="/qa" className="text-sm text-indigo-600 hover:underline">
        ← Back to Q&A
      </Link>
      <AskQuestionForm />
    </div>
  );
}
