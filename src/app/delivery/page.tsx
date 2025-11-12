
'use client';

import * as React from 'react';
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
  LoaderCircle,
  Info,
  XCircle,
  Minus,
  Plus,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { UpgradePlan, UpgradePlanChangeItem, ServerHardwareConfig } from '@/lib/types';
import { SearchableSelect } from '@/components/ui/searchable-select';


const deliveryData = [
    {
        sn: '9800171603708812',
        status: '正常运行',
        gpu: ['WQDX_GM302*8', 'WQDX_A800*8', 'WQDX_A800*8'],
        cpu: ['WQDX_8358P*2', 'Intel_8358P*2', 'Intel_8468*2'],
        memory: ['WQDX_64G_3200*16', '1024G', '64G_4800*16'],
        storage: ['WQDX_SATA_ARED*2 + WGDX_NVME2.5_7.68T*2', '7680GB_U.2/NVME*1', 'NVME_3.84T*4'],
        vpcNetwork: ['WQDX_25G_2*1 + WGDX', '25GE_2*1', '200GE_RoCE*2'],
        computeNetwork: ['WQDX_200G_1_IB_PCIE4_CX65...*2', '200GE_IB * 2', '200GE_IB*8'],
        storageNetwork: '无',
        rack: ['NXDX01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708813',
        status: '维护中',
        gpu: ['WQDX_GM302*4', 'WQDX_A800*8', 'WQDX_A800*8'],
        cpu: ['Intel_4314*2', 'Intel_5318Y*2', 'Intel_8468*2'],
        memory: ['128G', '256G', '64G_4800*16'],
        storage: ['SATA_4T*12', 'NVME_1.92T*4', 'NVME_3.84T*4'],
        vpcNetwork: ['10GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB * 2', '200GE_IB*8'],
        storageNetwork: '无',
        rack: ['BJF01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708814',
        status: '正常运行',
        gpu: ['WQDX_GM302*4', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['WQDX_8358P*2', 'Intel_8358P*2', 'Intel_8468*2'],
        memory: ['WQDX_32G_3200*16', '64G_3200*16', '128G_4800*16'],
        storage: ['SATA_480G*2', 'SATA_480G*2 + NVME_3.84T*2', 'NVME_7.68T*4'],
        vpcNetwork: ['25GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB*2', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['SZA01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708815',
        status: '已停止',
        gpu: ['WQDX_A800*4', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['Intel_4314*2', 'Intel_4314*2', 'Intel_8468*2'],
        memory: ['128G', '256G', '128G_4800*16'],
        storage: ['SATA_4T*6', 'SATA_4T*12', 'NVME_7.68T*4'],
        vpcNetwork: ['10GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*4', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['HZA01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708816',
        status: '正常运行',
        gpu: ['WQDX_A800*8', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['Intel_8468*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['64G_4800*16', '64G_4800*16', '128G_4800*16'],
        storage: ['NVME_3.84T*4', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['200GE_RoCE*2', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['200GE_IB*8', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '200GE_RoCE*2',
        rack: ['GZA01', 'GZA01', 'SHB02']
    },
    {
        sn: '9800171603708817',
        status: '正常运行',
        gpu: ['WQDX_A800*8', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['Intel_8468*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['64G_4800*16', '64G_4800*16', '128G_4800*16'],
        storage: ['NVME_3.84T*4', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['200GE_RoCE*2', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['200GE_IB*8', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '200GE_RoCE*2',
        rack: ['GZA01', 'GZA01', 'SHB02']
    },
    {
        sn: '9800171603708818',
        status: '正常运行',
        gpu: ['WQDX_A800*8', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['Intel_8468*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['64G_4800*16', '64G_4800*16', '128G_4800*16'],
        storage: ['NVME_3.84T*4', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['200GE_RoCE*2', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['200GE_IB*8', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '200GE_RoCE*2',
        rack: ['GZA01', 'GZA01', 'SHB02']
    }
];

type GroupedChangeSummary = {
  hardwareChanges: Map<string, { sns: string[], changes: string[] }>;
  relocationChanges: Map<string, { from: string[], sns: string[] }>;
};

type FormattedUpgradePlan = {
  sn: string;
  rows: {
    component: keyof ServerHardwareConfig;
    current: string | undefined;
    target: string | undefined;
    changes: UpgradePlanChangeItem[];
    requirements?: string;
  }[];
}

type GroupedUpgradePlans = Map<string, FormattedUpgradePlan[]>;

const componentSpecificOptions = {
    cpu: {
        spec: [
            { value: 'Intel_8468', label: 'Intel_8468' },
            { value: 'Intel_5318Y', label: 'Intel_5318Y' },
            { value: 'WQDX_8358P', label: 'WQDX_8358P' },
            { value: 'Intel_4314', label: 'Intel_4314' },
        ],
        model: [
            { value: 'P-8468', label: 'P-8468' },
            { value: 'P-5318Y', label: 'P-5318Y' },
        ],
    },
    memory: {
        spec: [
            { value: '64G_4800', label: '64G_4800' },
            { value: '128G_4800', label: '128G_4800' },
            { value: '32G_3200', label: '32G_3200' },
            { value: '64G_3200', label: '64G_3200' },
        ],
        model: [
            { value: 'MEM-64-4800', label: 'MEM-64-4800' },
            { value: 'MEM-128-4800', label: 'MEM-128-4800' },
        ],
    },
    storage: {
        spec: [
            { value: 'NVME_3.84T', label: 'NVME_3.84T' },
            { value: 'NVME_7.68T', label: 'NVME_7.68T' },
            { value: 'NVME_1.92T', label: 'NVME_1.92T' },
            { value: 'SATA_4T', label: 'SATA_4T' },
        ],
        model: [
            { value: 'NVME-3.84T-U2', label: 'NVME-3.84T-U2' },
            { value: 'NVME-7.68T-U2', label: 'NVME-7.68T-U2' },
        ],
    },
    gpu: {
        spec: [
            { value: 'WQDX_A800', label: 'WQDX_A800' },
            { value: 'WQDX_H800', label: 'WQDX_H800' },
            { value: 'WQDX_GM302', label: 'WQDX_GM302' },
        ],
        model: [
            { value: 'GPU-A800-80G', label: 'GPU-A800-80G' },
            { value: 'GPU-H800-80G', label: 'GPU-H800-80G' },
        ],
    },
    vpcNetwork: {
        spec: [
            { value: '200GE_RoCE', label: '200GE_RoCE' },
            { value: '25GE_2', label: '25GE_2' },
            { value: '10GE_2', label: '10GE_2' },
        ],
        model: [{ value: 'NIC-200GE-CX6', label: 'NIC-200GE-CX6' }],
    },
    computeNetwork: {
        spec: [
            { value: '200GE_IB', label: '200GE_IB' },
            { value: '400GE_IB', label: '400GE_IB' },
            { value: '100GE_IB', label: '100GE_IB' },
        ],
        model: [
            { value: 'NIC-200GE-IB', label: 'NIC-200GE-IB' },
            { value: 'NIC-400GE-IB', label: 'NIC-400GE-IB' },
        ],
    },
    storageNetwork: {
        spec: [
            { value: '200GE_RoCE', label: '200GE_RoCE' },
        ],
        model: [{ value: 'NIC-200GE-CX6', label: 'NIC-200GE-CX6' }],
    },
    nic: {
        spec: [],
        model: []
    }
};

const getOptionsForComponent = (component: keyof ServerHardwareConfig, type: 'spec' | 'model') => {
    return componentSpecificOptions[component]?.[type] || [];
};


function DeliveryPage() {
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpgradePlanDialogOpen, setIsUpgradePlanDialogOpen] = useState(false);
    const [isConfirmingUpgrade, setIsConfirmingUpgrade] = useState(false);
    const [changeSummary, setChangeSummary] = useState<GroupedChangeSummary | null>(null);
    const [upgradePlanData, setUpgradePlanData] = useState<GroupedUpgradePlans>(new Map());
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

    const handleViewUpgradePlan = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const rawPlans: UpgradePlan[] = [
            {
                sn: '9800171603708813',
                currentConfig: { cpu: 'Intel_4314*2', memory: '128G', storage: 'SATA_4T*12', gpu: 'WQDX_GM302*4', vpcNetwork: '10GE_2*1', computeNetwork: '100GE_IB*2' },
                targetConfig: { cpu: 'Intel_8468*2', memory: '64G_4800*16', storage: 'NVME_3.84T*4', gpu: 'WQDX_A800*8', vpcNetwork: '200GE_RoCE*2', computeNetwork: '200GE_IB*8' },
                requirements: {
                    memory: 'SPEED: 4800, 容量: 64G',
                    storage: '接口速率: 12Gb/s, 颗粒类型: TLC, 耐用等级: 3 DWPD, 部件版本: v2'
                },
                changes: [
                    { component: 'cpu', action: 'remove', detail: 'Intel_4314*2' },
                    { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                    { component: 'memory', action: 'remove', detail: '128G' },
                    { component: 'memory', action: 'add', detail: '64G_4800*16', model: 'MEM-64-4800', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'sufficient', quantity: 100 } } },
                    { component: 'storage', action: 'remove', detail: 'SATA_4T*12' },
                    { component: 'storage', action: 'add', detail: 'NVME_3.84T*4', model: 'NVME-3.84T-U2', stock: { currentLocation: { status: 'sufficient', quantity: 10 }, targetLocation: { status: 'sufficient', quantity: 30 } } },
                    { component: 'gpu', action: 'remove', detail: 'WQDX_GM302*4' },
                    { component: 'gpu', action: 'add', detail: 'WQDX_A800*8', model: 'GPU-A800-80G', stock: { currentLocation: { status: 'sufficient', quantity: 5 }, targetLocation: { status: 'sufficient', quantity: 12 } } },
                    { component: 'vpcNetwork', action: 'remove', detail: '10GE_2*1' },
                    { component: 'vpcNetwork', action: 'add', detail: '200GE_RoCE*2', model: 'NIC-200GE-CX6', stock: { currentLocation: { status: 'sufficient', quantity: 30 }, targetLocation: { status: 'sufficient', quantity: 80 } } },
                    { component: 'computeNetwork', action: 'remove', detail: '100GE_IB*2' },
                    { component: 'computeNetwork', action: 'add', detail: '200GE_IB*8', model: 'NIC-200GE-IB', stock: { currentLocation: { status: 'sufficient', quantity: 10 }, targetLocation: { status: 'sufficient', quantity: 40 } } },
                ]
            },
            {
                sn: '9800171603708814',
                currentConfig: { cpu: 'WQDX_8358P*2', memory: 'WQDX_32G_3200*16', gpu: 'WQDX_GM302*4', storage: 'SATA_480G*2', vpcNetwork: '25GE_2*1', computeNetwork: '100GE_IB*2' },
                targetConfig: { cpu: 'Intel_8468*2', memory: '128G_4800*16', gpu: 'WQDX_H800*8', storage: 'NVME_7.68T*4', vpcNetwork: '200GE_RoCE*2', computeNetwork: '400GE_IB*8' },
                requirements: {
                    gpu: '必须为最新固件版本',
                },
                changes: [
                    { component: 'cpu', action: 'remove', detail: 'WQDX_8358P*2' },
                    { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 15 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                    { component: 'memory', action: 'remove', detail: 'WQDX_32G_3200*16' },
                    { component: 'memory', action: 'add', detail: '128G_4800*16', model: 'MEM-128-4800', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 60 } } },
                    { component: 'storage', action: 'remove', detail: 'SATA_480G*2' },
                    { component: 'storage', action: 'add', detail: 'NVME_7.68T*4', model: 'NVME-7.68T-U2', stock: { currentLocation: { status: 'insufficient', quantity: 1 }, targetLocation: { status: 'sufficient', quantity: 25 } } },
                    { component: 'gpu', action: 'remove', detail: 'WQDX_GM302*4' },
                    { component: 'gpu', action: 'add', detail: 'WQDX_H800*8', model: 'GPU-H800-80G', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'insufficient', quantity: 2 } } },
                    { component: 'vpcNetwork', action: 'remove', detail: '25GE_2*1' },
                    { component: 'vpcNetwork', action: 'add', detail: '200GE_RoCE*2', model: 'NIC-200GE-CX6', stock: { currentLocation: { status: 'sufficient', quantity: 18 }, targetLocation: { status: 'sufficient', quantity: 80 } } },
                    { component: 'computeNetwork', action: 'remove', detail: '100GE_IB*2' },
                    { component: 'computeNetwork', action: 'add', detail: '400GE_IB*8', model: 'NIC-400GE-IB', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'sufficient', quantity: 20 } } },
                ]
            }
        ];
        
        const grouped = new Map<string, FormattedUpgradePlan[]>();

        rawPlans.forEach(plan => {
            const server = deliveryData.find(d => d.sn === plan.sn);
            const currentLocation = server ? server.rack[0] : '未知机房';
            
            if (!grouped.has(currentLocation)) {
                grouped.set(currentLocation, []);
            }

            const components: (keyof ServerHardwareConfig)[] = ['cpu', 'gpu', 'memory', 'storage', 'vpcNetwork', 'computeNetwork', 'storageNetwork', 'nic'];
            const rows = components.map(comp => {
                return {
                    component: comp,
                    current: plan.currentConfig[comp],
                    target: plan.targetConfig[comp],
                    changes: plan.changes.filter(c => c.component === comp),
                    requirements: plan.requirements?.[comp]
                }
            }).filter(row => row.current || row.target || row.changes.length > 0);

            grouped.get(currentLocation)!.push({ sn: plan.sn, rows });
        });

        setUpgradePlanData(grouped);
        setIsLoading(false);
        setIsUpgradePlanDialogOpen(true);
    }
    
    const handlePlanChange = (location: string, planIndex: number, rowIndex: number, changeIndex: number, field: 'detail' | 'model' | 'quantity', value: string | number) => {
        setUpgradePlanData(prevData => {
            const newData = new Map(prevData);
            const plans = newData.get(location);
            if (!plans) return prevData;
    
            const newPlans = [...plans];
            const planToUpdate = { ...newPlans[planIndex] };
            const newRows = [...planToUpdate.rows];
            const rowToUpdate = { ...newRows[rowIndex] };
            const newChanges = [...rowToUpdate.changes];
            const changeToUpdate = { ...newChanges[changeIndex] };
    
            if (field === 'quantity') {
                const detailParts = changeToUpdate.detail.split('*');
                const newDetail = `${detailParts[0]}*${value}`;
                changeToUpdate.detail = newDetail;
            } else {
                 (changeToUpdate as any)[field] = value;
            }
            
            if (field === 'detail') {
                 const detailParts = (value as string).split('*');
                 if(detailParts.length > 1) {
                    (changeToUpdate as any)['quantity'] = detailParts[1];
                 }
                 changeToUpdate.detail = value as string;
            }
    
            newChanges[changeIndex] = changeToUpdate;
            rowToUpdate.changes = newChanges;
            newRows[rowIndex] = rowToUpdate;
            planToUpdate.rows = newRows;
            newPlans[planIndex] = planToUpdate;
            newData.set(location, newPlans);
    
            return newData;
        });
    };

    const handleSubmitWorkOrder = () => {
        // Simulate API call
        const nocId = `NOC-${Math.floor(Math.random() * 100000)}`
        toast({
            title: "工单创建成功",
            description: `NOC工单 ${nocId} 已创建。您可以在“工单进度”页面查看操作工单进度。`,
            variant: "default",
        })
    }

    const renderUpgradePlanTable = (readOnly = false) => {
        const ReadOnlyCell = ({ value }: { value: string | number | undefined }) => <span className="px-3 py-2 text-sm">{value || 'N/A'}</span>;

        return (
             <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-4">
                {Array.from(upgradePlanData.entries()).map(([location, plans]) => (
                    <div key={location}>
                        <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-background py-2">
                            服务器当前所在机房: <Badge variant="secondary">{location}</Badge>
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            {plans.map((plan, planIndex) => (
                                 <AccordionItem value={plan.sn} key={plan.sn}>
                                    <AccordionTrigger>
                                        <span className="font-mono text-base">{plan.sn}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-6">
                                         <div className="border rounded-md">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[10%]">配件类型</TableHead>
                                                        <TableHead className="w-[15%]">当前配置</TableHead>
                                                        <TableHead className="w-[15%]">目标配置</TableHead>
                                                        <TableHead className="w-[8%] text-center">操作</TableHead>
                                                        <TableHead>规格</TableHead>
                                                        <TableHead className="w-[8%]">数量</TableHead>
                                                        <TableHead className="w-[10%]">Model</TableHead>
                                                        <TableHead className="w-[12%] text-right">当前机房库存</TableHead>
                                                        <TableHead className="w-[12%] text-right">目标机房库存</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                   {plan.rows.map((row, rowIndex) => {
                                                        const hasRequirements = !!row.requirements;
                                                        const baseRowSpan = row.changes.length || 1;
                                                        const rowSpan = hasRequirements ? baseRowSpan + 1 : baseRowSpan;

                                                        const changeRows = row.changes.map((change, changeIndex) => {
                                                            const detailParts = change.detail.split('*') || [];
                                                            const detailSpec = detailParts[0] || change.detail || '';
                                                            const detailQty = detailParts[1] || '1';
                                                            const isRemovable = change.action === 'remove';

                                                            return (
                                                                <TableRow key={`${row.component}-${changeIndex}`}>
                                                                    {changeIndex === 0 && (
                                                                        <>
                                                                            <TableCell rowSpan={rowSpan} className="font-medium capitalize align-top pt-4">{row.component}</TableCell>
                                                                            <TableCell rowSpan={rowSpan} className="text-muted-foreground align-top pt-4">{row.current || '无'}</TableCell>
                                                                            <TableCell rowSpan={rowSpan} className="text-muted-foreground align-top pt-4">{row.target || '无'}</TableCell>
                                                                        </>
                                                                    )}
                                                                    <TableCell className={cn("text-center", change.action === 'remove' ? 'text-red-600' : 'text-green-600')}>
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            {change.action === 'remove' ? <Minus size={14}/> : <Plus size={14}/>}
                                                                            {change.action === 'remove' ? '拆下' : '新增'}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {readOnly || isRemovable ? <ReadOnlyCell value={detailSpec} /> :
                                                                         <SearchableSelect
                                                                            options={getOptionsForComponent(row.component, 'spec')}
                                                                            value={detailSpec}
                                                                            onValueChange={(value) => handlePlanChange(location, planIndex, rowIndex, changeIndex, 'detail', value)}
                                                                            placeholder="搜索或选择规格"
                                                                         />
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                         {readOnly || isRemovable ? <ReadOnlyCell value={detailQty} /> :
                                                                        <Input 
                                                                            type="number"
                                                                            value={detailQty} 
                                                                            onChange={(e) => handlePlanChange(location, planIndex, rowIndex, changeIndex, 'quantity', e.target.value)}
                                                                            className="h-9 w-16"
                                                                            disabled={isRemovable}
                                                                        /> }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                         {readOnly || isRemovable ? <ReadOnlyCell value={change.model} /> :
                                                                         <SearchableSelect
                                                                            options={getOptionsForComponent(row.component, 'model')}
                                                                            value={change.model || ''}
                                                                            onValueChange={(value) => handlePlanChange(location, planIndex, rowIndex, changeIndex, 'model', value)}
                                                                            placeholder="搜索或选择Model"
                                                                         />
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        {change.stock?.currentLocation ? (
                                                                            <span className={cn("flex items-center justify-end", change.stock.currentLocation.status === 'sufficient' ? 'text-green-600' : 'text-red-600')}>
                                                                                {change.stock.currentLocation.status === 'sufficient' ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                                                                                ({change.stock.currentLocation.quantity}) {change.stock.currentLocation.status === 'sufficient' ? `满足` : `不足`}
                                                                            </span>
                                                                        ) : 'N/A'}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        {change.stock?.targetLocation ? (
                                                                            <span className={cn("flex items-center justify-end", change.stock.targetLocation.status === 'sufficient' ? 'text-green-600' : 'text-red-600')}>
                                                                                {change.stock.targetLocation.status === 'sufficient' ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                                                                                ({change.stock.targetLocation.quantity}) {change.stock.targetLocation.status === 'sufficient' ? `满足` : `不足`}
                                                                            </span>
                                                                        ) : 'N/A'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        });

                                                        if (row.changes.length === 0) {
                                                            changeRows.push(
                                                                <TableRow key={`${row.component}-nochange`}>
                                                                    <TableCell rowSpan={rowSpan} className="font-medium capitalize align-top pt-4">{row.component}</TableCell>
                                                                    <TableCell rowSpan={rowSpan} className="text-muted-foreground align-top pt-4">{row.current || '无'}</TableCell>
                                                                    <TableCell rowSpan={rowSpan} className="text-muted-foreground align-top pt-4">{row.target || '无'}</TableCell>
                                                                    <TableCell colSpan={6} className="text-center text-muted-foreground">无变更</TableCell>
                                                                </TableRow>
                                                            );
                                                        }

                                                        const requirementsRow = hasRequirements ? (
                                                            <TableRow key={`${row.component}-reqs`}>
                                                                <TableCell colSpan={6} className="text-xs text-muted-foreground py-1 px-4 bg-gray-50">
                                                                    <span className="font-semibold text-gray-600">性能要求: </span>{row.requirements}
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : null;
                                                        
                                                        return (
                                                            <React.Fragment key={row.component}>
                                                                {changeRows}
                                                                {requirementsRow}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                         </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        )
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
                    <TabsTrigger value="bom" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 text-muted-foreground font-medium">BOM&amp;采购</TabsTrigger>
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
                                    <Button variant="outline" onClick={handleViewUpgradePlan} disabled={isLoading}>
                                         {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        查看改配方案
                                    </Button>
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
                                                        {Array.isArray(item.gpu) ? item.gpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.gpu}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                        {Array.isArray(item.cpu) ? item.cpu.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.cpu}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                        {Array.isArray(item.memory) ? item.memory.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.memory}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                        {Array.isArray(item.storage) ? item.storage.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.storage}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                        {Array.isArray(item.vpcNetwork) ? item.vpcNetwork.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.vpcNetwork}</p>}
                                                        </TableCell>
                                                        <TableCell>
                                                        {Array.isArray(item.computeNetwork) ? item.computeNetwork.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.computeNetwork}</p>}
                                                        </TableCell>
                                                        <TableCell><p className="text-xs">{item.storageNetwork}</p></TableCell>
                                                        <TableCell>
                                                            {Array.isArray(item.rack) ? item.rack.map((line, i) => <p key={i} className={cn('text-xs', {'text-blue-600': i === 1}, {'text-red-600': i === 2})}>{line}</p>) : <p className="text-xs">{item.rack}</p>}
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
                        系统检测到以下配置变更，请确认是否继续发起NOC工单。涉及多个机房的，系统将会拆分多个NOC工单
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                    {changeSummary && (changeSummary.hardwareChanges.size > 0 || changeSummary.relocationChanges.size > 0) ? (
                        <>
                            {changeSummary.hardwareChanges.size > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-lg flex items-center"><Wrench className="mr-2 h-5 w-5 text-blue-500" />硬件改配</h4>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="urgent-no-test" />
                                            <Label htmlFor="urgent-no-test" className="text-sm font-normal text-muted-foreground">紧急项目，不需要压测</Label>
                                        </div>
                                    </div>
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
                                            <div className="space-y-6 pt-4 border-t mt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="flex items-center space-x-4">
                                                        <Label>是否混布</Label>
                                                        <RadioGroup defaultValue="no" className="flex">
                                                            <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id={`mixed-no-${to}`} />
                                                            <Label htmlFor={`mixed-no-${to}`} className="font-normal">否</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id={`mixed-yes-${to}`} />
                                                            <Label htmlFor={`mixed-yes-${to}`} className="font-normal">是</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`multi-tor-${to}`}>多机柜多TOR</Label>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger id={`multi-tor-${to}`}>
                                                            <SelectValue placeholder="选择" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                            <SelectItem value="all">ALL</SelectItem>
                                                            <SelectItem value="option1">选项1</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                     <div className="space-y-2">
                                                        <Label htmlFor={`business-props-${to}`}>业务属性</Label>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger id={`business-props-${to}`}>
                                                            <SelectValue placeholder="选择" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">ALL</SelectItem>
                                                                <SelectItem value="xrllm">XRLLM</SelectItem>
                                                                <SelectItem value="epc">EPC</SelectItem>
                                                                <SelectItem value="other">其它</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`cluster-${to}`}>独立集群</Label>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger id={`cluster-${to}`}>
                                                            <SelectValue placeholder="选择" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">ALL</SelectItem>
                                                                <SelectItem value="yes">是</SelectItem>
                                                                <SelectItem value="no">否</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`description-${to}`}>描述</Label>
                                                    <Textarea id={`description-${to}`} placeholder="输入描述..." />
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
                    <AlertDialogAction onClick={handleSubmitWorkOrder}>确认提交</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isUpgradePlanDialogOpen} onOpenChange={(open) => {
            if (!open) {
                setIsUpgradePlanDialogOpen(false);
                setIsConfirmingUpgrade(false);
            } else {
                setIsUpgradePlanDialogOpen(true);
            }
        }}>
            <AlertDialogContent className="max-w-7xl">
                {isConfirmingUpgrade ? (
                     <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确认改配方案</AlertDialogTitle>
                            <AlertDialogDescription>
                                请仔细核对以下最终改配方案。确认后将生成NOC工单。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {renderUpgradePlanTable(true)}
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setIsConfirmingUpgrade(false)}>返回修改</Button>
                            <Button onClick={() => {
                                setIsConfirmingUpgrade(false);
                                setIsUpgradePlanDialogOpen(false);
                                handleSubmitWorkOrder();
                            }}>确认并提交工单</Button>
                        </AlertDialogFooter>
                    </>
                ) : (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>查看改配方案</AlertDialogTitle>
                            <AlertDialogDescription>
                                以下为检测到的需要进行硬件改配的服务器方案详情。您可以直接修改规格、Model和数量。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {renderUpgradePlanTable()}
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setIsUpgradePlanDialogOpen(false)}>取消编辑</Button>
                            <Button variant="secondary" onClick={() => toast({ title: "草稿已保存", description: "您的修改已暂存。" })}>暂存</Button>
                            <Button onClick={() => setIsConfirmingUpgrade(true)}>提交</Button>
                        </AlertDialogFooter>
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

export default DeliveryPage;

    