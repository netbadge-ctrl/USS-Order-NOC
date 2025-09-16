import type { LucideIcon } from "lucide-react";

export type ServerHardwareConfig = {
    cpu: string;
    memory: string;
    storage: string;
    gpu?: string;
    vpcNetwork?: string;
    computeNetwork?: string;
    storageNetwork?: string;
    nic?: string;
};


export type Server = {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  status: '运行中' | '已停止' | '维护中';
  dataCenter: string;
  rack: string;
  resourceType: 'GPU' | 'CPU';
  config: ServerHardwareConfig;
};

export type OperationId = 'relocation' | 'install-system' | 'hardware-change' | 'additional-ops';

export type Operation = {
  id: OperationId;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type HardwareChangeSuggestion = {
    cpu: {
        action: 'add' | 'remove' | 'replace' | 'none';
        details: string;
    };
    memory: {
        action: 'add' | 'remove' | 'replace' | 'none';
        details: string;
    };
    storage: {
        action: 'add' | 'remove' | 'replace' | 'none';
        details: string;
    };
    gpu?: {
        action: 'add'| 'remove' | 'replace' | 'none';
        details: string;
    };
    nic?: {
        action: 'add'| 'remove' | 'replace' | 'none';
        details: string;
    };
    network?: {
        action: 'add'| 'remove' | 'replace' | 'none';
        details: string;
    };
};
