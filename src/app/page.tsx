
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
import { Textarea } from '@/components/ui/textarea';
import ServerTable from '@/components/server-table';
import type { Server, OperationId } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X } from 'lucide-react';

const operations: {
  id: string;
  name: string;
}[] = [
  { id: 'relocation', name: '搬迁' },
  { id: 'install-system', name: '安装系统' },
  { id: 'hardware-change', name: '硬件变更' },
  { id: 'additional-ops', name: '附加操作' },
];

type OperationGroup = {
  id: number;
  servers: Server[];
  operationId: string;
  notes: string;
};

export default function Home() {
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [operationGroups, setOperationGroups] = useState<OperationGroup[]>([]);
  const [nextGroupId, setNextGroupId] = useState(1);

  const unassignedServers = selectedServers.filter(
    (server) =>
      !operationGroups.some((group) =>
        group.servers.some((s) => s.id === server.id)
      )
  );

  const addOperationGroup = () => {
    setOperationGroups([
      ...operationGroups,
      {
        id: nextGroupId,
        servers: [],
        operationId: 'relocation',
        notes: '',
      },
    ]);
    setNextGroupId(nextGroupId + 1);
  };

  const removeOperationGroup = (groupId: number) => {
    setOperationGroups(operationGroups.filter((group) => group.id !== groupId));
  };

  const addServerToGroup = (groupId: number, server: Server) => {
    setOperationGroups(
      operationGroups.map((group) => {
        if (group.id === groupId) {
          // Remove from other groups first to ensure exclusivity
          const updatedGroups = operationGroups.map(g => ({
            ...g,
            servers: g.servers.filter(s => s.id !== server.id)
          }));
          const currentGroup = updatedGroups.find(g => g.id === groupId)!;
          return { ...currentGroup, servers: [...currentGroup.servers, server] };
        }
        return group;
      })
    );
  };
  
  const removeServerFromGroup = (groupId: number, serverId: string) => {
    setOperationGroups(
      operationGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            servers: group.servers.filter((s) => s.id !== serverId),
          };
        }
        return group;
      })
    );
  };

  const setGroupOperation = (groupId: number, operationId: string) => {
    setOperationGroups(
      operationGroups.map((group) =>
        group.id === groupId ? { ...group, operationId } : group
      )
    );
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>第一步：选择服务器</CardTitle>
          <CardDescription>选择您需要操作的服务器。您可以选择多台服务器，然后将它们分组进行不同的操作。</CardDescription>
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
              创建操作组，将服务器分配到组中，并为每个组配置任务。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-medium">未分配的服务器</h3>
              <div className="p-4 bg-muted/50 rounded-md min-h-[80px]">
                {unassignedServers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {unassignedServers.map(server => (
                       <Badge key={server.id} variant="secondary" className="p-2">
                         {server.hostname}
                       </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">所有选中的服务器都已分配。</p>
                )}
              </div>
            </div>

            {operationGroups.map((group, groupIndex) => (
              <Card key={group.id} className="bg-background">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">操作组 #{groupIndex + 1}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeOperationGroup(group.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={['servers', 'operation-type', 'config-details', 'additional-notes']} className="w-full">
                    <AccordionItem value="servers">
                      <AccordionTrigger>组内服务器 ({group.servers.length})</AccordionTrigger>
                      <AccordionContent className="p-2">
                         <div className="p-4 bg-muted/50 rounded-md min-h-[80px] space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {group.servers.map(server => (
                                <Badge key={server.id} variant="outline" className="flex items-center gap-2 p-2">
                                  <span>{server.hostname}</span>
                                  <button onClick={() => removeServerFromGroup(group.id, server.id)} className="rounded-full hover:bg-muted-foreground/20">
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            {unassignedServers.length > 0 && <p className="text-sm text-muted-foreground">从下面拖拽或点击未分配的服务器添加到此组。</p>}
                             <div className="flex flex-wrap gap-2">
                                {unassignedServers.map(server => (
                                  <button key={server.id} onClick={() => addServerToGroup(group.id, server)}>
                                    <Badge variant="secondary" className="p-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                      {server.hostname}
                                    </Badge>
                                  </button>
                                ))}
                            </div>
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
                              variant={group.operationId === op.id ? 'default' : 'outline'}
                              onClick={() => setGroupOperation(group.id, op.id)}
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
                          {operations.find(o => o.id === group.operationId)?.name} 的详情表单将在这里。
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="additional-notes">
                      <AccordionTrigger>附加说明</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid w-full gap-2 p-1">
                          <Textarea placeholder="在此输入此操作组的任何特殊说明或评论..." />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
             <Button variant="outline" onClick={addOperationGroup} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              添加操作组
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-6">
            <Button variant="outline">保存草稿</Button>
            <Button>提交工单</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
