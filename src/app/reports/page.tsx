
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  CircleDot,
  FileText,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { workOrderReports } from '@/lib/data';
import type { WorkOrderReport, ApprovalStep } from '@/lib/types';
import { cn } from '@/lib/utils';


const getStatusVariant = (status: WorkOrderReport['status']) => {
  switch (status) {
    case '处理中':
      return 'bg-blue-100 text-blue-800';
    case '已完成':
      return 'bg-green-100 text-green-800';
    case '异常':
      return 'bg-red-100 text-red-800';
    case '已取消':
        return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getApprovalStepIcon = (status: ApprovalStep['status']) => {
  switch (status) {
    case '已完成':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case '进行中':
      return <Hourglass className="h-5 w-5 text-blue-500 animate-spin" />;
    case '异常':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case '未开始':
      return <CircleDot className="h-5 w-5 text-gray-400" />;
  }
};

function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto py-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex-shrink-0">{getApprovalStepIcon(step.status)}</div>
            <p className="text-xs font-medium mt-1 whitespace-nowrap">{step.step}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{step.handler || 'N/A'}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{step.time || '-'}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-px bg-border mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}

function WorkOrderProgress() {
  // We are now displaying a single work order. Let's take the first one as an example.
  const report = workOrderReports[0];

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>无工单数据</CardTitle>
          <CardDescription>当前没有可显示的工单进度信息。</CardDescription>
        </CardHeader>
        <CardContent>
          <p>请先创建工单。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>工单详情: {report.id}</span>
        </CardTitle>
        <CardDescription>
          追踪此工单的审批和执行状态。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div className="space-y-1">
                <p className="text-muted-foreground">工单类型</p>
                <p className="font-medium">{report.type}</p>
            </div>
             <div className="space-y-1">
                <p className="text-muted-foreground">当前状态</p>
                <Badge variant="outline" className={cn('border-0 font-normal', getStatusVariant(report.status))}>
                  {report.status}
                </Badge>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">申请人</p>
                <p className="font-medium">{report.applicant}</p>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">申请时间</p>
                <p className="font-medium">{report.applicationTime}</p>
            </div>
        </div>
        
        {/* Approval Status */}
        <div>
          <h4 className="font-medium mb-4 text-base">审批进度</h4>
          <Card className="p-4">
             <ApprovalTimeline steps={report.approvalStatus} />
          </Card>
        </div>

        {/* Server Details */}
        <div>
          <h4 className="font-medium mb-2 text-base">服务器处理详情</h4>
          <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>主机名</TableHead>
                        <TableHead>处理进度</TableHead>
                        <TableHead>处理人</TableHead>
                        <TableHead>异常说明</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {report.servers.map(server => (
                        <TableRow key={server.id}>
                            <TableCell className="font-mono text-xs">{server.hostname}</TableCell>
                            <TableCell>{server.progress}</TableCell>
                            <TableCell>{server.handler}</TableCell>
                            <TableCell className={cn(server.exception ? "text-red-600" : "")}>
                                {server.exception ? (
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                        <span>{server.exception}</span>
                                    </div>
                                ) : "无"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function ReportsPage() {
  return (
    <div className="space-y-8">
        <WorkOrderProgress />
    </div>
  );
}
