
'use client';

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
} from 'lucide-react';
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
    sn: 'W800171803708812',
    status: '正常运行',
    gpu: ['WQDX_8NV202_NVLINK_80G * 8', 'GM302*8', 'GM302*8'],
    cpu: ['WGDX_8358P * 2', 'Intel_8358P*2 (64核/128线程)', 'Intel_8358P*2 (64核/128线程)'],
    memory: ['WGDX_84G_3200 * 32', '1024G', '1024G'],
    storage: ['KGDXK_SATA_ARED*2 + WGDX_NVME2.5_7.68T*2', '7680GB_U.2/NVME*1 + 480GB_SATA*2', '7680GB_U.2/NVME*2 + 480GB_SATA*1'],
    vpc: ['WGDX_25G_2*1+NGX', '25GE_2*1', '25GE_2*1'],
    compute: ['NGX_IB_200G_1_ML_PCIE4_C&HGXCM-A.H&F*2', '200GE_RoCE*4', '200GE_IB*2'],
    storageNet: '-',
    rack: ['XXX机房1', 'XXX机房1', 'XXX机房1'],
    deliveryPlan: '建立沟通群'
  }
];

function DeliveryPage() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="border-r">
        <SidebarContent className="p-0">
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HardDrive />
                设备选型
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
                产品验收
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
      <SidebarInset className="p-6 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>北京算力科技有限公司</span>
            <ChevronRight className="h-4 w-4" />
            <span>北京xxx GPU需求</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">无货源替换</span>
            <Badge variant="outline" className="ml-2 font-normal bg-blue-100 text-blue-800 border-blue-200">进行中</Badge>
        </div>
        <div className="flex items-center justify-end mt-2">
            <div className="flex items-center gap-2">
                <Button variant="outline">交付计划</Button>
                <Button variant="outline">建立沟通群</Button>
                <Button variant="destructive">退回</Button>
            </div>
        </div>

         <div className="mt-4 border-b">
            <Tabs defaultValue="delivery" className="w-full">
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                    <TabsTrigger value="delivery" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none p-2 font-semibold text-foreground">交付</TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none p-2 text-muted-foreground">日志</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        
        <div className="bg-white p-6 rounded-lg mt-6 shadow-sm">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">交付设备清单</h2>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Input placeholder="搜索设备SN/机架位置" className="pr-8" />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button>批量操作</Button>
                </div>
            </div>

            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                <AlertDescription>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600"/>
                        <span>已安排: <span className="font-semibold">3</span></span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-yellow-600"/>
                        <span>待安排: <span className="font-semibold">0</span></span>
                    </div>
                     <span className="text-gray-400">|</span>
                    <p>因物理安规，该机房不支持整机柜交付，会将该批设备拆分到多个机柜交付，<a href="#" className="underline">查看交付方案</a>。</p>
                </div>
                </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="gpu" className="mt-4">
                <TabsList>
                    <TabsTrigger value="gpu">GPU服务器</TabsTrigger>
                    <TabsTrigger value="cpu">CPU服务器</TabsTrigger>
                </TabsList>
                <TabsContent value="gpu">
                    <div className="border rounded-lg mt-4">
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
                                          {item.gpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell>
                                           {item.cpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell>
                                           {item.memory.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell>
                                           {item.storage.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell>
                                           {item.vpc.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell>
                                           {item.compute.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
                                        </TableCell>
                                        <TableCell><p className="text-xs text-red-600">{item.storageNet}</p></TableCell>
                                        <TableCell>
                                            {item.rack.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i > 0})}>{line}</p>)}
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
                    <div className="flex items-center justify-center h-40 border rounded-lg mt-4">
                        <p className="text-muted-foreground">没有CPU服务器数据。</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DeliveryPage;

    