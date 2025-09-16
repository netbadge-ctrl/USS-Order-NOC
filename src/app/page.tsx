
'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const operations: {
  id: OperationId;
  name: string;
  subOps?: { id: string; name: string }[];
}[] = [
  { 
    id: 'relocation', 
    name: '搬迁 (变更机房&机架)',
    subOps: [{ id: 're-rack', name: '原机架位上架' }]
  },
  { id: 'install-system', name: '安装系统' },
  { id: 'hardware-change', name: '硬件变更' },
  { id: 'additional-ops', name: '附加操作' },
];

type OperationGroup = {
  id: number;
  servers: Server[];
  operationId: OperationId;
  subOperationId?: string;
  notes: string;
};

export default function Home() {
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [operationGroups, setOperationGroups] = useState<OperationGroup[]>([]);
  const [nextGroupId, setNextGroupId] = useState(1);
  
  useEffect(() => {
    if (selectedServers.length > 0 && operationGroups.length === 0) {
      addOperationGroup();
    }
    if (selectedServers.length === 0) {
        setOperationGroups([]);
    }
  }, [selectedServers, operationGroups.length]);


  const unassignedServers = selectedServers.filter(
    (server) =>
      !operationGroups.some((group) =>
        group.servers.some((s) => s.id === server.id)
      )
  );

  const addOperationGroup = () => {
    const newGroupId = nextGroupId;
    setOperationGroups([
      ...operationGroups,
      {
        id: newGroupId,
        servers: [],
        operationId: 'install-system',
        notes: '',
      },
    ]);
    setNextGroupId(newGroupId + 1);
  };

  const removeOperationGroup = (groupId: number) => {
    setOperationGroups(operationGroups.filter((group) => group.id !== groupId));
  };

  const addServerToGroup = (groupId: number, server: Server) => {
     const groupsWithServerRemoved = operationGroups.map(g => ({
        ...g,
        servers: g.servers.filter(s => s.id !== server.id)
    }));

    const updatedGroups = groupsWithServerRemoved.map((group) => {
      if (group.id === groupId) {
        return { ...group, servers: [...group.servers, server] };
      }
      return group;
    });

    setOperationGroups(updatedGroups);
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

  const setGroupOperation = (groupId: number, operationId: OperationId) => {
    setOperationGroups(
      operationGroups.map((group) =>
        group.id === groupId ? { ...group, operationId, subOperationId: undefined } : group
      )
    );
  };
  
  const setGroupSubOperation = (groupId: number, subOpId: string) => {
     setOperationGroups(
      operationGroups.map((group) =>
        group.id === groupId ? { ...group, subOperationId: subOpId } : group
      )
    );
  }

  const renderInstallSystemForm = () => (
    <div className="space-y-6 pt-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="os">操作系统</Label>
           <Select defaultValue="centos-7.6">
            <SelectTrigger id="os">
              <SelectValue placeholder="选择操作系统" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centos-7.6">CentOS 7.6-KVER5.4</SelectItem>
              <SelectItem value="ubuntu-22.04">Ubuntu 22.04 LTS</SelectItem>
              <SelectItem value="windows-server-2022">Windows Server 2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
          <Label htmlFor="raid">系统RAID</Label>
           <Select defaultValue="raid1">
            <SelectTrigger id="raid">
              <SelectValue placeholder="选择RAID级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raid0">RAID0</SelectItem>
              <SelectItem value="raid1">RAID1</SelectItem>
              <SelectItem value="raid5">RAID5</SelectItem>
              <SelectItem value="raid10">RAID10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="bond">BOND参数</Label>
         <Select defaultValue="mode4">
          <SelectTrigger id="bond">
            <SelectValue placeholder="选择BOND模式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mode1">mode1 (active-backup)</SelectItem>
            <SelectItem value="mode4">mode4 (3+4)</SelectItem>
            <SelectItem value="mode6">mode6 (balance-alb)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
            <Label>配置方式</Label>
            <RadioGroup defaultValue="target-model" className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="target-model" id="target-model" />
                    <Label htmlFor="target-model" className="font-normal">按目标机型</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-normal">自定义配置</Label>
                </div>
            </RadioGroup>
        </div>
         <div className="space-y-2">
            <Label htmlFor="target-model-select">目标机型</Label>
             <Select defaultValue="gpu-server">
                <SelectTrigger id="target-model-select">
                    <SelectValue placeholder="选择目标机型" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="gpu-server">高性能GPU服务器配置 (GPU)</SelectItem>
                    <SelectItem value="storage-server">大容量存储服务器配置</SelectItem>
                    <SelectItem value="compute-server">高计算性能服务器配置</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  );

  const renderRelocationForm = () => (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        <div className="flex items-center space-x-4">
          <Label>是否混布</Label>
          <RadioGroup defaultValue="no" className="flex">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mixed-no" />
              <Label htmlFor="mixed-no" className="font-normal">否</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="mixed-yes" />
              <Label htmlFor="mixed-yes" className="font-normal">是</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="col-start-4 flex items-center justify-end space-x-2">
          <Checkbox id="rdma" />
          <Label htmlFor="rdma" className="font-normal">RDMA网络开启</Label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="datacenter">机房</Label>
          <Select defaultValue="qyyc01">
            <SelectTrigger id="datacenter">
              <SelectValue placeholder="选择机房" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qyyc01">QYYC01-庆阳云创机房</SelectItem>
              <SelectItem value="bj01">BJ01-北京A数据中心</SelectItem>
              <SelectItem value="sh01">SH01-上海B数据中心</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="multi-tor">多机柜多TOR</Label>
          <Select defaultValue="all">
            <SelectTrigger id="multi-tor">
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="option1">选项1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="network-props">网络属性</Label>
          <Select defaultValue="all">
            <SelectTrigger id="network-props">
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
               <SelectItem value="option1">选项1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="rack-props">机柜业务属性</Label>
          <Select defaultValue="all">
            <SelectTrigger id="rack-props">
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="option1">选项1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea id="description" placeholder="输入描述..." />
      </div>
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <AlertDescription>
          <h5 className="font-bold mb-2">IDC机房搬迁物流提示:</h5>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>常规搬迁日: 工作日一、三、五, 12:00前工单至RA安排最近搬迁日, 12:00后工单至RA安排下一搬迁日</li>
            <li>紧急搬迁(工单选紧急): 12:00前工单至RA安排当日; 12:00后工单至RA安排下一工作日</li>
            <li>搬迁时效: 同城当日达, 异地搬迁3-7日达</li>
            <li>附加说明: 搬迁依赖物流车辆、机房手续、天气、路况等因素</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderHardwareChangeForm = () => (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
            <Label>配置方式</Label>
            <RadioGroup defaultValue="target-model" className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="target-model" id="hw-target-model" />
                    <Label htmlFor="hw-target-model" className="font-normal">按目标机型</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="hw-custom" />
                    <Label htmlFor="hw-custom" className="font-normal">自定义配置</Label>
                </div>
            </RadioGroup>
        </div>
         <div className="space-y-2">
            <Label htmlFor="hw-target-model-select">目标机型</Label>
             <Select defaultValue="gpu-server">
                <SelectTrigger id="hw-target-model-select">
                    <SelectValue placeholder="选择目标机型" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="gpu-server">高性能GPU服务器配置 (GPU)</SelectItem>
                    <SelectItem value="storage-server">大容量存储服务器配置</SelectItem>
                    <SelectItem value="compute-server">高计算性能服务器配置</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="p-4 bg-muted/50 rounded-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">目标CPU</p>
                <p className="font-medium">Intel_8358P*2 (64核128线程)</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">目标内存</p>
                <p className="font-medium">64G_3200 * 16</p>
            </div>
            <div className="space-y-1 col-span-2">
                <p className="text-sm text-muted-foreground">目标硬盘/存储</p>
                <p className="font-medium">SATA2.5_480G * 2 + NVME2.5_7.68T * 2</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">VPC网络</p>
                <p className="font-medium">25GE_2 * 1</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm text-muted-foreground">计算网络</p>
                <p className="font-medium">NVLINK_80G * 8</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">存储网络</p>
                <p className="font-medium">-</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm text-muted-foreground">目标GPU</p>
                <p className="font-medium">GM302*8</p>
            </div>
        </div>
      </div>
    </div>
  );

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
        <>
        <Card>
            <CardHeader>
                <CardTitle>第二步：配置工单详情</CardTitle>
                <CardDescription>为已选服务器配置任务批次和具体操作。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">1. 工单全局设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label>紧急程度</Label>
                            <RadioGroup defaultValue="normal" className="flex items-center pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="normal" id="normal" />
                                    <Label htmlFor="normal" className="font-normal">普通</Label>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <RadioGroupItem value="urgent" id="urgent" />
                                    <Label htmlFor="urgent" className="font-normal">紧急</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2 col-span-1">
                            <Label htmlFor="customer">客户</Label>
                            <Input id="customer" placeholder="例如: 内部测试部门" />
                        </div>
                            <div className="space-y-2 col-span-1">
                            <Label htmlFor="uid">UID</Label>
                            <Input id="uid" placeholder="例如: 12345678" />
                        </div>
                            <div className="space-y-2 col-span-1 flex items-end pb-2">
                            <Label htmlFor="led" className="text-sm">Led</Label>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-6">
                    <h3 className="text-lg font-semibold">2. 配置任务批次</h3>
                    
                    <div className="space-y-4">
                        <h3 className="font-medium">未分配的服务器</h3>
                        <div className="p-4 bg-muted/50 rounded-md min-h-[60px]">
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
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-lg">创建任务批次 #{groupIndex + 1}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => removeOperationGroup(group.id)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2 text-sm">1. 从待分配的服务器中选择:</h4>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md min-h-[60px] space-y-4">
                                <div className="flex flex-wrap gap-2">
                                {group.servers.map(server => (
                                    <Badge key={server.id} variant="outline" className="flex items-center gap-2 p-2 bg-white">
                                    <span className="font-normal">{server.hostname}<br/>{server.ipAddress}</span>
                                    <button onClick={() => removeServerFromGroup(group.id, server.id)} className="rounded-full hover:bg-muted-foreground/20">
                                        <X className="h-3 w-3" />
                                    </button>
                                    </Badge>
                                ))}
                                {group.servers.length === 0 && <p className="text-sm text-muted-foreground">从下面点击未分配的服务器添加到此批次。</p>}
                                </div>
                                    {unassignedServers.length > 0 && group.servers.length > 0 && <hr/>}
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
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-sm">2. 选择操作类型 (可多选):</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {operations.map((op) => (
                                <div key={op.id} className="flex flex-col gap-2">
                                    <Button
                                        variant={group.operationId === op.id ? 'default' : 'outline'}
                                        onClick={() => setGroupOperation(group.id, op.id)}
                                        className="w-full justify-center"
                                    >
                                        {op.name}
                                    </Button>
                                        {op.subOps && group.operationId === op.id && op.subOps.map(subOp => (
                                        <Button
                                        key={subOp.id}
                                        variant={group.subOperationId === subOp.id ? 'secondary' : 'outline'}
                                        onClick={() => setGroupSubOperation(group.id, subOp.id)}
                                        className="w-full justify-center"
                                        >
                                        {subOp.name}
                                        </Button>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-sm">3. 配置详情:</h4>
                                <div className="p-4 border rounded-md">
                                {group.operationId === 'install-system' && renderInstallSystemForm()}
                                {group.operationId === 'relocation' && renderRelocationForm()}
                                {group.operationId === 'hardware-change' && renderHardwareChangeForm()}
                                {group.operationId !== 'install-system' && group.operationId !== 'relocation' && group.operationId !== 'hardware-change' && (
                                    <p className="text-sm text-muted-foreground">
                                        {operations.find(o => o.id === group.operationId)?.name} 的配置详情将显示在这里。
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                                <h4 className="font-medium mb-2 text-sm">附加说明</h4>
                            <Textarea placeholder="在此输入此操作组的任何特殊说明或评论..." />
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                    <Button variant="outline" onClick={addOperationGroup} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        创建任务批次
                    </Button>
                </div>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">保存草稿</Button>
            <Button>提交工单</Button>
        </div>
      </>
      )}
    </div>
  );
}

    