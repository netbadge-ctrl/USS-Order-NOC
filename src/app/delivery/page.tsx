
'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
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
  Users,
  Package,
  ClipboardList,
  Wrench,
  Power,
  ChevronDown,
  Info,
  Bell,
  AlertTriangle,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/pagination';

const deliveryData = [
  {
    sn: '9800171603708812',
    status: '正常运行',
    gpu: ['WQDX_GM302*8', 'GM302*8', 'GM302*8'],
    cpu: ['WQDX_8358P*2', 'Intel_8358P*2', 'Intel_8358P*2'],
    memory: ['WQDX_64G_3200*16', '1024G', '1024G'],
    storage: ['WQDX_SATA_ARED*2 + WGDX_NVME2.5_7.68T*2', '7680GB_U.2/NVME*1', '7680GB_U.2/NVME*2'],
    vpc: ['WQDX_25G_2*1 + WGDX', '25GE_2*1', '25GE_2*1'],
    compute: ['WQDX_200G_1_IB_PCIE4_CX65...*2', '200GE_RoCE *...', '200GE_IB * 2'],
    storageNet: '无',
    rack: ['NXDX01', 'NXDX01-New', 'NXDX01'],
    deliveryPlan: '建立沟通群'
  }
];

type ChangeSummary = {
  hardwareChanges: { sn: string; changes: string[] }[];
  relocationChanges: { sn: string; from: string; to: string }[];
};


function DeliveryPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [changeSummary, setChangeSummary] = useState<ChangeSummary | null>(null);

    const handleInitiateWorkOrder = () => {
        const summary: ChangeSummary = {
            hardwareChanges: [],
            relocationChanges: [],
        };

        deliveryData.forEach(item => {
            const hardwareChangesForItem: string[] = [];
            const checkDiff = (component: string, current: string, target: string) => {
                if (current !== target) {
                    hardwareChangesForItem.push(`${component}: ${current} -> ${target}`);
                }
            };
            
            checkDiff('GPU', item.gpu[0], item.gpu[1]);
            checkDiff('CPU', item.cpu[0], item.cpu[1]);
            checkDiff('内存', item.memory[0], item.memory[1]);
            checkDiff('存储', item.storage[0], item.storage[1]);
            checkDiff('VPC网络', item.vpc[0], item.vpc[1]);
            checkDiff('计算网络', item.compute[0], item.compute[1]);

            if (hardwareChangesForItem.length > 0) {
                summary.hardwareChanges.push({ sn: item.sn, changes: hardwareChangesForItem });
            }

            if (item.rack[0] !== item.rack[1]) {
                summary.relocationChanges.push({ sn: item.sn, from: item.rack[0], to: item.rack[1] });
            }
        });
        
        setChangeSummary(summary);
        setIsDialogOpen(true);
    };


  return (
    <div className="flex flex-col w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>北京箭厂科技有限公司</span>
                <ChevronRight className="h-4 w-4" />
                <span>北京箭厂GPU需求</span>
                <Badge variant="outline" className="ml-2 font-normal bg-blue-100 text-blue-800 border-blue-200">完成资源预留 <Info className='inline-block w-3 h-3 ml-1'/></Badge>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">交付计划</Button>
                <Button variant="outline">建立沟通群</Button>
                <Button variant="destructive">退回</Button>
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
                                    <Button variant="outline" onClick={handleInitiateWorkOrder}>发起NOC工单</Button>
                                    <Button variant="outline">导出清单</Button>
                                </div>
                            </div>

                            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                                <Info className="h-4 w-4 text-blue-500" />
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
                                                            <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200 font-normal">{item.status}</Badge>
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
                                                        <TableCell><p className="text-xs text-red-600">{item.storageNet}</p></TableCell>
                                                        <TableCell>
                                                            {item.rack.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <p className="text-muted-foreground">共 1 条</p>
                                        <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">{'<'}</Button>
                                                <Button variant="outline" size="sm" className="bg-gray-100">1</Button>
                                                <Button variant="outline" size="sm">{'>'}</Button>
                                        </div>
                                        <Select defaultValue="10">
                                                <SelectTrigger className="w-28 h-9 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10条/页</SelectItem>
                                                    <SelectItem value="20">20条/页</SelectItem>
                                                    <SelectItem value="50">50条/页</SelectItem>
                                                </SelectContent>
                                        </Select>
                                        </div>
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
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>确认工单操作</AlertDialogTitle>
                    <AlertDialogDescription>
                        系统检测到以下配置变更，请确认是否继续发起NOC工单。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                    {changeSummary && (changeSummary.hardwareChanges.length > 0 || changeSummary.relocationChanges.length > 0) ? (
                        <>
                            {changeSummary.hardwareChanges.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center"><Wrench className="mr-2 h-5 w-5 text-blue-500" />硬件改配</h4>
                                    {changeSummary.hardwareChanges.map(item => (
                                        <div key={item.sn} className="p-3 bg-muted/50 rounded-lg">
                                            <p className="font-semibold text-sm text-foreground mb-2">服务器SN: <span className="font-mono">{item.sn}</span></p>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {item.changes.map((change, index) => <li key={index}>{change}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {changeSummary.relocationChanges.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center"><Package className="mr-2 h-5 w-5 text-green-500" />服务器搬迁</h4>
                                    {changeSummary.relocationChanges.map(item => (
                                        <div key={item.sn} className="p-3 bg-muted/50 rounded-lg">
                                             <p className="font-semibold text-sm text-foreground mb-1">服务器SN: <span className="font-mono">{item.sn}</span></p>
                                             <p className="text-sm">机房/机架: <span className="font-medium">{item.from}</span> -> <span className="font-medium text-blue-600">{item.to}</span></p>
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

    