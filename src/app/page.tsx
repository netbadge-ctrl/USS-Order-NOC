import OperationForm from '@/components/operation-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            IDC Ops Center
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create and schedule server operations with confidence.
          </p>
        </header>
        <OperationForm />
      </div>
    </main>
  );
}
