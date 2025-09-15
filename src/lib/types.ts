import type { LucideIcon } from "lucide-react";

export type Server = {
  id: string;
  hostname: string;
  ipAddress: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  region: string;
  type: 'Web Server' | 'Database' | 'Cache';
};

export type OperationId = 'reboot' | 'run-script' | 'install-package' | 'check-status';

export type Operation = {
  id: OperationId;
  name: string;
  description: string;
  icon: LucideIcon;
};
