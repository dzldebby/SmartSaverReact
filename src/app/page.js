import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Bank Interest Calculator</h1>
      <p className="text-lg mb-8">Find the best savings account for your money.</p>
      
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <Calculator />
      </div>
    </main>
  );
}