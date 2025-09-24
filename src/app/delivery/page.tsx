
'use client';

import { useState, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  Settings,
  List,
  HardDrive,
  Package,
  Wrench,
  Power,
  Bell,
  LoaderCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getHardwareSuggestion } from '@/ai/flows/hardware-suggestion-flow';
import type { HardwareSuggestionOutput, HardwareSuggestionInput } from '@/ai/flows/hardware-suggestion-flow';
import { ServerHardwareConfig } from '@/lib/types';


const deliveryData = [
  {
    sn: '9800171603708812',
    status: '正常运行',
    gpu: ['WQDX_GM302*8', 'WQDX_A800*8', 'WQDX_A800*8'],
    cpu: ['WQDX_8358P*2', 'Intel_8358P*2', 'Intel_8468*2'],
    memory: ['WQDX_64G_3200*16', '1024G', '64G_4800*16'],
    storage: ['WQDX_SATA_ARED*2 + WGDX_NVME2.5_7.68T*2', '7680GB_U.2/NVME*1', 'NVME_3.84T*4'],
    vpc: ['WQDX_25G_2*1 + WGDX', '25GE_2*1', '200GE_RoCE*2'],
    compute: ['WQDX_200G_1_IB_PCIE4_CX65...*2', '200GE_IB * 2', '200GE_IB*8'],
    storageNet: '无',
    rack: ['NXDX01', 'GZA01', 'GZA01']
  },
  {
    sn: '9800171603708813',
    status: '维护中',
    gpu: ['WQDX_GM302*4', 'WQDX_A800*8', 'WQDX_A800*8'],
    cpu: ['Intel_4314*2', 'Intel_5318Y*2', 'Intel_8468*2'],
    memory: ['128G', '256G', '64G_4800*16'],
    storage: ['SATA_4T*12', 'NVME_1.92T*4', 'NVME_3.84T*4'],
    vpc: ['10GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
    compute: ['100GE_IB*2', '200GE_IB * 2', '200GE_IB*8'],
    storageNet: '无',
    rack: ['BJF01', 'GZA01', 'GZA01']
  },
  {
    sn: '9800171603708814',
    status: '正常运行',
    gpu: ['WQDX_GM302*4', 'WQDX_H800*8', 'WQDX_H800*8'],
    cpu: ['WQDX_8358P*2', 'Intel_8358P*2', 'Intel_8468*2'],
    memory: ['WQDX_32G_3200*16', '64G_3200*16', '128G_4800*16'],
    storage: ['SATA_480G*2', 'SATA_480G*2 + NVME_3.84T*2', 'NVME_7.68T*4'],
    vpc: ['25GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
    compute: ['100GE_IB*2', '200GE_IB*2', '400GE_IB*8'],
    storageNet: '无',
    rack: ['SZA01', 'GZA01', 'GZA01']
  },
  {
    sn: '9800171603708815',
    status: '已停止',
    gpu: ['WQDX_A800*4', 'WQDX_H800*8', 'WQDX_H800*8'],
    cpu: ['Intel_4314*2', 'Intel_4314*2', 'Intel_8468*2'],
    memory: ['128G', '256G', '128G_4800*16'],
    storage: ['SATA_4T*6', 'SATA_4T*12', 'NVME_7.68T*4'],
    vpc: ['10GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
    compute: ['100GE_IB*4', '200GE_IB*8', '400GE_IB*8'],
    storageNet: '无',
    rack: ['HZA01', 'GZA01', 'GZA01']
  },
  {
    sn: '9800171603708816',
    status: '正常运行',
    gpu: ['WQDX_A800*8', 'WQDX_H800*8', 'WQDX_H800*8'],
    cpu: ['Intel_8468*2', 'Intel_8468*2', 'Intel_8468*2'],
    memory: ['64G_4800*16', '64G_4800*16', '128G_4800*16'],
    storage: ['NVME_3.84T*4', 'NVME_3.84T*4', 'NVME_7.68T*4'],
    vpc: ['200GE_RoCE*2', '200GE_RoCE*2', '200GE_RoCE*2'],
    compute: ['200GE_IB*8', '200GE_IB*8', '400GE_IB*8'],
    storageNet: '200GE_RoCE*2',
    rack: ['GZA01', 'GZA01', 'SHB02']
  }
];

type GroupedChangeSummary = {
  hardwareChanges: Map<string, { sns: string[], changes: string[] }>;
  relocationChanges: Map<string, { from: string[], sns: string[] }>;
};

function DeliveryPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [changeSummary, setChangeSummary] = useState<GroupedChangeSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleInitiateWorkOrder = async () => {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        const summary: GroupedChangeSummary = {
            hardwareChanges: new Map(),
            relocationChanges: new Map(),
        };
        
        const hardwareGroup1Key = `目标配置 A|${JSON.stringify(["内存: 64G_4800*16", "存储: NVME_3.84T*4"])}`;
        summary.hardwareChanges.set(hardwareGroup1Key, {
            sns: ['9800171603708812', '9800171603708813'],
            changes: [
                "CPU: Intel_8468*2",
                "内存: 64G_4800*16",
                "存储: NVME_3.84T*4",
                "GPU: WQDX_A800*8",
                "VPC网络: 200GE_RoCE*2",
                "计算网络: 200GE_IB*8"
            ],
        });

        const hardwareGroup2Key = `目标配置 B|${JSON.stringify(["GPU: WQDX_H800*8", "内存: 128G_4800*16"])}`;
        summary.hardwareChanges.set(hardwareGroup2Key, {
            sns: ['9800171603708814', '9800171603708815'],
            changes: [
                "GPU: WQDX_H800*8",
                "内存: 128G_4800*16",
                "计算网络: 400GE_IB*8"
            ],
        });

        const relocationGroup1 = { from: ['NXDX01', 'BJF01', 'SZA01', 'HZA01'], sns: ['9800171603708812', '9800171603708813', '9800171603708814', '9800171603708815']};
        summary.relocationChanges.set('GZA01', relocationGroup1);
        
        const relocationGroup2 = { from: ['GZA01'], sns: ['9800171603708816']};
        summary.relocationChanges.set('SHB02', relocationGroup2);
        
        setChangeSummary(summary);
        setIsLoading(false);
        setIsDialogOpen(true);
    };


  return (
    <div className="w-full flex flex-col flex-1">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>北京箭厂科技有限公司</span>
                <ChevronRight className="h-4 w-4" />
                <span>北京箭厂GPU需求</span>
                <Badge variant="outline" className="ml-2 font-normal bg-blue-100 text-blue-800 border-blue-200">完成资源预留</Badge>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="link">交付计划</Button>
                <Button variant="link">建立沟通群</Button>
                <Button variant="outline">返回</Button>
            </div>
        </div>
        <Tabs defaultValue="delivery" className="w-full flex flex-col flex-1">
             <div className="border-b px-6 flex items-center justify-between py-2">
                <TabsList className="bg-transparent p-0 h-auto gap-6 -mb-px">
                    <TabsTrigger value="requirements" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">需求说明</TabsTrigger>
                    <TabsTrigger value="architecture" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">架构</TabsTrigger>
                    <TabsTrigger value="bom" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">BOM&采购</TabsTrigger>
                    <TabsTrigger value="quote" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">询价</TabsTrigger>
                    <TabsTrigger value="delivery" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 font-semibold text-foreground">交付</TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">日志</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Clock className="mr-2 h-4 w-4"/>填写预计交付时间</Button>
                    <Button><Bell className="mr-2 h-4 w-4"/>通知系统部介入</Button>
                </div>
            </div>

            <div className="flex flex-1">
                <SidebarProvider>
                    <Sidebar collapsible="none" className="border-r">
                        <SidebarContent className="p-0">
                        <SidebarMenu className="gap-0">
                            <SidebarMenuItem>
                            <SidebarMenuButton>
                                <HardDrive />
                                设备定型
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                            <SidebarMenuButton isActive>
                                <List />
                                交付清单
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Settings />
                                系统部处理
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Package />
                                产品线验收
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Wrench />
                                NOC工单
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Power />
                                交付计划
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        </SidebarContent>
                    </Sidebar>
                    <SidebarInset className="p-6 bg-gray-50/50 flex flex-col">
                        <TabsContent value="delivery" className="mt-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold">交付设备清单</h2>
                                    <div className="relative w-64">
                                        <Input placeholder="搜索设备SN/机架位置" className="pr-8" />
                                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={handleInitiateWorkOrder} disabled={isLoading}>
                                        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        发起NOC工单
                                    </Button>
                                    <Button variant="outline">导出清单</Button>
                                </div>
                            </div>

                            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                                
                                <AlertDescription>
                                    图例说明: 黑色字体为当前服务器配置, <span className="text-blue-600">蓝色字体为需交付服务器配置</span>, <span className="text-red-600">红色字体为用户需求配置</span>.
                                </AlertDescription>
                            </Alert>
                            
                            <Tabs defaultValue="gpu" className="mt-4">
                                <TabsList>
                                    <TabsTrigger value="gpu">GPU服务器</TabsTrigger>
                                    <TabsTrigger value="cpu">CPU服务器</TabsTrigger>
                                </TabsList>
                                <TabsContent value="gpu">
                                    <div className="border rounded-lg mt-4 bg-white">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead>设备SN/状态</TableHead>
                                                    <TableHead>GPU</TableHead>
                                                    <TableHead>CPU</TableHead>
                                                    <TableHead>内存</TableHead>
                                                    <TableHead>存储</TableHead>
                                                    <TableHead>VPC网络</TableHead>
                                                    <TableHead>计算网络</TableHead>
                                                    <TableHead>存储网络</TableHead>
                                                    <TableHead>机房</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deliveryData.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <p className="font-mono text-xs">{item.sn}</p>
                                                            <Badge variant="outline" className={cn("mt-1 font-normal", {
                                                                'bg-green-100 text-green-800 border-green-200': item.status === '正常运行',
                                                                'bg-yellow-100 text-yellow-800 border-yellow-200': item.status === '维护中',
                                                                'bg-red-100 text-red-800 border-red-200': item.status === '已停止',
                                                            })}>{item.status}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.gpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.cpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.memory.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.storage.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.vpc.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell>
                                                        {item.compute.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                        <TableCell><p className="text-xs">{item.storageNet}</p></TableCell>
                                                        <TableCell>
                                                            {item.rack.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    
                                </TabsContent>
                                <TabsContent value="cpu">
                                    <div className="flex items-center justify-center h-40 border rounded-lg mt-4 bg-white">
                                        <p className="text-muted-foreground">没有CPU服务器数据。</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </Tabs>
         <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent className="max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>确认工单操作</AlertDialogTitle>
                    <AlertDialogDescription>
                        系统检测到以下配置变更，请确认是否继续发起NOC工单。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                    {changeSummary && (changeSummary.hardwareChanges.size > 0 || changeSummary.relocationChanges.size > 0) ? (
                        <>
                            {changeSummary.hardwareChanges.size > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center"><Wrench className="mr-2 h-5 w-5 text-blue-500" />硬件改配</h4>
                                    {Array.from(changeSummary.hardwareChanges.entries()).map(([key, group]) => (
                                        <div key={key} className="p-4 bg-muted/50 rounded-lg space-y-3">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground mb-2">目标配置:</p>
                                                <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                                                    {group.changes.map((change, index) => <li key={index}>{change}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-foreground mb-2">应用到以下服务器SN:</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {group.sns.map(sn => <Badge key={sn} variant="secondary" className="font-mono">{sn}</Badge>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {changeSummary.relocationChanges.size > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center"><Package className="mr-2 h-5 w-5 text-green-500" />服务器搬迁</h4>
                                     {Array.from(changeSummary.relocationChanges.entries()).map(([to, group]) => (
                                        <div key={to} className="p-4 bg-muted/50 rounded-lg space-y-3">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground mb-2">目标机房/机架: <span className="font-medium text-blue-600">{to}</span></p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-foreground mb-2">以下服务器将搬迁至此位置:</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {group.sns.map(sn => <Badge key={sn} variant="secondary" className="font-mono">{sn}</Badge>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
                             <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                            <p className="font-semibold">未检测到配置变更。</p>
                            <p className="text-sm text-muted-foreground">所有服务器的当前配置与目标配置一致。</p>
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction>确认提交</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

export default DeliveryPage;

    

    