
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
        rack: ['BJF01', 'GZA01', 'GZA01']
    }
];

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
type UpgradePlanBatch = {
    data: GroupedUpgradePlans;
    createdAt: Date;
    status?: 'active' | 'expired';
}

type GenerationPreview = { 
    newSns: string[]; 
    existingSns: { sn: string; batchIndex: number }[];
    total: number;
} | null;

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

interface UpgradePlanBatchViewProps {
    batch: UpgradePlanBatch;
    batchIndex: number;
    readOnly?: boolean;
    onPlanChange: (batchIndex: number, location: string, planIndex: number, rowIndex: number, changeIndex: number, field: 'detail' | 'model' | 'quantity', value: string | number) => void;
}

function UpgradePlanBatchView({ batch, batchIndex, readOnly = false, onPlanChange }: UpgradePlanBatchViewProps) {
    const upgradePlanData = batch.data;
    const locations = Array.from(upgradePlanData.keys());
    const [activeLocation, setActiveLocation] = useState(locations[0]);
    
    if (batch.status === 'expired') {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
                <FileX className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-semibold">方案已失效</h3>
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
            const key = JSON.stringify({
                rows: plan.rows.map(r => ({
                    component: r.component,
                    current: r.current,
                    target: r.target,
                    requirements: r.requirements,
                    changes: r.changes.map(c => ({
                        action: c.action,
                        detail: c.detail,
                        model: c.model,
                    }))
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


    const plansForLocation = upgradePlanData.get(activeLocation) || [];
    const summarizedPlans = summarizeChanges(plansForLocation);
    const ReadOnlyCell = ({ value }: { value: string | number | undefined }) => <span className="px-3 py-2 text-sm">{value || 'N/A'}</span>;

    return (
        <div className="w-full">
            <div className="border-b">
                <div className="mb-4 flex gap-2">
                    {locations.map(location => (
                        <Button
                            key={location}
                            variant={activeLocation === location ? 'secondary' : 'ghost'}
                            onClick={() => setActiveLocation(location)}
                            className="data-[state=active]:shadow-none rounded-md border"
                        >
                            机房: {location}
                        </Button>
                    ))}
                </div>

                <div className="max-h-[65vh] overflow-y-auto pr-4 mt-0">
                    <div className="space-y-6">
                        {summarizedPlans.map(({ plan, sns }, planIndex) => (
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
                                                                {readOnly || isRemovable ? <ReadOnlyCell value={detailSpec} /> :
                                                                <SearchableSelect
                                                                    options={getOptionsForComponent(row.component, 'spec')}
                                                                    value={detailSpec}
                                                                    onValueChange={(value) => { /* handlePlanChange might need adjustment for aggregated view */ }}
                                                                    placeholder="搜索或选择规格"
                                                                    disabled={isRemovable}
                                                                />
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {readOnly || isRemovable ? <ReadOnlyCell value={detailQty} /> :
                                                                <Input 
                                                                    type="number"
                                                                    value={detailQty} 
                                                                    onChange={(e) => { /* handlePlanChange might need adjustment */ }}
                                                                    className="h-9 w-16"
                                                                    disabled={isRemovable}
                                                                /> }
                                                            </TableCell>
                                                            <TableCell>
                                                                {readOnly || isRemovable ? <ReadOnlyCell value={change.model} /> :
                                                                <SearchableSelect
                                                                    options={getOptionsForComponent(row.component, 'model')}
                                                                    value={change.model || ''}
                                                                    onValueChange={(value) => { /* handlePlanChange might need adjustment */ }}
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
                                                                    {hasRequirements && (
                                                                        <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1.5">
                                                                            <Info size={14} />
                                                                            <span>{row.requirements}</span>
                                                                        </div>
                                                                    )}
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
    const [isConfirmingGeneration, setIsConfirmingGeneration] = useState(false);
    const [generationPreview, setGenerationPreview] = useState<GenerationPreview>(null);
    
    const handleInitiateWorkOrder = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); 

        const allSnsInBatches = new Set(
            upgradePlanBatches.flatMap(batch => 
                Array.from(batch.data.values()).flatMap(plans => plans.map(p => p.sn))
            )
        );

        const finalizedSns = deliveryData.map(d => d.sn); 
        
        const newSns = finalizedSns.filter(sn => !allSnsInBatches.has(sn));
        const existingSns = finalizedSns
          .filter(sn => allSnsInBatches.has(sn))
          .map(sn => {
                const batchIndex = upgradePlanBatches.findIndex(batch => 
                    Array.from(batch.data.values()).some(plans => plans.some(p => p.sn === sn))
                );
                return { sn, batchIndex };
          });

        setGenerationPreview({ newSns, existingSns, total: finalizedSns.length });
        setIsConfirmingGeneration(true);
        setIsLoading(false);
    };

    const handleConfirmGeneration = () => {
        if (!generationPreview || generationPreview.newSns.length === 0) {
            toast({
                title: "没有可生成的方案",
                description: "所有已定型服务器均已存在于现有方案中。",
                variant: "default",
            });
            setIsConfirmingGeneration(false);
            return;
        }

        const newSnsForPlan = generationPreview.newSns;

        const mockPlansForNewBatch: UpgradePlan[] = newSnsForPlan.map((sn) => {
            const server = deliveryData.find(d => d.sn === sn);
            return {
                sn: sn,
                currentConfig: { cpu: server?.cpu[0], memory: server?.memory[0], storage: server?.storage[0], gpu: server?.gpu[0], vpcNetwork: server?.vpcNetwork[0], computeNetwork: server?.computeNetwork[0] },
                targetConfig: { cpu: server?.cpu[1], memory: server?.memory[1], storage: server?.storage[1], gpu: server?.gpu[1], vpcNetwork: server?.vpcNetwork[1], computeNetwork: server?.computeNetwork[1] },
                requirements: { memory: 'SPEED: 4800' },
                changes: [
                    { component: 'cpu', action: 'remove', detail: server?.cpu[0] || '' },
                    { component: 'cpu', action: 'add', detail: server?.cpu[1] || '', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                ]
            };
        });
        
        const newBatch: UpgradePlanBatch = {
            data: processUpgradePlans(mockPlansForNewBatch),
            createdAt: new Date(),
            status: 'active',
        };

        setUpgradePlanBatches(prevBatches => [...prevBatches, newBatch]);
        
        toast({
            title: "改配方案已生成",
            description: `已为 ${newSnsForPlan.length} 台服务器生成新的改配方案。`,
            variant: "default",
        });

        setIsConfirmingGeneration(false);
        setGenerationPreview(null);
    };


    const processUpgradePlans = (rawPlans: UpgradePlan[]): GroupedUpgradePlans => {
        const grouped = new Map<string, FormattedUpgradePlan[]>();

        rawPlans.forEach(plan => {
            const server = deliveryData.find(d => d.sn === plan.sn);
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


    const handleViewUpgradePlan = async () => {
        setIsLoading(true);
        // On first view, generate a default batch if none exist
        if (upgradePlanBatches.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const rawPlans1: UpgradePlan[] = [
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
                    ]
                },
                {
                    sn: '9800171603708817', // Same as 8813
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
                    ]
                },
                 {
                    sn: '9800171603708818', // Same as 8813
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
                    ]
                },
                {
                    sn: '9800171603708814',
                    currentConfig: { cpu: 'WQDX_8358P*2', memory: 'WQDX_32G_3200*16', gpu: 'WQDX_GM302*4', storage: 'SATA_480G*2', vpcNetwork: '25GE_2*1', computeNetwork: '100GE_IB*2' },
                    targetConfig: { cpu: 'Intel_8468*2', memory: '128G_4800*16', gpu: 'WQDX_H800*8', storage: 'NVME_7.68T*4', vpcNetwork: '200GE_RoCE*2', computeNetwork: '400GE_IB*8' },
                    requirements: { gpu: '必须为最新固件版本' },
                    changes: [
                        { component: 'gpu', action: 'add', detail: 'WQDX_H800*8', model: 'GPU-H800-80G', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'insufficient', quantity: 2 } } },
                    ]
                }
            ];

            const rawPlans2: UpgradePlan[] = [
                 {
                    sn: '9800171603708815',
                    currentConfig: { cpu: 'Intel_4314*2', memory: '128G', storage: 'SATA_4T*6', gpu: 'WQDX_A800*4', vpcNetwork: '10GE_2*1', computeNetwork: '100GE_IB*4' },
                    targetConfig: { cpu: 'Intel_4314*2', memory: '256G', storage: 'SATA_4T*12', gpu: 'WQDX_H800*8', vpcNetwork: '25GE_2*1', computeNetwork: '200GE_IB*8' },
                    changes: [
                        { component: 'memory', action: 'add', detail: '128G' },
                    ]
                }
            ];
             const rawPlans3: UpgradePlan[] = [
                 {
                    sn: '9800171603708812',
                    currentConfig: { cpu: 'WQDX_8358P*2', memory: 'WQDX_64G_3200*16', storage: 'WQDX_SATA_ARED*2 + WGDX_NVME2.5_7.68T*2', gpu: 'WQDX_GM302*8', vpcNetwork: 'WQDX_25G_2*1 + WGDX', computeNetwork: 'WQDX_200G_1_IB_PCIE4_CX65...*2' },
                    targetConfig: { cpu: 'Intel_8468*2', memory: '64G_4800*16', storage: 'NVME_3.84T*4', gpu: 'WQDX_A800*8', vpcNetwork: '200GE_RoCE*2', computeNetwork: '200GE_IB*8' },
                    changes: [
                        { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
                    ]
                }
            ];

             const batch1: UpgradePlanBatch = { data: processUpgradePlans(rawPlans1), createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'active' };
             const batch2: UpgradePlanBatch = { data: processUpgradePlans(rawPlans2), createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'expired' };
             const batch3: UpgradePlanBatch = { data: processUpgradePlans(rawPlans3), createdAt: new Date(), status: 'active' };

             setUpgradePlanBatches([batch1, batch2, batch3]);
        }
        
        setIsLoading(false);
        setIsUpgradePlanDialogOpen(true);
    }
    
    const handlePlanChange = (batchIndex: number, location: string, planIndex: number, rowIndex: number, changeIndex: number, field: 'detail' | 'model' | 'quantity', value: string | number) => {
        setUpgradePlanBatches(prevBatches => {
            const newBatches = [...prevBatches];
            const batchToUpdate = { ...newBatches[batchIndex] };
            const newBatchData = new Map(batchToUpdate.data);
            const plans = newBatchData.get(location);
            if (!plans) return prevBatches;
    
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
            newBatchData.set(location, newPlans);
            batchToUpdate.data = newBatchData;
            newBatches[batchIndex] = batchToUpdate;
    
            return newBatches;
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
                                    <Button variant="default" onClick={handleInitiateWorkOrder} disabled={isLoading}>
                                        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
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
        
        <AlertDialog open={isUpgradePlanDialogOpen} onOpenChange={(open) => {
            if (!open) {
                setIsUpgradePlanDialogOpen(false);
                setIsConfirmingUpgrade(false);
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
                        <Tabs defaultValue="batch-0" className="w-full">
                            <TabsList>
                                {upgradePlanBatches.map((batch, batchIndex) => (
                                    <TabsTrigger key={`confirm-batch-${batchIndex}`} value={`batch-${batchIndex}`}>
                                        方案批次 #{batchIndex + 1} ({batch.createdAt.toLocaleString()})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                             {upgradePlanBatches.map((batch, batchIndex) => (
                                <TabsContent key={`confirm-batch-content-${batchIndex}`} value={`batch-${batchIndex}`}>
                                     <UpgradePlanBatchView 
                                        batch={batch}
                                        batchIndex={batchIndex}
                                        readOnly={true}
                                        onPlanChange={handlePlanChange}
                                    />
                                </TabsContent>
                            ))}
                        </Tabs>

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
                        {upgradePlanBatches.length > 0 ? (
                        <Tabs defaultValue={`batch-${upgradePlanBatches.length-1}`} className="w-full">
                            <TabsList>
                                {upgradePlanBatches.map((batch, batchIndex) => (
                                    <TabsTrigger key={`batch-${batchIndex}`} value={`batch-${batchIndex}`}>
                                        方案批次 #{batchIndex + 1} ({batch.createdAt.toLocaleString()})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                             {upgradePlanBatches.map((batch, batchIndex) => (
                                <TabsContent key={`batch-content-${batchIndex}`} value={`batch-${batchIndex}`}>
                                    <UpgradePlanBatchView 
                                        batch={batch}
                                        batchIndex={batchIndex}
                                        onPlanChange={handlePlanChange}
                                    />
                                </TabsContent>
                            ))}
                        </Tabs>
                        ) : <p className="text-sm text-muted-foreground py-8 text-center">暂无改配方案。请先点击“生成改配方案”。</p>}
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setIsUpgradePlanDialogOpen(false)}>取消编辑</Button>
                            <Button variant="secondary" onClick={() => toast({ title: "草稿已保存", description: "您的修改已暂存。" })}>暂存</Button>
                            <Button onClick={() => setIsConfirmingUpgrade(true)} disabled={upgradePlanBatches.filter(b => b.status !== 'expired').length === 0}>提交</Button>
                        </AlertDialogFooter>
                    </>
                )}
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={isConfirmingGeneration} onOpenChange={setIsConfirmingGeneration}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认生成改配方案</AlertDialogTitle>
                     {generationPreview && (
                        <AlertDialogDescription>
                            系统将在 {generationPreview.total} 台已定型服务器中进行分析。
                        </AlertDialogDescription>
                     )}
                </AlertDialogHeader>
                <div className="text-sm space-y-4">
                    {generationPreview && generationPreview.newSns.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-green-600 mb-2">本次将为以下SN生成新的改配方案:</h4>
                            <div className="max-h-24 overflow-y-auto rounded-md bg-muted p-2">
                                <ul className="list-disc list-inside">
                                    {generationPreview.newSns.map(sn => <li key={sn} className="font-mono">{sn}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                     {generationPreview && generationPreview.existingSns.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-amber-600 mb-2">以下SN已存在于现有方案中:</h4>
                             <div className="max-h-24 overflow-y-auto rounded-md bg-muted p-2">
                                <ul className="list-disc list-inside">
                                    {generationPreview.existingSns.map(({sn, batchIndex}) => (
                                        <li key={sn} className="font-mono">{sn} (在方案批次 #{batchIndex + 1} 中)</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                如需为这些SN重新生成方案，请先在“查看改配方案”中找到对应批次并处理该方案。
                            </p>
                        </div>
                    )}
                     {generationPreview && generationPreview.newSns.length === 0 && (
                        <p>所有已定型服务器均已存在于现有方案中，无法生成新方案。</p>
                     )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmGeneration} disabled={!generationPreview || generationPreview.newSns.length === 0}>
                        确认生成
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

export default DeliveryPage;
    
    

    

    

    

    

    
    

      

    

    

    

    

    

    

    

    

    