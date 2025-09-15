import type { LucideIcon } from "lucide-react";

export type Server = {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  status: '运行中' | '已停止' | '维护中';
  dataCenter: string;
  rack: string;
};

export type OperationId = 'reboot' | 'run-script' | 'install-package' | 'check-status';

export type Operation = {
  id: OperationId;
  name: string;
  description: string;
  icon: LucideIcon;
};
