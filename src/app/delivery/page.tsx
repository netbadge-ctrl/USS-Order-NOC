
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
  X,
  FileX,
  FileWarning,
  FileCheck2,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import type { UpgradePlan, UpgradePlanChangeItem, ServerHardwareConfig, FormattedUpgradePlan } from '@/lib/types';
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
        gpu: ['WQDX_GM302*4', 'WQDX_A800*8', 'WQDX_H800*8'],
        cpu: ['Intel_4314*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['128G', '64G_4800*16', '128G_4800*16'],
        storage: ['SATA_4T*12', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['10GE_2*1', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['BJF01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708814',
        status: '正常运行',
        gpu: ['WQDX_GM302*4', 'WQDX_H800*8', 'WQDX_H800*8'],
        cpu: ['Intel_4314*2', 'Intel_8358P*2', 'Intel_8468*2'],
        memory: ['WQDX_32G_3200*16', '64G_3200*16', '128G_4800*16'],
        storage: ['SATA_480G*2', 'SATA_480G*2 + NVME_3.84T*2', 'NVME_7.68T*4'],
        vpcNetwork: ['25GE_2*1', '25GE_2*1', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB*2', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['BJF01', 'GZA01', 'GZA01']
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
        rack: ['BJF01', 'GZA01', 'GZA01']
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
        status: '维护中',
        gpu: ['WQDX_GM302*4', 'WQDX_A800*8', 'WQDX_H800*8'],
        cpu: ['Intel_4314*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['128G', '64G_4800*16', '128G_4800*16'],
        storage: ['SATA_4T*12', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['10GE_2*1', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['BJF01', 'GZA01', 'GZA01']
    },
    {
        sn: '9800171603708818',
        status: '维护中',
        gpu: ['WQDX_GM302*4', 'WQDX_A800*8', 'WQDX_H800*8'],
        cpu: ['Intel_4314*2', 'Intel_8468*2', 'Intel_8468*2'],
        memory: ['128G', '64G_4800*16', '128G_4800*16'],
        storage: ['SATA_4T*12', 'NVME_3.84T*4', 'NVME_7.68T*4'],
        vpcNetwork: ['10GE_2*1', '200GE_RoCE*2', '200GE_RoCE*2'],
        computeNetwork: ['100GE_IB*2', '200GE_IB*8', '400GE_IB*8'],
        storageNetwork: '无',
        rack: ['SZA01', 'GZA01', 'GZA01']
    }
];

type GroupedUpgradePlans = Map<string, FormattedUpgradePlan[]>;
type UpgradePlanBatchStatus = 'generating' | 'pending_confirmation' | 'executed' | 'expired';

type UpgradePlanBatch = {
    data: GroupedUpgradePlans;
    createdAt: Date;
    status: UpgradePlanBatchStatus;
}

type GenerationPreview = {
    newSns: string[];
    existingSns: { sn: string; batchIndex: number }[];
};

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

const statusConfig: Record<UpgradePlanBatchStatus, { label: string; className: string }> = {
    generating: { label: '生成中', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    pending_confirmation: { label: '待确认', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    executed: { label: '已生效', className: 'bg-green-100 text-green-800 border-green-200' },
    expired: { label: '已作废', className: 'bg-gray-100 text-gray-800 border-gray-200' },
};


interface UpgradePlanBatchViewProps {
    batch: UpgradePlanBatch;
    batchIndex: number;
    onPlanChange: (batchIndex: number, sn: string, rowIndex: number, changeIndex: number, field: 'detail' | 'model' | 'quantity', value: string | number) => void;
    focusedSn?: string | null;
    isReadOnly?: boolean;
}

function UpgradePlanBatchView({ batch, batchIndex, onPlanChange, focusedSn, isReadOnly: forceReadOnly = false }: UpgradePlanBatchViewProps) {
    const [activeLocation, setActiveLocation] = useState<string | null>(null);

    const upgradePlanData = batch.data;
    let locations = Array.from(upgradePlanData.keys());
    const isReadOnly = forceReadOnly || batch.status !== 'pending_confirmation';

    React.useEffect(() => {
        if (focusedSn && upgradePlanData) {
            for (const [location, plans] of upgradePlanData.entries()) {
                if (plans.some(p => p.sn === focusedSn)) {
                    setActiveLocation(location);
                    break;
                }
            }
        } else if (locations.length > 0 && !activeLocation) {
            setActiveLocation(locations[0]);
        }
    }, [locations, activeLocation, focusedSn, upgradePlanData]);

    if (focusedSn) {
        locations = activeLocation ? [activeLocation] : [];
    }
    
    if (batch.status === 'expired') {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
                <FileX className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-semibold">方案已作废</h3>
                <p>此方案批次已过期或被取消。</p>
            </div>
        );
    }
    
    if (locations.length === 0) {
        return <p>没有可显示的改配方案。</p>;
    }
    
    const summarizeChanges = (plans: FormattedUpgradePlan[]) => {
        const summary = new Map<string, { plan: FormattedUpgradePlan, sns: string[] }>();
        plans.forEach(plan => {
            if (focusedSn && plan.sn !== focusedSn) return;
            
            const key = JSON.stringify({
                rows: plan.rows.map(r => ({
                    component: r.component,
                    current: r.current,
                    target: r.target,
                    requirements: r.requirements,
                    changes: r.changes.map(c => ({ action: c.action, detail: c.detail, model: c.model, stock: c.stock }))
                }))
            });

            if (summary.has(key)) {
                summary.get(key)!.sns.push(plan.sn);
            } else {
                summary.set(key, { plan, sns: [plan.sn] });
            }
        });
        return Array.from(summary.values());
    }


    const plansForLocation = activeLocation ? upgradePlanData.get(activeLocation) || [] : [];
    const summarizedPlans = summarizeChanges(plansForLocation);
    const ReadOnlyCell = ({ value }: { value: string | number | undefined }) => <span className="px-3 py-2 text-sm">{value || 'N/A'}</span>;

    const handleAggregatedPlanChange = (
        sns: string[],
        rowIndex: number,
        changeIndex: number,
        field: 'detail' | 'model' | 'quantity',
        value: string | number
    ) => {
        sns.forEach(sn => {
            onPlanChange(batchIndex, sn, rowIndex, changeIndex, field, value);
        });
    };

    return (
        <div className="w-full flex">
            {!focusedSn && (
                <div className="w-48 pr-4 border-r">
                    <h4 className="text-sm font-semibold mb-2 px-2">机房列表</h4>
                    <div className="flex flex-col gap-1">
                        {locations.map(location => (
                            <Button
                                key={location}
                                variant={activeLocation === location ? 'secondary' : 'ghost'}
                                onClick={() => setActiveLocation(location)}
                                className="justify-start w-full"
                            >
                                {location}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <div className={cn("flex-1", !focusedSn && "pl-4")}>
                <div className="max-h-[65vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {summarizedPlans.map(({ plan, sns }) => (
                            <div key={plan.sn}>
                                <h3 className="font-mono text-base font-semibold mb-2">服务器SN: {sns.join(', ')}</h3>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[10%]">配件类型</TableHead>
                                                <TableHead className="w-[15%]">当前配置</TableHead>
                                                <TableHead className="w-[15%]">目标配置</TableHead>
                                                <TableHead className="w-[8%] text-center">操作</TableHead>
                                                <TableHead>规格</TableHead>
                                                <TableHead className="w-[10%]">数量</TableHead>
                                                <TableHead className="w-[10%]">Model</TableHead>
                                                <TableHead className="w-[12%] text-right">当前机房库存</TableHead>
                                                <TableHead className="w-[12%] text-right">目标机房库存</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {plan.rows.map((row, rowIndex) => {
                                                const hasRequirements = !!row.requirements;
                                                const rowSpan = row.changes.length || 1;

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
                                                                    <TableCell rowSpan={rowSpan} className="text-muted-foreground align-top pt-4">
                                                                        <div>{row.target || '无'}</div>
                                                                        {hasRequirements && (
                                                                            <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1.5">
                                                                                <Info size={14} />
                                                                                <span>{row.requirements}</span>
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                            <TableCell className={cn("text-center", change.action === 'remove' ? 'text-red-600' : 'text-green-600')}>
                                                                <div className="flex items-center justify-center gap-1">
                                                                    {change.action === 'remove' ? <Minus size={14}/> : <Plus size={14}/>}
                                                                    {change.action === 'remove' ? '拆下' : '新增'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {isReadOnly || isRemovable ? <ReadOnlyCell value={detailSpec} /> :
                                                                <SearchableSelect
                                                                    options={getOptionsForComponent(row.component, 'spec')}
                                                                    value={detailSpec}
                                                                    onValueChange={(value) => handleAggregatedPlanChange(sns, rowIndex, changeIndex, 'detail', value)}
                                                                    placeholder="搜索或选择规格"
                                                                    disabled={isRemovable}
                                                                />
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {isReadOnly || isRemovable ? <ReadOnlyCell value={detailQty} /> :
                                                                <Input 
                                                                    type="number"
                                                                    value={detailQty} 
                                                                    onChange={(e) => handleAggregatedPlanChange(sns, rowIndex, changeIndex, 'quantity', e.target.value)}
                                                                    className="h-9 w-16"
                                                                    disabled={isRemovable}
                                                                /> }
                                                            </TableCell>
                                                            <TableCell>
                                                                {isReadOnly || isRemovable ? <ReadOnlyCell value={change.model} /> :
                                                                <SearchableSelect
                                                                    options={getOptionsForComponent(row.component, 'model')}
                                                                    value={change.model || ''}
                                                                    onValueChange={(value) => handleAggregatedPlanChange(sns, rowIndex, changeIndex, 'model', value)}
                                                                    placeholder="搜索或选择Model"
                                                                    disabled={isRemovable}
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
                                                        <React.Fragment key={`${row.component}-nochange`}>
                                                            <TableRow>
                                                                <TableCell className="font-medium capitalize">{row.component}</TableCell>
                                                                <TableCell className="text-muted-foreground">{row.current || '无'}</TableCell>
                                                                <TableCell className="text-muted-foreground">
                                                                    <div>{row.target || '无'}</div>
                                                                </TableCell>
                                                                <TableCell colSpan={7} className="text-center text-muted-foreground">无变更</TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    );
                                                }

                                                return (
                                                    <React.Fragment key={row.component}>
                                                        {changeRows}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeliveryPage() {
    const { toast } = useToast()
    const [isUpgradePlanDialogOpen, setIsUpgradePlanDialogOpen] = useState(false);
    const [isConfirmingUpgrade, setIsConfirmingUpgrade] = useState(false);
    const [upgradePlanBatches, setUpgradePlanBatches] = useState<UpgradePlanBatch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeBatchTab, setActiveBatchTab] = useState<string>('');
    const [focusedSnForPlan, setFocusedSnForPlan] = useState<string | null>(null);
    
    const [isConfirmingGeneration, setIsConfirmingGeneration] = useState(false);
    const [generationPreview, setGenerationPreview] = useState<GenerationPreview>({ newSns: [], existingSns: [] });


    const handleInitiateWorkOrder = () => {
        const existingSnsInPlans = new Map<string, number>();
        upgradePlanBatches.forEach((batch, batchIndex) => {
            if (batch.status === 'expired') return;
            for (const plans of batch.data.values()) {
                plans.forEach(plan => {
                    existingSnsInPlans.set(plan.sn, batchIndex + 1);
                });
            }
        });

        const newSns: string[] = [];
        const existingSns: { sn: string; batchIndex: number }[] = [];

        deliveryData.forEach(server => {
            if (existingSnsInPlans.has(server.sn)) {
                existingSns.push({ sn: server.sn, batchIndex: existingSnsInPlans.get(server.sn)! });
            } else {
                newSns.push(server.sn);
            }
        });
        
        setGenerationPreview({ newSns, existingSns });
        setIsConfirmingGeneration(true);
    };

    const handleConfirmGeneration = () => {
        setIsLoading(true);

        const snsToProcess = generationPreview.newSns;

        if (snsToProcess.length === 0) {
            toast({
                variant: "destructive",
                title: "没有可生成的方案",
                description: "所有服务器都已在现有方案中或清单为空。",
            });
            setIsLoading(false);
            setIsConfirmingGeneration(false);
            return;
        }
        
        // This is a placeholder for a more complex logic.
        const newPlans: UpgradePlan[] = snsToProcess.map(sn => {
             // A simple placeholder logic, in reality this would be a complex generation
            const server = deliveryData.find(d => d.sn === sn)!;
            return {
                sn: server.sn,
                currentConfig: { cpu: server.cpu[0], memory: server.memory[0], storage: server.storage[0], gpu: server.gpu[0], vpcNetwork: server.vpcNetwork[0], computeNetwork: server.computeNetwork[0] },
                targetConfig: { cpu: server.cpu[1], memory: server.memory[1], storage: server.storage[1], gpu: server.gpu[1], vpcNetwork: server.vpcNetwork[1], computeNetwork: server.computeNetwork[1] },
                changes: [
                    { component: 'cpu', action: 'remove', detail: server.cpu[0] },
                    { component: 'cpu', action: 'add', detail: server.cpu[1], model: 'P-8468' },
                ]
            };
        });

        const newBatch: UpgradePlanBatch = { data: processUpgradePlans(newPlans), createdAt: new Date(), status: 'pending_confirmation' };
        
        setUpgradePlanBatches(prev => [...prev, newBatch]);

        toast({
            title: "改配方案已生成",
            description: `已为 ${snsToProcess.length} 台服务器生成新的改配方案。`,
        });

        setIsLoading(false);
        setIsConfirmingGeneration(false);
    };

    const processUpgradePlans = (rawPlans: UpgradePlan[]): GroupedUpgradePlans => {
        const grouped = new Map<string, FormattedUpgradePlan[]>();

        rawPlans.forEach(plan => {
            const server = deliveryData.find(d => d.sn === plan.sn);
            // In the mock data, server.rack can be an array. We take the first one.
            const currentLocation = server ? (Array.isArray(server.rack) ? server.rack[0] : server.rack) : '未知机房';
            
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
        return grouped;
    }


    const handleViewUpgradePlan = async (sn?: string) => {
        setIsLoading(true);
        if (sn) {
            setFocusedSnForPlan(sn);
        }

        if (upgradePlanBatches.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const batch1: UpgradePlanBatch = {
                data: processUpgradePlans([{
                    sn: '9800171603708816', currentConfig: { cpu: 'Intel_8468*2' }, targetConfig: { cpu: 'Intel_8468*2' },
                    changes: []
                }]),
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                status: 'expired'
            };

            const identicalPlan = {
                currentConfig: { cpu: 'Intel_4314*2', memory: '128G', storage: 'SATA_4T*12', gpu: 'WQDX_GM302*4', vpcNetwork: '10GE_2*1', computeNetwork: '100GE_IB*2' },
                targetConfig: { cpu: 'Intel_8468*2', memory: '64G_4800*16', storage: 'NVME_3.84T*4', gpu: 'WQDX_A800*8', vpcNetwork: '200GE_RoCE*2', computeNetwork: '200GE_IB*8' },
                requirements: { memory: 'SPEED: 4800, 容量: 64G', storage: '接口速率: 12Gb/s, 颗粒类型: TLC, 耐用等级: 3 DWPD, 部件版本: v2' },
                changes: [
                    { component: 'cpu', action: 'remove', detail: 'Intel_4314*2' },
                    { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                    { component: 'memory', action: 'remove', detail: '128G' },
                    { component: 'memory', action: 'add', detail: '64G_4800*16', model: 'MEM-64-4800', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'sufficient', quantity: 100 } } },
                ]
            };

            const batch2: UpgradePlanBatch = {
                data: processUpgradePlans([
                    { sn: '9800171603708813', ...identicalPlan },
                    { sn: '9800171603708814', ...identicalPlan },
                    { sn: '9800171603708815', ...identicalPlan },
                    {
                        sn: '9800171603708817',
                        currentConfig: { cpu: 'Intel_4314*2', memory: '128G' },
                        targetConfig: { cpu: 'Intel_8468*2', memory: '64G_4800*16' },
                        requirements: { memory: 'SPEED: 4800, 容量: 64G' },
                        changes: [
                            { component: 'cpu', action: 'remove', detail: 'Intel_4314*2' },
                            { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                        ]
                    }
                ]),
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: 'pending_confirmation'
            };
            
            const batch3: UpgradePlanBatch = {
                data: processUpgradePlans([{
                    sn: '9800171603708818',
                    currentConfig: { storage: 'SATA_T*12' },
                    targetConfig: { storage: 'NVME_3.84T*4' },
                    changes: [{ component: 'storage', action: 'add', detail: 'NVME_3.84T*4', model: 'NVME-3.84T-U2', stock: { currentLocation: { status: 'sufficient', quantity: 5 }, targetLocation: { status: 'sufficient', quantity: 10 } } }]
                }]),
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                status: 'executed'
            };

            const newBatches = [batch1, batch2, batch3];
            setUpgradePlanBatches(newBatches);
            
            const targetBatchIndex = sn 
                ? newBatches.findIndex(batch => Array.from(batch.data.values()).flat().some(p => p.sn === sn))
                : newBatches.findIndex(b => b.status === 'pending_confirmation');

            if (targetBatchIndex !== -1) {
                 setActiveBatchTab(`batch-${targetBatchIndex}`);
            } else if (newBatches.length > 0) {
                 setActiveBatchTab(`batch-${newBatches.length - 1}`);
            }

        } else {
             const targetBatchIndex = sn
                ? upgradePlanBatches.findIndex(batch => Array.from(batch.data.values()).flat().some(p => p.sn === sn))
                : upgradePlanBatches.findIndex(b => b.status === 'pending_confirmation');

             if (targetBatchIndex !== -1) {
                 setActiveBatchTab(`batch-${targetBatchIndex}`);
            } else if (upgradePlanBatches.length > 0) {
                setActiveBatchTab(`batch-${upgradePlanBatches.length - 1}`);
            }
        }
        
        setIsLoading(false);
        setIsUpgradePlanDialogOpen(true);
    }
    
   const handlePlanChange = (batchIndex: number, sn: string, rowIndex: number, changeIndex: number, field: 'detail' | 'model' | 'quantity', value: string | number) => {
        setUpgradePlanBatches(prevBatches => {
            const newBatches = JSON.parse(JSON.stringify(prevBatches));
            const batchToUpdate = newBatches[batchIndex];
            
            for (const [location, plans] of Object.entries(batchToUpdate.data)) {
                 const planIndex = (plans as FormattedUpgradePlan[]).findIndex(p => p.sn === sn);
                 if (planIndex !== -1) {
                    const planToUpdate = (plans as FormattedUpgradePlan[])[planIndex];
                    const rowToUpdate = planToUpdate.rows[rowIndex];
                    const changeToUpdate = rowToUpdate.changes[changeIndex];

                    if (field === 'quantity') {
                        const detailParts = changeToUpdate.detail.split('*');
                        changeToUpdate.detail = `${detailParts[0]}*${value}`;
                    } else if (field === 'detail') {
                        changeToUpdate.detail = value as string;
                        // Keep quantity if it exists, otherwise it might be reset
                        const detailParts = (value as string).split('*');
                        if (detailParts.length <= 1) {
                           const oldQty = changeToUpdate.detail.split('*')[1] || '1';
                           changeToUpdate.detail = `${value}*${oldQty}`;
                        }
                    }
                    else {
                        (changeToUpdate as any)[field] = value;
                    }
                    
                    // Reconstruct Map from object for setting state
                    const finalBatchData = new Map<string, FormattedUpgradePlan[]>();
                    for(const [loc, pls] of Object.entries(batchToUpdate.data)){
                        finalBatchData.set(loc, pls as FormattedUpgradePlan[]);
                    }
                    batchToUpdate.data = finalBatchData;

                    const finalBatches = prevBatches.map((b, i) => i === batchIndex ? { ...b, data: finalBatchData } : b);
                    return finalBatches;
                 }
            }
            return prevBatches;
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

    const handleVoidPlan = (batchIndex: number) => {
        setUpgradePlanBatches(prevBatches => {
            const newBatches = [...prevBatches];
            const batchToUpdate = newBatches[batchIndex];
            if (batchToUpdate) {
                newBatches[batchIndex] = { ...batchToUpdate, status: 'expired' };
            }
            return newBatches;
        });
        toast({
            title: "方案已作废",
            description: `方案批次 #${batchIndex + 1} 已被设置为已作废。`,
        });
    };

    const activeBatchIndex = activeBatchTab ? parseInt(activeBatchTab.split('-')[1]) : -1;
    const activeBatch = activeBatchIndex !== -1 ? upgradePlanBatches[activeBatchIndex] : null;

    const serverPlanMap = useMemo(() => {
        const map = new Map<string, { batchIndex: number }>();
        upgradePlanBatches.forEach((batch, index) => {
            if (batch.status === 'expired') return;
            for (const plans of batch.data.values()) {
                for (const plan of plans) {
                    map.set(plan.sn, { batchIndex: index });
                }
            }
        });
        return map;
    }, [upgradePlanBatches]);


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
                                    <Button variant="outline" onClick={() => handleViewUpgradePlan()} disabled={isLoading}>
                                         {isLoading && !isUpgradePlanDialogOpen && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        查看改配方案
                                    </Button>
                                    <Button variant="default" onClick={handleInitiateWorkOrder} disabled={isLoading}>
                                        {isLoading && isConfirmingGeneration && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        生成改配方案
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
                                                    <TableHead>改配方案</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deliveryData.map((item, index) => {
                                                    const planInfo = serverPlanMap.get(item.sn);
                                                    return (
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
                                                        <TableCell>
                                                            {planInfo ? (
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    className="cursor-pointer hover:bg-primary/20"
                                                                    onClick={() => handleViewUpgradePlan(item.sn)}
                                                                >
                                                                    方案批次 #{planInfo.batchIndex + 1}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">无</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )})}
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
        
        <AlertDialog open={isUpgradePlanDialogOpen} onOpenChange={(open) => {
            if (!open) {
                setIsUpgradePlanDialogOpen(false);
                setIsConfirmingUpgrade(false);
                setFocusedSnForPlan(null); // Reset focused SN when dialog closes
            } else {
                setIsUpgradePlanDialogOpen(true);
            }
        }}>
            <AlertDialogContent className="max-w-7xl">
                 <button
                    onClick={() => setIsUpgradePlanDialogOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {isConfirmingUpgrade ? (
                     <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确认改配方案</AlertDialogTitle>
                            <AlertDialogDescription>
                                请仔细核对以下最终改配方案。确认后将生成NOC工单。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="w-full">
                           {activeBatch && (
                               <UpgradePlanBatchView 
                                   batch={activeBatch}
                                   batchIndex={activeBatchIndex}
                                   onPlanChange={handlePlanChange}
                                   focusedSn={focusedSnForPlan}
                                   isReadOnly={true}
                               />
                           )}
                        </div>

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
                                {focusedSnForPlan 
                                ? `以下为服务器 ${focusedSnForPlan} 的改配方案详情。`
                                : `以下为检测到的需要进行硬件改配的服务器方案详情。您可以直接修改规格、Model和数量。`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {upgradePlanBatches.length > 0 ? (
                        <Tabs defaultValue={activeBatchTab} onValueChange={setActiveBatchTab} className="w-full">
                            {!focusedSnForPlan && (
                                <TabsList>
                                    {upgradePlanBatches.map((batch, batchIndex) => (
                                        <TabsTrigger key={`batch-${batchIndex}`} value={`batch-${batchIndex}`} className="gap-2">
                                            <span>方案批次 #{batchIndex + 1}</span>
                                            <Badge className={cn("font-normal", statusConfig[batch.status].className)}>
                                                {statusConfig[batch.status].label}
                                            </Badge>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            )}
                             {upgradePlanBatches.map((batch, batchIndex) => (
                                <TabsContent key={`batch-content-${batchIndex}`} value={`batch-${batchIndex}`}>
                                     {(activeBatchTab === `batch-${batchIndex}`) && (
                                        <UpgradePlanBatchView 
                                            batch={batch}
                                            batchIndex={batchIndex}
                                            onPlanChange={handlePlanChange}
                                            focusedSn={focusedSnForPlan}
                                        />
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                        ) : <p className="text-sm text-muted-foreground py-8 text-center">暂无改配方案。请先点击“生成改配方案”。</p>}
                        
                        {activeBatch && activeBatch.status === 'pending_confirmation' && !focusedSnForPlan && (
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={() => setIsUpgradePlanDialogOpen(false)}>取消编辑</Button>
                                <Button variant="destructive" onClick={() => handleVoidPlan(activeBatchIndex)}>作废方案</Button>
                                <Button variant="secondary" onClick={() => toast({ title: "草稿已保存", description: "您的修改已暂存。" })}>暂存</Button>
                                <Button onClick={() => setIsConfirmingUpgrade(true)}>提交</Button>
                            </AlertDialogFooter>
                        )}
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isConfirmingGeneration} onOpenChange={setIsConfirmingGeneration}>
            <AlertDialogContent className="sm:max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>确认生成改配方案</AlertDialogTitle>
                    <AlertDialogDescription>
                        系统将在 {deliveryData.length} 台已定型服务器中进行分析。请确认以下清单。
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck2 className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-700">可以生成新方案的SN ({generationPreview.newSns.length})</h4>
                        </div>
                        <ScrollArea className="h-60 w-full rounded-md border p-2 bg-green-50/50">
                            {generationPreview.newSns.length > 0 ? (
                                <div className="p-2 text-sm font-mono space-y-1">
                                    {generationPreview.newSns.map(sn => <div key={sn}>{sn}</div>)}
                                </div>
                            ) : (
                                <div className="p-2 text-sm text-muted-foreground text-center h-full flex items-center justify-center">没有可新生成方案的服务器。</div>
                            )}
                        </ScrollArea>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                           <FileWarning className="h-5 w-5 text-amber-600" />
                            <h4 className="font-semibold text-amber-700">已存在于其它方案的SN ({generationPreview.existingSns.length})</h4>
                        </div>
                         <ScrollArea className="h-60 w-full rounded-md border p-2 bg-amber-50/50">
                            {generationPreview.existingSns.length > 0 ? (
                                <div className="p-2 text-sm font-mono space-y-1">
                                    {generationPreview.existingSns.map(({sn, batchIndex}) => (
                                        <div key={sn} className="flex justify-between items-center">
                                            <span>{sn}</span>
                                            <Badge variant="secondary" className="font-normal">方案批次 #{batchIndex}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 text-sm text-muted-foreground text-center h-full flex items-center justify-center">没有已存在于其它方案的服务器。</div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
                
                {generationPreview.existingSns.length > 0 && (
                    <div className="md:col-span-2">
                        <Alert variant="default" className="mt-2 text-xs border-amber-200 bg-amber-50 text-amber-900">
                            <Info className="h-4 w-4 !text-amber-600" />
                            <AlertDescription>
                                如需对这些SN重新生成改配方案，请先在“查看改配方案”中找到并取消原有方案。
                            </AlertDescription>
                        </Alert>
                    </div>
                )}


                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmGeneration} disabled={generationPreview.newSns.length === 0}>
                        确认生成
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

export default DeliveryPage;
    
    

    

    
    

      

    

    

    

    

    

    

    

    

    

    

    

    

    


    




    

    

    

    

      
