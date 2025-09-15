import OperationForm from '@/components/operation-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            IDC 操作中心
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            自信地创建和安排服务器操作。
          </p>
        </header>
        <OperationForm />
      </div>
    </main>
  );
}
