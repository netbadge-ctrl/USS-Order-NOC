

"use client";

import { useMemo, useState, useEffect } from "react";
import { servers } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Server } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pagination } from "./pagination";

type ServerWithSelection = Server & { isSelected: boolean };

const getStatusVariant = (status: Server['status']) => {
  switch (status) {
    case "运行中":
      return "bg-green-100 text-green-800";
    case "维护中":
      return "bg-yellow-100 text-yellow-800";
    case "已停止":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface ServerTableProps {
  onSelectionChange?: (selectedServers: Server[]) => void;
}

export default function ServerTable({ onSelectionChange }: ServerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allServers, setAllServers] = useState<ServerWithSelection[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    setAllServers(servers.map((s) => ({ ...s, isSelected: false })));
  }, []);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(allServers.filter(s => s.isSelected));
    }
  }, [allServers, onSelectionChange]);

  const filteredServers = useMemo(() => {
    return allServers.filter(
      (server) =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.ipAddress.includes(searchTerm)
    );
  }, [searchTerm, allServers]);
  
  const paginatedServers = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredServers.slice(start, start + pageSize);
  }, [filteredServers, pageIndex, pageSize]);

  const pageCount = Math.ceil(filteredServers.length / pageSize);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const handleSelectAll = (checked: boolean) => {
    const newServers = allServers.map(server => {
      const isFiltered = filteredServers.some(fs => fs.id === server.id);
      const inCurrentPage = paginatedServers.some(ps => ps.id === server.id);
      
      if (inCurrentPage) {
        return { ...server, isSelected: checked };
      }
      return server;
    });
    setAllServers(newServers);
  };
  
  const handleSelectRow = (id: string, checked: boolean) => {
    setAllServers(
      allServers.map((s) => (s.id === id ? { ...s, isSelected: checked } : s))
    );
  };

  const isCurrentPageAllSelected = useMemo(() => {
    if (paginatedServers.length === 0) return false;
    return paginatedServers.every(s => s.isSelected)
  }, [paginatedServers]);

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg">
      <div className="mb-4">
        <Input
          placeholder="按名称、主机名或 IP 搜索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 px-4">
                <Checkbox
                  checked={isCurrentPageAllSelected}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>主机名</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>数据中心</TableHead>
              <TableHead>IP 地址</TableHead>
              <TableHead>机架</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServers.length > 0 ? (
              paginatedServers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="px-4">
                    <Checkbox
                      checked={server.isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(server.id, Boolean(checked))
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{server.id.split('-')[1]}</TableCell>
                  <TableCell>{server.name}</TableCell>
                  <TableCell>{server.hostname}</TableCell>
                  <TableCell>
                    {server.resourceType && (
                      <Badge variant={server.resourceType === 'GPU' ? 'default' : 'secondary'} className="font-normal">
                        {server.resourceType}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border-0 font-normal", getStatusVariant(server.status))}>
                      {server.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{server.dataCenter}</TableCell>
                  <TableCell>{server.ipAddress}</TableCell>
                  <TableCell>{server.rack}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  未找到服务器。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination 
        pageIndex={pageIndex}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        previousPage={() => setPageIndex(pageIndex - 1)}
        nextPage={() => setPageIndex(pageIndex + 1)}
      />
    </div>
  );
}
