import QuestionThread from '@/components/qa/QuestionThread';

export default async function QuestionPage({ params }) {
  const { id } = await params;
  return <QuestionThread questionId={id} />;
}
