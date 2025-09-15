
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ServerTable from '@/components/server-table';
import type { Server, OperationId } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const operations: {
  id: OperationId;
  name: string;
}[] = [
  { id: 'reboot', name: '重装系统' },
  { id: 'run-script', name: '硬件更换' },
  { id: 'install-package', name: '网络配置' },
  { id: 'check-status', name: '固件更新' },
];

export default function Home() {
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<OperationId>('run-script');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>第一步：选择服务器</CardTitle>
          <CardDescription>选择您需要操作的服务器。</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerTable onSelectionChange={setSelectedServers} />
        </CardContent>
      </Card>

      {selectedServers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>第二步：定义工单</CardTitle>
            <CardDescription>
              配置要在所选服务器上执行的任务。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="multiple" defaultValue={['selected-servers', 'operation-type', 'config-details', 'additional-notes']} className="w-full">
              <AccordionItem value="selected-servers">
                <AccordionTrigger>已选服务器 ({selectedServers.length})</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/50 rounded-md">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {selectedServers.map((server) => (
                        <li key={server.id}>
                          {server.hostname} ({server.ipAddress})
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="operation-type">
                <AccordionTrigger>操作类型</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
                    {operations.map((op) => (
                      <Button
                        key={op.id}
                        variant={selectedOperation === op.id ? 'default' : 'outline'}
                        onClick={() => setSelectedOperation(op.id)}
                      >
                        {op.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="config-details">
                <AccordionTrigger>配置详情</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 text-sm text-muted-foreground">
                    硬件更换详情表单将在这里。
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="additional-notes">
                <AccordionTrigger>附加说明</AccordionTrigger>
                <AccordionContent>
                  <div className="grid w-full gap-2 p-1">
                    <Textarea placeholder="在此输入任何特殊说明或评论..." />
                  </div>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="review-and-submit">
                <AccordionTrigger>审查并提交</AccordionTrigger>
                <AccordionContent>
                   {/* This section is intentionally empty as per the design */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">保存草稿</Button>
            <Button>提交工单</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
