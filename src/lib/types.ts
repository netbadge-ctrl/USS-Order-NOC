
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

export type ApprovalStep = {
    step: string;
    status: '已完成' | '进行中' | '未开始' | '异常';
    handler: string;
    time: string;
};

export type ServerProgress = {
    id: string;
    hostname: string;
    progress: string;
    handler: string;
    exception: string | null;
};

export type WorkOrderReport = {
    id: string;
    type: string;
    status: '处理中' | '已完成' | '异常' | '已取消';
    applicant: string;
    applicationTime: string;
    approvalStatus: ApprovalStep[];
    servers: ServerProgress[];
    processingTime: {
        approval: number; // hours
        execution: number; // hours
    };
};

export type StockStatus = {
    status: 'sufficient' | 'insufficient';
    quantity: number;
}

export type UpgradePlanChangeItem = {
    component: keyof ServerHardwareConfig;
    action: 'add' | 'remove';
    detail: string;
    model?: string;
    stock?: {
        currentLocation: StockStatus;
        targetLocation: StockStatus;
    };
}

export type UpgradePlan = {
    sn: string;
    currentConfig: Partial<ServerHardwareConfig>;
    targetConfig: Partial<ServerHardwareConfig>;
    changes: UpgradePlanChangeItem[];
    requirements?: Partial<Record<keyof ServerHardwareConfig, string>>;
}


export type FormattedUpgradePlanRow = {
    component: keyof ServerHardwareConfig;
    current: string | undefined;
    target: string | undefined;
    changes: UpgradePlanChangeItem[];
    requirements?: string;
};

export type FormattedUpgradePlan = {
  sn: string;
  rows: FormattedUpgradePlanRow[];
}

    

    