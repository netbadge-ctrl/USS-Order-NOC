import ServerTable from '@/components/server-table';
import OperationSelector from '@/components/operation-selector';

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-6">第一步：选择服务器</h1>
        <ServerTable />
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-6">第二步：选择操作</h1>
        <OperationSelector />
      </div>
    </div>
  );
}
