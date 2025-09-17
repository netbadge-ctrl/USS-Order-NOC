

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import type { Server, OperationId, HardwareChangeSuggestion, ServerHardwareConfig } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Wand2, LoaderCircle, ChevronsUpDown, Info, Trash2 } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { targetModels } from '@/lib/data';
import { getHardwareSuggestion } from '@/ai/flows/hardware-suggestion-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


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

type CustomConfig = {
    cpu: { model: string; quantity: number };
    gpu: { model: string; quantity: number; empty: boolean };
    memory: { mode: 'capacity' | 'spec' | 'model'; capacity: string; frequency: string };
    hdd: { items: { model: string; quantity: number }[], mode: 'spec' | 'model' | 'empty' };
    ssd: { items: { spec: string; quantity: number }[], mode: 'spec' | 'model' | 'empty' };
    nic: { items: { spec: string; quantity: number }[] };
    raid: { type: string; mode: 'type' | 'spec' | 'model' | 'empty' };
};


type OperationGroup = {
  id: number;
  servers: Server[];
  operationIds: OperationId[];
  subOperationId?: string;
  notes: string;
  hardwareChange: {
    configType: 'model' | 'custom';
    targetModelId?: string;
    customConfig: CustomConfig;
    suggestion?: HardwareChangeSuggestion;
    isGenerating: boolean;
  }
};

