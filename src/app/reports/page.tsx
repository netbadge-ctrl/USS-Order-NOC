
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
          <div className="flex flex-col items-center">
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
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>工单列表</CardTitle>
        <CardDescription>
          追踪所有工单的审批和执行状态。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>工单ID</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>申请人</TableHead>
              <TableHead>申请时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrderReports.map((report) => (
              <Collapsible asChild key={report.id} open={openRows[report.id] || false} onOpenChange={() => toggleRow(report.id)}>
                <>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <CollapsibleTrigger asChild>
                         <Button variant="ghost" size="icon">
                            {openRows[report.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                         </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('border-0 font-normal', getStatusVariant(report.status))}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.applicant}</TableCell>
                    <TableCell>{report.applicationTime}</TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={6} className="p-0">
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="font-medium mb-4">审批进度</h4>
                                    <ApprovalTimeline steps={report.approvalStatus} />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">服务器处理详情</h4>
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
                        </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function ReportsPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">工单进度中心</h1>
                <p className="text-muted-foreground">分析工单处理效率和追踪关键绩效指标。</p>
            </div>
        </div>
        <WorkOrderProgress />
    </div>
  );
}
