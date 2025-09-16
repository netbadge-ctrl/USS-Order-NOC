
import type { Server } from './types';

const baseServers: Server[] = [
  { 
    id: 'srv-7019', 
    name: '2102310QPD105F976.8F', 
    hostname: 'qyyc01-test-ec2240001215.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.100', 
    status: '维护中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-0-1', 
    resourceType: 'GPU',
    config: {
      cpu: 'Intel_8358P*2 (64核128线程)',
      memory: '32G_3200 * 16',
      storage: 'SATA2.5_480G * 2',
      gpu: 'GM302*4',
      vpcNetwork: '25GE_2 * 1',
      computeNetwork: 'NVLINK_80G * 4',
      storageNetwork: '-'
    }
  },
  { 
    id: 'srv-7020', 
    name: '2102310QPD10C5412.76', 
    hostname: 'qyyc01-test-ec2240001216.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.101', 
    status: '运行中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-0-3', 
    resourceType: 'CPU',
    config: {
      cpu: '4316*2 (40核80线程)',
      memory: '128G',
      storage: '480G SATA SSD * 2 + 4T SATA HDD * 6',
      nic: '25G * 2'
    }
  },
  { 
    id: 'srv-7021', 
    name: '2102310QPD109A691.5E', 
    hostname: 'qyyc01-test-ec2240001217.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.102', 
    status: '运行中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-1-1', 
    resourceType: 'GPU',
     config: {
      cpu: 'Intel_8358P*2 (64核128线程)',
      memory: '64G_3200 * 16',
      storage: 'SATA2.5_480G * 2 + NVME2.5_7.68T * 2',
      gpu: 'GM302*8',
      vpcNetwork: '25GE_2 * 1',
      computeNetwork: 'NVLINK_80G * 8',
      storageNetwork: '-'
    }
  },
  { 
    id: 'srv-7022', 
    name: '2102310QPD108AA62.05', 
    hostname: 'qyyc01-test-ec2240001218.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.103', 
    status: '运行中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-1-3', 
    resourceType: 'CPU',
    config: {
      cpu: '4316*2 (40核80线程)',
      memory: '256G',
      storage: '480G SATA SSD * 2 + 8T SATA HDD * 12',
      nic: '25G * 2'
    }
  },
  { 
    id: 'srv-7023', 
    name: '2102310QPD1083E41.3C', 
    hostname: 'qyyc01-test-ec2240001219.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.104', 
    status: '运行中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-2-1', 
    resourceType: 'GPU',
     config: {
      cpu: 'Intel_8358P*2 (64核128线程)',
      memory: '32G_3200 * 8',
      storage: 'SATA2.5_480G * 2 + NVME2.5_3.84T * 2',
      gpu: 'GM302*8',
      vpcNetwork: '25GE_2 * 1',
      computeNetwork: 'NVLINK_80G * 8',
      storageNetwork: '-'
    }
  },
  { 
    id: 'srv-7024', 
    name: '2102310QPD102F5A2.02', 
    hostname: 'qyyc01-test-ec2240001220.qyyc01.ksyun.com', 
    ipAddress: '10.240.1.105', 
    status: '运行中', 
    dataCenter: 'QYYC01', 
    rack: 'QYYC012F01-J-2-3', 
    resourceType: 'CPU',
    config: {
      cpu: '4314*2 (32核64线程)',
      memory: '128G',
      storage: '480G SATA SSD * 2 + 4T SATA HDD * 12',
      nic: '25G * 2'
    }
  },
  { id: 'srv-7025', name: '2102310QPD10A64F6.D5', hostname: 'qyyc01-test-ec2240001221.qyyc01.ksyun.com', ipAddress: '10.240.1.106', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-3-1', resourceType: 'GPU', config: { cpu: 'Intel_8358P*2', memory: '64G_3200 * 16', storage: 'SATA2.5_480G * 2', gpu: 'GM302*8', vpcNetwork: '25GE_2 * 1', computeNetwork: 'NVLINK_80G * 8', storageNetwork: '-' } },
  { id: 'srv-7026', name: '2102310QPD1046D3E.AF', hostname: 'qyyc01-test-ec2240001222.qyyc01.ksyun.com', ipAddress: '10.240.1.107', status: '已停止', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-3-3', resourceType: 'CPU', config: { cpu: '4316*2', memory: '256G', storage: '480G SATA SSD * 2', nic: '25G * 1' } },
  { id: 'srv-7027', name: '2102310QPD1067444.BA', hostname: 'qyyc01-test-ec2240001223.qyyc01.ksyun.com', ipAddress: '10.240.1.108', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-1', resourceType: 'GPU', config: { cpu: 'Intel_8358P*1', memory: '32G_3200 * 8', storage: 'SATA2.5_480G * 1', gpu: 'GM302*2', vpcNetwork: '25GE_2 * 1', computeNetwork: 'NVLINK_80G * 2', storageNetwork: '-' } },
  { id: 'srv-7028', name: '2102310QPD101512B.2D', hostname: 'qyyc01-test-ec2240001224.qyyc01.ksyun.com', ipAddress: '10.240.1.109', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-3', resourceType: 'CPU', config: { cpu: '4314*2', memory: '128G', storage: '480G SATA SSD * 2 + 8T SATA HDD * 6', nic: '25G * 2' } },
  { id: 'srv-7029', name: '2102310QPD101512B.2E', hostname: 'qyyc01-test-ec2240001225.qyyc01.ksyun.com', ipAddress: '10.240.1.110', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-4', resourceType: 'GPU', config: { cpu: 'Intel_8358P*2', memory: '64G_3200 * 8', storage: 'SATA2.5_480G * 2', gpu: 'GM302*4', vpcNetwork: '25GE_2 * 1', computeNetwork: 'NVLINK_80G * 4', storageNetwork: '-' } },
  { id: 'srv-7030', name: '2102310QPD101512B.2F', hostname: 'qyyc01-test-ec2240001226.qyyc01.ksyun.com', ipAddress: '10.240.1.111', status: '运行中', dataCenter: 'QYYC01', rack: 'QYYC012F01-J-4-5', resourceType: 'CPU', config: { cpu: '4316*2', memory: '256G', storage: '480G SATA SSD * 2 + 8T SATA HDD * 12', nic: '25G * 2' } },
];

const generatedServers: Server[] = [];
const totalServers = 200;
const statuses: Server['status'][] = ['运行中', '已停止', '维护中'];
const resourceTypes: Server['resourceType'][] = ['CPU', 'GPU'];
const dataCenters = ['QYYC01', 'BJ01', 'SH01'];

if (baseServers.length < totalServers) {
    for (let i = baseServers.length; i < totalServers; i++) {
        const baseIndex = i % baseServers.length;
        const baseServer = baseServers[baseIndex];
        const newId = `srv-${7031 + i}`;
        const newIpLastOctet = 112 + i;
        const newIpAddress = `10.240.${Math.floor(newIpLastOctet / 255)}.${newIpLastOctet % 255}`;
        
        generatedServers.push({
            ...baseServer,
            id: newId,
            name: `GEN-${(Math.random() + 1).toString(36).substring(2).toUpperCase()}`,
            hostname: `generated-server-${i}.ksyun.com`,
            ipAddress: newIpAddress,
            status: statuses[i % statuses.length],
            resourceType: resourceTypes[i % resourceTypes.length],
            dataCenter: dataCenters[i % dataCenters.length],
            rack: `${dataCenters[i % dataCenters.length]}2F01-J-${Math.floor(i/5)}-${i%5}`
        });
    }
}

export const servers: Server[] = [...baseServers, ...generatedServers];


export const targetModels = {
    GPU: [
        { 
            id: 'gpu-high-performance', 
            name: '高性能GPU服务器配置 (A)',
            config: {
                cpu: 'Intel_8358P*2 (64核128线程)',
                memory: '64G_3200 * 16',
                storage: 'SATA2.5_480G * 2 + NVME2.5_7.68T * 2',
                gpu: 'GM302*8',
                vpcNetwork: '25GE_2 * 1',
                computeNetwork: 'NVLINK_80G * 8',
                storageNetwork: '-'
            }
        },
        { 
            id: 'gpu-standard', 
            name: '标准GPU服务器配置 (B)',
            config: {
                cpu: 'Intel_8358P*2 (64核128线程)',
                memory: '32G_3200 * 16',
                storage: 'SATA2.5_480G * 2 + NVME2.5_3.84T * 4',
                gpu: 'GM302*8',
                vpcNetwork: '25GE_2 * 1',
                computeNetwork: 'NVLINK_80G * 8',
                storageNetwork: '25GE_2 * 1'
            }
        }
    ],
    CPU: [
        { 
            id: 'cpu-high-storage', 
            name: '大容量存储服务器配置',
            config: {
                cpu: '4316*2 (40核80线程)',
                memory: '256G',
                storage: '480G SATA SSD * 2 + 8T SATA HDD * 12',
                nic: '25G * 2'
            }
        },
        { 
            id: 'cpu-high-compute', 
            name: '高计算性能服务器配置',
             config: {
                cpu: '5318Y*2 (48核96线程)',
                memory: '512G',
                storage: '1.92T NVME SSD * 4',
                nic: '100G * 2'
            }
        }
    ]
}