function ServerSelector({
  unassignedServers,
  onAddServers,
}: {
  unassignedServers: Server[];
  onAddServers: (servers: Server[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Server[]>([]);

  const handleAdd = () => {
    onAddServers(selected);
    setSelected([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-auto justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          添加服务器
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="搜索服务器..." />
          <CommandList>
            <CommandEmpty>没有未分配的服务器。</CommandEmpty>
            <CommandGroup>
              {unassignedServers.map((server) => (
                <CommandItem
                  key={server.id}
                  value={`${server.hostname} ${server.ipAddress}`}
                  onSelect={() => {
                    setSelected((currentSelected) =>
                      currentSelected.some((s) => s.id === server.id)
                        ? currentSelected.filter((s) => s.id !== server.id)
                        : [...currentSelected, server]
                    );
                  }}
                >
                  <Checkbox
                    className="mr-2"
                    checked={selected.some((s) => s.id === server.id)}
                  />
                  <span>{server.hostname} ({server.ipAddress})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2 border-t">
          <Button onClick={handleAdd} className="w-full" disabled={selected.length === 0}>
            添加 {selected.length > 0 ? `${selected.length} 台` : ''}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


export default function Home() {
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [operationGroups, setOperationGroups] = useState<OperationGroup[]>([]);
  const [nextGroupId, setNextGroupId] = useState(1);
  const [stressTest, setStressTest] = useState(false);
  
  const addOperationGroup = useCallback(() => {
    const newGroupId = nextGroupId;
    setOperationGroups(prevGroups => [
      ...prevGroups,
      {
        id: newGroupId,
        servers: [],
        operationIds: [],
        notes: '',
        hardwareChange: {
          configType: 'model',
          customConfig: {
              cpu: { model: 'E5_2620V4_S', quantity: 1 },
              gpu: { model: 'P4', quantity: 1, empty: false },
              memory: { mode: 'capacity', capacity: '', frequency: '' },
              hdd: { items: [{ model: '', quantity: 1 }], mode: 'spec' },
              ssd: { items: [{ spec: 'NVME_4T', quantity: 1 }], mode: 'spec' },
              nic: { items: [{ spec: '10G双光口', quantity: 1 }] },
              raid: { type: 'RAID 1', mode: 'type' },
          },
          isGenerating: false,
        }
      },
    ]);
    setNextGroupId(newGroupId + 1);
  }, [nextGroupId]);

  useEffect(() => {
    if (selectedServers.length > 0 && operationGroups.length === 0) {
      addOperationGroup();
    }
  }, [selectedServers, operationGroups.length, addOperationGroup]);


  const unassignedServers = useMemo(() => selectedServers.filter(
    (server) =>
      !operationGroups.some((group) =>
        group.servers.some((s) => s.id === server.id)
      )
  ), [selectedServers, operationGroups]);

  const removeOperationGroup = (groupId: number) => {
    setOperationGroups(currentGroups => {
        const groupToRemove = currentGroups.find(g => g.id === groupId);
        if (!groupToRemove) return currentGroups;
        
        return currentGroups.filter((group) => group.id !== groupId);
    });
};

  const updateGroup = (groupId: number, updates: Partial<OperationGroup>) => {
    setOperationGroups(
      operationGroups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  const addServersToGroup = (groupId: number, serversToAdd: Server[]) => {
     const serverIdsToAdd = new Set(serversToAdd.map(s => s.id));
     const groupsWithServersRemoved = operationGroups.map(g => ({
        ...g,
        servers: g.servers.filter(s => !serverIdsToAdd.has(s.id))
    }));

    const updatedGroups = groupsWithServersRemoved.map((group) => {
      if (group.id === groupId) {
        // Prevent duplicates
        const existingServerIds = new Set(group.servers.map(s => s.id));
        const newServers = serversToAdd.filter(s => !existingServerIds.has(s.id));
        return { ...group, servers: [...group.servers, ...newServers] };
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

  const toggleGroupOperation = (groupId: number, operationId: OperationId) => {
    const group = operationGroups.find(g => g.id === groupId);
    if (!group) return;

    const newOperationIds = group.operationIds.includes(operationId)
        ? group.operationIds.filter(id => id !== operationId)
        : [...group.operationIds, operationId];

    updateGroup(groupId, { operationIds: newOperationIds, subOperationId: undefined });
  };
  
  const setGroupSubOperation = (groupId: number, subOpId: string) => {
     updateGroup(groupId, { subOperationId: subOpId });
  }

  const handleGenerateSuggestion = async (group: OperationGroup) => {
    if (group.servers.length === 0) return;
  
    updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, isGenerating: true, suggestion: undefined } });
  
    const server = group.servers[0];
    let targetConfig: ServerHardwareConfig | null = null;
  
    if (group.hardwareChange.configType === 'model') {
      if (!group.hardwareChange.targetModelId) {
        updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, isGenerating: false } });
        return;
      }
      const targetModel = targetModels[server.resourceType].find(m => m.id === group.hardwareChange.targetModelId);
      if (targetModel) {
        targetConfig = targetModel.config;
      }
    } else { // custom config
       const customConfig = group.hardwareChange.customConfig;
       // A bit of a simplification to map the new custom config structure to the old flat one for the AI.
       // In a real app, you might want the AI to understand the structured config.
       targetConfig = {
          cpu: `${customConfig.cpu.quantity}x ${customConfig.cpu.model}`,
          memory: customConfig.memory.mode === 'capacity' ? customConfig.memory.capacity : `${customConfig.memory.capacity} ${customConfig.memory.frequency}`,
          storage: [
              ...customConfig.hdd.items.map(i => `${i.quantity}x ${i.model} HDD`),
              ...customConfig.ssd.items.map(i => `${i.quantity}x ${i.spec} SSD`),
          ].join(' + '),
          gpu: customConfig.gpu.empty ? 'None' : `${customConfig.gpu.quantity}x ${customConfig.gpu.model}`,
          nic: customConfig.nic.items.map(i => `${i.quantity}x ${i.spec}`).join(' + '),
          // Simplified, you would expand this mapping
          vpcNetwork: 'N/A',
          computeNetwork: 'N/A',
          storageNetwork: 'N/A',
        };
    }
  
    if (!targetConfig) {
      updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, isGenerating: false } });
      return;
    }
  
    try {
      const suggestion = await getHardwareSuggestion({
        currentConfig: server.config,
        targetConfig: targetConfig,
        serverType: server.resourceType,
      });
      updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, suggestion, isGenerating: false } });
    } catch (e) {
      console.error(e);
      updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, isGenerating: false } });
    }
  };


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

  const renderHardwareChangeForm = (group: OperationGroup) => {
    if (group.servers.length === 0) {
        return (<p className="text-sm text-muted-foreground pt-4">请先将服务器添加到此任务批次中以配置硬件变更。</p>);
    }

    const serverTypes = new Set(group.servers.map(s => s.resourceType));
    
    if (serverTypes.size > 1) {
        return (
            <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>类型不匹配</AlertTitle>
                <AlertDescription>
                    此任务批次中包含多种服务器类型 (CPU 和 GPU)。请将不同类型的服务器分在不同的任务批次中进行硬件变更。
                </AlertDescription>
            </Alert>
        );
    }

    const serverType = serverTypes.values().next().value as 'CPU' | 'GPU';
    const models = targetModels[serverType];
    const selectedModel = models.find(m => m.id === group.hardwareChange?.targetModelId);

    const handleCustomConfigChange = <T extends keyof CustomConfig, K extends keyof CustomConfig[T]>(section: T, field: K, value: CustomConfig[T][K]) => {
        const newCustomConfig = {
            ...group.hardwareChange.customConfig,
            [section]: {
                ...group.hardwareChange.customConfig[section],
                [field]: value,
            },
        };
        updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, customConfig: newCustomConfig } });
    };

    const handleCustomConfigItemChange = <T extends 'hdd' | 'ssd' | 'nic'>(section: T, index: number, field: keyof CustomConfig[T]['items'][number], value: any) => {
        const newItems = [...group.hardwareChange.customConfig[section].items];
        // @ts-ignore
        newItems[index][field] = value;
        handleCustomConfigChange(section, 'items', newItems as any);
    }

    const addCustomConfigItem = <T extends 'hdd' | 'ssd' | 'nic'>(section: T) => {
        const newItems = [...group.hardwareChange.customConfig[section].items, { spec: '', model: '', quantity: 1 }];
        handleCustomConfigChange(section, 'items', newItems as any);
    }
    
    const removeCustomConfigItem = <T extends 'hdd' | 'ssd' | 'nic'>(section: T, index: number) => {
        const newItems = group.hardwareChange.customConfig[section].items.filter((_, i) => i !== index);
        handleCustomConfigChange(section, 'items', newItems as any);
    }


    const renderSuggestion = (suggestion: HardwareChangeSuggestion) => {
      const renderItem = (label: string, item?: { action: string; details: string }) => {
          if (!item || item.action === 'none') return null;
          let actionText;
          let badgeVariant: "default" | "secondary" | "destructive" = "secondary";
          switch(item.action) {
              case 'add': actionText = '新增'; badgeVariant="default"; break;
              case 'replace': actionText = '更换'; badgeVariant="secondary"; break;
              case 'remove': actionText = '移除'; badgeVariant="destructive"; break;
          }

          return (
              <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                      <Badge variant={badgeVariant}>{actionText}</Badge>
                      <span className="font-medium">{item.details}</span>
                  </div>
              </div>
          )
      }
      return (
          <div className="p-4 bg-primary/5 border-primary/20 border rounded-lg space-y-2 mt-4">
              <h4 className="font-medium text-primary">改配方案建议</h4>
              {renderItem('CPU', suggestion.cpu)}
              {renderItem('内存', suggestion.memory)}
              {renderItem('存储', suggestion.storage)}
              {renderItem('GPU', suggestion.gpu)}
              {renderItem('网卡', suggestion.nic)}
              {renderItem('网络', suggestion.network)}
          </div>
      )
    }

    const renderCustomConfigForm = () => {
       const config = group.hardwareChange.customConfig;
        return (
            <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* CPU */}
                    <Card>
                        <CardHeader className="pb-2">
                             <CardTitle className="text-base flex items-center justify-between">
                                <span>CPU</span>
                                <RadioGroup value="model" className="flex items-center text-sm font-normal">
                                    <RadioGroupItem value="model" id={`cpu-model-${group.id}`} />
                                    <Label htmlFor={`cpu-model-${group.id}`} className="font-normal">型号</Label>
                                </RadioGroup>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`cpu-model-select-${group.id}`}>*型号</Label>
                                <Select value={config.cpu.model} onValueChange={(v) => handleCustomConfigChange('cpu', 'model', v)}>
                                    <SelectTrigger id={`cpu-model-select-${group.id}`}><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="E5_2620V4_S">E5_2620V4_S</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`cpu-quantity-${group.id}`}>*数量</Label>
                                <Input id={`cpu-quantity-${group.id}`} type="number" value={config.cpu.quantity} onChange={(e) => handleCustomConfigChange('cpu', 'quantity', parseInt(e.target.value) || 1)} />
                            </div>
                        </CardContent>
                    </Card>
                     {/* GPU */}
                    <Card>
                        <CardHeader className="pb-2">
                             <CardTitle className="text-base flex items-center justify-between">
                                <span>GPU</span>
                                <RadioGroup value={config.gpu.empty ? 'empty' : 'model'} onValueChange={(v) => handleCustomConfigChange('gpu', 'empty', v === 'empty')} className="flex items-center text-sm font-normal gap-4">
                                     <div className="flex items-center gap-2">
                                        <RadioGroupItem value="model" id={`gpu-model-${group.id}`} />
                                        <Label htmlFor={`gpu-model-${group.id}`} className="font-normal">型号</Label>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <RadioGroupItem value="empty" id={`gpu-empty-${group.id}`} />
                                        <Label htmlFor={`gpu-empty-${group.id}`} className="font-normal">为空</Label>
                                     </div>
                                </RadioGroup>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`gpu-model-select-${group.id}`}>*型号</Label>
                                <Select value={config.gpu.model} onValueChange={(v) => handleCustomConfigChange('gpu', 'model', v)} disabled={config.gpu.empty}>
                                    <SelectTrigger id={`gpu-model-select-${group.id}`}><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="P4">P4</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`gpu-quantity-${group.id}`}>*数量</Label>
                                <Input id={`gpu-quantity-${group.id}`} type="number" value={config.gpu.quantity} onChange={(e) => handleCustomConfigChange('gpu', 'quantity', parseInt(e.target.value) || 1)} disabled={config.gpu.empty}/>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Memory */}
                    <Card>
                         <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>内存</span>
                                <RadioGroup value={config.memory.mode} onValueChange={(v) => handleCustomConfigChange('memory', 'mode', v as any)} className="flex items-center text-sm font-normal gap-4">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="capacity" id={`mem-cap-${group.id}`} />
                                        <Label htmlFor={`mem-cap-${group.id}`} className="font-normal">总容量</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="spec" id={`mem-spec-${group.id}`} />
                                        <Label htmlFor={`mem-spec-${group.id}`} className="font-normal">规格</Label>
                                    </div>
                                </RadioGroup>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`mem-capacity-${group.id}`}>*总容量</Label>
                                <Select value={config.memory.capacity} onValueChange={(v) => handleCustomConfigChange('memory', 'capacity', v)}>
                                    <SelectTrigger id={`mem-capacity-${group.id}`}><SelectValue placeholder="请选择" /></SelectTrigger>
                                    <SelectContent><SelectItem value="256G">256G</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`mem-freq-${group.id}`}>*频率</Label>
                                 <Select value={config.memory.frequency} onValueChange={(v) => handleCustomConfigChange('memory', 'frequency', v)}>
                                    <SelectTrigger id={`mem-freq-${group.id}`}><SelectValue placeholder="请选择" /></SelectTrigger>
                                    <SelectContent><SelectItem value="3200">3200</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    {/* RAID/HBA */}
                    <Card>
                        <CardHeader className="pb-2">
                           <CardTitle className="text-base flex items-center justify-between">
                                <span>RAID/HBA</span>
                                 <RadioGroup value={config.raid.mode} onValueChange={(v) => handleCustomConfigChange('raid', 'mode', v as any)} className="flex items-center text-sm font-normal gap-4">
                                     <div className="flex items-center gap-2">
                                        <RadioGroupItem value="type" id={`raid-type-${group.id}`} />
                                        <Label htmlFor={`raid-type-${group.id}`} className="font-normal">Raid类型</Label>
                                     </div>
                                      <div className="flex items-center gap-2">
                                        <RadioGroupItem value="empty" id={`raid-empty-${group.id}`} />
                                        <Label htmlFor={`raid-empty-${group.id}`} className="font-normal">为空</Label>
                                     </div>
                                </RadioGroup>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <Label htmlFor={`raid-type-select-${group.id}`}>*RAID类型</Label>
                                 <Select value={config.raid.type} onValueChange={(v) => handleCustomConfigChange('raid', 'type', v)} disabled={config.raid.mode === 'empty'}>
                                    <SelectTrigger id={`raid-type-select-${group.id}`}><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="RAID 1">RAID 1</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                     {/* NIC */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-base flex items-center justify-between">
                                <span>网卡</span>
                                 <RadioGroup value="spec" className="flex items-center text-sm font-normal">
                                    <RadioGroupItem value="spec" id={`nic-spec-${group.id}`} />
                                    <Label htmlFor={`nic-spec-${group.id}`} className="font-normal">规格</Label>
                                </RadioGroup>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {config.nic.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 items-end">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor={`nic-spec-select-${group.id}-${index}`}>*规格</Label>
                                        <Select value={item.spec} onValueChange={(v) => handleCustomConfigItemChange('nic', index, 'spec', v)}>
                                            <SelectTrigger id={`nic-spec-select-${group.id}-${index}`}><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="10G双光口">10G双光口</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor={`nic-quantity-${group.id}-${index}`}>*数量</Label>
                                        <Input id={`nic-quantity-${group.id}-${index}`} type="number" value={item.quantity} onChange={(e) => handleCustomConfigItemChange('nic', index, 'quantity', parseInt(e.target.value) || 1)} />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeCustomConfigItem('nic', index)} disabled={config.nic.items.length <= 1}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                             <Button variant="link" onClick={() => addCustomConfigItem('nic')}><PlusCircle className="mr-2 h-4 w-4" />添加一条</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    };

    return (
      <div className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
            <Label className="shrink-0">配置方式</Label>
            <RadioGroup 
                value={group.hardwareChange?.configType}
                onValueChange={(value: 'model' | 'custom') => updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, configType: value }})}
                className="flex items-center gap-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="model" id={`model-${group.id}`} />
                    <Label htmlFor={`model-${group.id}`} className="font-normal flex items-center gap-2">
                      <span>按目标机型</span>
                      {group.hardwareChange?.configType === 'model' && (
                        <Select
                            value={group.hardwareChange?.targetModelId}
                            onValueChange={(value) => updateGroup(group.id, { hardwareChange: { ...group.hardwareChange, targetModelId: value, suggestion: undefined } })}
                        >
                            <SelectTrigger id={`target-model-select-${group.id}`} className="flex-1 w-[280px]">
                                <SelectValue placeholder="选择目标机型" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map(model => (
                                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      )}
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id={`custom-${group.id}`} />
                    <Label htmlFor={`custom-${group.id}`} className="font-normal">自定义配置</Label>
                </div>
            </RadioGroup>
        </div>


        {group.hardwareChange?.configType === 'model' ? (
           selectedModel && (
            <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md space-y-4">
                  <h4 className="font-medium">目标配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {serverType === 'GPU' && (
                      <>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">GPU</p>
                          <p className="font-medium">{selectedModel.config.gpu}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">CPU</p>
                          <p className="font-medium">{selectedModel.config.cpu}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8">
                          <div className="space-y-1">
                            <p className="text-muted-foreground">内存</p>
                            <p className="font-medium">{selectedModel.config.memory}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">硬盘/存储</p>
                            <p className="font-medium">{selectedModel.config.storage}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">VPC网络</p>
                          <p className="font-medium">{selectedModel.config.vpcNetwork}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">计算网络</p>
                          <p className="font-medium">{selectedModel.config.computeNetwork}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">存储网络</p>
                          <p className="font-medium">{selectedModel.config.storageNetwork}</p>
                        </div>
                      </>
                    )}
                    {serverType === 'CPU' && (
                      <>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">CPU</p>
                          <p className="font-medium">{selectedModel.config.cpu}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8">
                          <div className="space-y-1">
                            <p className="text-muted-foreground">内存</p>
                            <p className="font-medium">{selectedModel.config.memory}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">硬盘/存储</p>
                            <p className="font-medium">{selectedModel.config.storage}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">网卡</p>                          <p className="font-medium">{selectedModel.config.nic}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
            </div>
           )
        ) : (
            renderCustomConfigForm()
        )}

        <div className="flex justify-end">
            <Button 
                onClick={() => handleGenerateSuggestion(group)}
                disabled={
                    (group.hardwareChange?.configType === 'model' && !group.hardwareChange?.targetModelId) ||
                    group.hardwareChange?.isGenerating
                }
            >
                {group.hardwareChange?.isGenerating ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <Wand2 />
                )}
                生成改配方案
            </Button>
        </div>
        {group.hardwareChange?.isGenerating && <p className="text-sm text-muted-foreground text-center">AI 正在分析配置中，请稍候...</p>}
        {group.hardwareChange?.suggestion && renderSuggestion(group.hardwareChange.suggestion)}
      </div>
    );
  };
  
  const renderAdditionalOpsForm = () => (
      <div className="space-y-6 pt-4">
        <div className="space-y-4 border-b pb-4">
            <h4 className="font-medium">附加操作</h4>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Checkbox id="stress-test" checked={stressTest} onCheckedChange={(checked) => setStressTest(Boolean(checked))} />
                    <Label htmlFor="stress-test" className="font-normal">压测:</Label>
                    <span className="text-red-500 text-xs">此操作会有系统盘和数据盘数据全部丢失的风险</span>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="smart-nic-init" />
                    <Label htmlFor="smart-nic-init" className="font-normal">智能网卡初始化:</Label>
                    <span className="text-red-500 text-xs">此操作会有智能网卡数据全部丢失的风险</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Checkbox id="ib-nccl" />
                    <Label htmlFor="ib-nccl" className="font-normal">IB_NCCL:</Label>
                    <span className="text-red-500 text-xs">非EPC, XRLLM机器勿选</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="port-change" />
                    <Label htmlFor="port-change" className="font-normal">网络端口变更</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="online-standby" />
                    <Label htmlFor="online-standby" className="font-normal">置为线上备机</Label>
                </div>
            </div>
        </div>

        {stressTest && (
            <div className="space-y-4">
                <h4 className="font-medium">压测类型</h4>
                 <div className="flex items-center gap-2">
                    <Label className="font-normal">选择压测类型</Label>
                    <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center space-x-2">
                             <Checkbox id="test-memory" />
                             <Label htmlFor="test-memory" className="font-normal">内存</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                             <Checkbox id="test-gpu" />
                             <Label htmlFor="test-gpu" className="font-normal">GPU</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                             <Checkbox id="test-cpu" />
                             <Label htmlFor="test-cpu" className="font-normal">CPU</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                             <Checkbox id="test-hdd" />
                             <Label htmlFor="test-hdd" className="font-normal">硬盘</Label>
                        </div>
                    </div>
                 </div>
            </div>
        )}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-6">
                    <h3 className="text-lg font-semibold">2. 配置任务批次</h3>
                    
                    <div className="space-y-4">
                        <h3 className="font-medium">未分配的服务器 ({unassignedServers.length})</h3>
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
                            <CardTitle className="text-lg">任务批次 #{groupIndex + 1}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => removeOperationGroup(group.id)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2 text-sm">1. 将服务器添加到此批次:</h4>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md min-h-[88px] space-y-4">
                                <div className="flex flex-wrap gap-2">
                                {group.servers.map(server => (
                                    <Badge key={server.id} variant="outline" className="flex items-center gap-2 p-2 bg-white">
                                    <span className="font-normal">{server.hostname}<br/>{server.ipAddress}</span>
                                    <button onClick={() => removeServerFromGroup(group.id, server.id)} className="rounded-full hover:bg-muted-foreground/20">
                                        <X className="h-3 w-3" />
                                    </button>
                                    </Badge>
                                ))}
                                {group.servers.length === 0 && <p className="text-sm text-muted-foreground">从下面点击“添加服务器”以分配未分配的服务器。</p>}
                                </div>
                                <ServerSelector 
                                    unassignedServers={unassignedServers}
                                    onAddServers={(servers) => addServersToGroup(group.id, servers)}
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-sm">2. 选择操作类型:</h4>
                             {group.servers.length === 0 && (
                                <Alert variant="default" className="border-amber-500/50 bg-amber-50/50 text-amber-900 mb-4">
                                    <Info className="h-4 w-4 !text-amber-600" />
                                    <AlertDescription>
                                        请先将服务器添加到此任务批次中，然后才能选择操作类型。
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {operations.map((op) => {
                                    const isSelected = group.operationIds.includes(op.id);
                                    const mainOpSelected = group.operationIds.length > 0 && group.operationIds.includes(op.id);
                                    return (
                                        <div key={op.id} className="flex flex-col gap-2">
                                            <Button
                                                variant={isSelected ? 'default' : 'outline'}
                                                onClick={() => toggleGroupOperation(group.id, op.id)}
                                                className="w-full justify-center"
                                                disabled={group.servers.length === 0}
                                            >
                                                {op.name}
                                            </Button>
                                            {op.subOps && mainOpSelected && (
                                                <div className="flex flex-col gap-2 pl-4 mt-2 border-l-2 border-primary/50">
                                                    {op.subOps.map(subOp => (
                                                    <Button
                                                        key={subOp.id}
                                                        variant={group.subOperationId === subOp.id ? 'secondary' : 'outline'}
                                                        onClick={() => setGroupSubOperation(group.id, subOp.id)}
                                                        className="w-full justify-start text-xs h-8"
                                                    >
                                                        {subOp.name}
                                                    </Button>
                                                ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-sm">3. 配置详情:</h4>
                            {group.operationIds.length > 0 ? (
                                <Tabs defaultValue={group.operationIds[0]} className="w-full">
                                <TabsList>
                                    {group.operationIds.map(opId => (
                                        <TabsTrigger key={opId} value={opId}>
                                            {operations.find(o => o.id === opId)?.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {group.operationIds.map(opId => (
                                    <TabsContent key={opId} value={opId}>
                                         <div className="p-4 border rounded-md">
                                            {opId === 'install-system' && renderInstallSystemForm()}
                                            {opId === 'relocation' && renderRelocationForm()}
                                            {opId === 'hardware-change' && renderHardwareChangeForm(group)}
                                            {opId === 'additional-ops' && renderAdditionalOpsForm()}
                                        </div>
                                    </TabsContent>
                                ))}
                                </Tabs>
                            ) : (
                                <div className="p-4 border rounded-md text-sm text-muted-foreground">
                                    请至少选择一个操作类型。
                                </div>
                            )}
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
