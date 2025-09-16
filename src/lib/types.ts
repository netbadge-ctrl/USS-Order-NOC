import type { LucideIcon } from "lucide-react";

export type Server = {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  status: '运行中' | '已停止' | '维护中';
  dataCenter: string;
  rack: string;
  resourceType?: 'GPU' | 'CPU';
};

export type OperationId = 'relocation' | 'install-system' | 'hardware-change' | 'additional-ops';

export type Operation = {
  id: OperationId;
  name: string;
  description: string;
  icon: LucideIcon;
};
