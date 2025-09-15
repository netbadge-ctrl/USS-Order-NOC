import ServerTable from '@/components/server-table';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">第一步：选择服务器</h1>
      <ServerTable />
    </div>
  );
}
