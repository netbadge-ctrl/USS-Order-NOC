import { Activity, FileCode, Package, RotateCw } from 'lucide-react';
import type { Server, Operation, OperationId } from './types';

export const servers: Server[] = [
  { id: 'srv-001', hostname: 'web-prod-01', ipAddress: '192.168.1.10', status: 'Online', region: 'us-east-1', type: 'Web Server' },
  { id: 'srv-002', hostname: 'db-prod-01', ipAddress: '192.168.1.11', status: 'Online', region: 'us-east-1', type: 'Database' },
  { id: 'srv-003', hostname: 'cache-prod-01', ipAddress: '192.168.1.12', status: 'Maintenance', region: 'us-east-1', type: 'Cache' },
  { id: 'srv-004', hostname: 'web-staging-01', ipAddress: '192.168.2.10', status: 'Online', region: 'us-west-2', type: 'Web Server' },
  { id: 'srv-005', hostname: 'db-staging-01', ipAddress: '192.168.2.11', status: 'Offline', region: 'us-west-2', type: 'Database' },
  { id: 'srv-006', hostname: 'web-prod-02', ipAddress: '192.168.1.13', status: 'Online', region: 'eu-central-1', type: 'Web Server' },
  { id: 'srv-007', hostname: 'analytics-worker-01', ipAddress: '10.0.5.20', status: 'Online', region: 'us-east-1', type: 'Web Server' },
  { id: 'srv-008', hostname: 'auth-service-prod', ipAddress: '10.0.1.33', status: 'Online', region: 'us-west-2', type: 'Web Server' },
  { id: 'srv-009', hostname: 'billing-db-replica', ipAddress: '10.0.2.45', status: 'Maintenance', region: 'eu-central-1', type: 'Database' },
  { id: 'srv-010', hostname: 'redis-prod-main', ipAddress: '10.0.3.10', status: 'Online', region: 'us-east-1', type: 'Cache' },
  { id: 'srv-011', hostname: 'web-prod-03-canary', ipAddress: '192.168.1.25', status: 'Online', region: 'us-east-1', type: 'Web Server' },
  { id: 'srv-012', hostname: 'api-gateway-prod', ipAddress: '192.168.1.5', status: 'Offline', region: 'us-west-2', type: 'Web Server' },
];

export const operations: Operation[] = [
  { id: 'reboot', name: 'Reboot Server', description: 'Perform a soft or hard reboot.', icon: RotateCw },
  { id: 'run-script', name: 'Run Script', description: 'Execute a shell script on the server.', icon: FileCode },
  { id: 'install-package', name: 'Install Package', description: 'Install a new software package.', icon: Package },
  { id: 'check-status', name: 'Check Status', description: 'Run a health check on the server.', icon: Activity },
];

export const operationMap = operations.reduce((acc, op) => {
    acc[op.id] = op;
    return acc;
}, {} as Record<OperationId, Operation>);
