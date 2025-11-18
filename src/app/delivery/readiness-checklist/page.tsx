
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { deliveryData } from '@/app/delivery/page'; // Assuming deliveryData is exportable
import type { UpgradePlan, FormattedUpgradePlan } from '@/lib/types';


// Mock data similar to what's generated in the main delivery page.
// In a real app, this would come from a shared state or API.
const mockPlansData: UpgradePlan[] = [
    {
        sn: '9800171603708813',
        currentConfig: { cpu: 'Intel_4314*2', memory: '128G', storage: 'SATA_4T*12', gpu: 'WQDX_GM302*4', vpcNetwork: '10GE_2*1', computeNetwork: '100GE_IB*2' },
        targetConfig: { cpu: 'Intel_8468*2', memory: '64G_4800*16', storage: 'NVME_3.84T*4', gpu: 'WQDX_A800*8', vpcNetwork: '200GE_RoCE*2', computeNetwork: '200GE_IB*8' },
        requirements: { memory: 'SPEED: 4800, 容量: 64G', storage: '接口速率: 12Gb/s, 颗粒类型: TLC, 耐用等级: 3 DWPD, 部件版本: v2' },
        changes: [
            { component: 'cpu', action: 'remove', detail: 'Intel_4314*2' },
            { component: 'cpu', action: 'add', detail: 'Intel_8468*2', model: 'P-8468', stock: { currentLocation: { status: 'sufficient', quantity: 20 }, targetLocation: { status: 'sufficient', quantity: 50 } } },
            { component: 'memory', action: 'remove', detail: '128G' },
            { component: 'memory', action: 'add', detail: '64G_4800*16', model: 'MEM-64-4800', stock: { currentLocation: { status: 'insufficient', quantity: 0 }, targetLocation: { status: 'sufficient', quantity: 100 } } },
        ]
    },
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
];

type ChecklistItem = {
    component: string;
    spec: string;
    model: string;
    requirements: string;
    requiredQuantity: number;
    targetLocationStock: number;
    transferQuantity: number;
    targetLocation: string;
};

function ReadinessChecklistPage() {
    const checklistData = React.useMemo(() => {
        const aggregatedList = new Map<string, ChecklistItem>();

        mockPlansData.forEach(plan => {
            const server = deliveryData.find(d => d.sn === plan.sn);
            const targetLocation = server ? (Array.isArray(server.rack) ? server.rack[1] || server.rack[0] : server.rack) : '未知';

            const addedItems = plan.changes.filter(c => c.action === 'add');

            addedItems.forEach(item => {
                const key = `${item.component}-${item.detail}-${item.model}-${targetLocation}`;
                const detailParts = item.detail.split('*');
                const spec = detailParts[0] || '';
                const quantity = detailParts.length > 1 ? parseInt(detailParts[1], 10) : 1;

                if (aggregatedList.has(key)) {
                    const existing = aggregatedList.get(key)!;
                    existing.requiredQuantity += quantity;
                } else {
                    aggregatedList.set(key, {
                        component: item.component,
                        spec: spec,
                        model: item.model || 'N/A',
                        requirements: plan.requirements?.[item.component] || '无',
                        requiredQuantity: quantity,
                        targetLocationStock: item.stock?.targetLocation.quantity || 0,
                        transferQuantity: 0, // Calculated below
                        targetLocation: targetLocation,
                    });
                }
            });
        });

        const finalData: ChecklistItem[] = [];
        aggregatedList.forEach(item => {
            item.transferQuantity = Math.max(0, item.requiredQuantity - item.targetLocationStock);
            finalData.push(item);
        });

        return finalData;
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>配件需求清单</CardTitle>
                    <CardDescription>根据当前待确认的改配方案，汇总所有需要新增的配件及其库存情况。</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>配件类型</TableHead>
                                    <TableHead>规格</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>性能指标要求</TableHead>
                                    <TableHead className="text-right">需求数量</TableHead>
                                    <TableHead>目标机房</TableHead>
                                    <TableHead className="text-right">目标机房库存</TableHead>
                                    <TableHead className="text-right">需调拨数量</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {checklistData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="capitalize font-medium">{item.component}</TableCell>
                                        <TableCell>{item.spec}</TableCell>
                                        <TableCell>{item.model}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{item.requirements}</TableCell>
                                        <TableCell className="text-right font-mono">{item.requiredQuantity}</TableCell>
                                        <TableCell>{item.targetLocation}</TableCell>
                                        <TableCell className="text-right font-mono">{item.targetLocationStock}</TableCell>
                                        <TableCell className="text-right">
                                            {item.transferQuantity > 0 ? (
                                                <Badge variant="destructive" className="font-mono">{item.transferQuantity}</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="font-mono">{item.transferQuantity}</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ReadinessChecklistPage;

    