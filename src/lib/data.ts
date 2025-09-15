import { Activity, FileCode, Package, RotateCw, HardDrive, Network, GitPullRequest } from 'lucide-react';
import type { Server, Operation, OperationId } from './types';

export const servers: Server[] = [
  { id: 'srv-7019', name: '2102310QPD105F976.8F', hostname: 'qyyc01-test-ec2240001215.qyyc01.ksyun.com', ipAddress: '10.240.1.100', status: '维护中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-0-1' },
  { id: 'srv-7020', name: '2102310QPD10C5412.76', hostname: 'qyyc01-test-ec2240001216.qyyc01.ksyun.com', ipAddress: '10.240.1.101', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-0-3' },
  { id: 'srv-7021', name: '2102310QPD109A691.5E', hostname: 'qyyc01-test-ec2240001217.qyyc01.ksyun.com', ipAddress: '10.240.1.102', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-1-1' },
  { id: 'srv-7022', name: '2102310QPD108AA62.05', hostname: 'qyyc01-test-ec2240001218.qyyc01.ksyun.com', ipAddress: '10.240.1.103', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-1-3' },
  { id: 'srv-7023', name: '2102310QPD1083E41.3C', hostname: 'qyyc01-test-ec2240001219.qyyc01.ksyun.com', ipAddress: '10.240.1.104', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-2-1' },
  { id: 'srv-7024', name: '2102310QPD102F5A2.02', hostname: 'qyyc01-test-ec2240001220.qyyc01.ksyun.com', ipAddress: '10.240.1.105', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-2-3' },
  { id: 'srv-7025', name: '2102310QPD10A64F6.D5', hostname: 'qyyc01-test-ec2240001221.qyyc01.ksyun.com', ipAddress: '10.240.1.106', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-3-1' },
  { id: 'srv-7026', name: '2102310QPD1046D3E.AF', hostname: 'qyyc01-test-ec2240001222.qyyc01.ksyun.com', ipAddress: '10.240.1.107', status: '已停止', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-3-3' },
  { id: 'srv-7027', name: '2102310QPD1067444.BA', hostname: 'qyyc01-test-ec2240001223.qyyc01.ksyun.com', ipAddress: '10.240.1.108', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-1' },
  { id: 'srv-7028', name: '2102310QPD101512B.2D', hostname: 'qyyc01-test-ec2240001224.qyyc01.ksyun.com', ipAddress: '10.240.1.109', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-3' },
  { id: 'srv-7029', name: '2102310QPD101512B.2E', hostname: 'qyyc01-test-ec2240001225.qyyc01.ksyun.com', ipAddress: '10.240.1.110', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-4' },
  { id: 'srv-7030', name: '2102310QPD101512B.2F', hostname: 'qyyc01-test-ec2240001226.qyyc01.ksyun.com', ipAddress: '10.240.1.111', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-5' },
];

export const operations: Operation[] = [
  { id: 'reboot', name: '重装系统', description: '执行软重启或硬重启。', icon: RotateCw },
  { id: 'run-script', name: '硬件更换', description: '在服务器上执行 Shell 脚本。', icon: HardDrive },
  { id: 'install-package', name: '网络配置', description: '安装一个新的软件包。', icon: Network },
  { id: 'check-status', name: '固件更新', description: '在服务器上运行健康检查。', icon: GitPullRequest },
];

export const operationMap = operations.reduce((acc, op) => {
    acc[op.id] = op;
    return acc;
}, {} as Record<OperationId, Operation>);
