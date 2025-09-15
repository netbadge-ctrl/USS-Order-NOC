"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { servers, operations, operationMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { OperationId, Server } from "@/lib/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    serverIds: z
      .array(z.string())
      .min(1, { message: "请至少选择一台服务器。" }),
    operationType: z.custom<OperationId>((val) =>
      operations.some((op) => op.id === val)
    ),
    rebootType: z.enum(["soft", "hard"]),
    scriptContent: z.string(),
    packageName: z.string(),
    isScheduled: z.boolean().default(false),
    scheduledAt: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.operationType === "run-script") {
        return data.scriptContent && data.scriptContent.trim().length > 0;
      }
      return true;
    },
    { message: "脚本内容不能为空。", path: ["scriptContent"] }
  )
  .refine(
    (data) => {
      if (data.operationType === "install-package") {
        return data.packageName && data.packageName.trim().length > 0;
      }
      return true;
    },
    { message: "软件包名称是必需的。", path: ["packageName"] }
  )
  .refine(
    (data) => {
      if (data.isScheduled) {
        return !!data.scheduledAt;
      }
      return true;
    },
    { message: "计划执行需要一个日期。", path: ["scheduledAt"] }
  );

type FormValues = z.infer<typeof formSchema>;

export default function OperationForm() {
  const [openItems, setOpenItems] = useState<string[]>(["step-1"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [formSubmissionData, setFormSubmissionData] = useState<FormValues | null>(null);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverIds: [],
      operationType: "reboot",
      rebootType: "soft",
      scriptContent: "",
      packageName: "",
      isScheduled: false,
    },
  });

  const filteredServers = useMemo(() => {
    return servers.filter(
      (server) =>
        server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.ipAddress.includes(searchTerm)
    );
  }, [searchTerm]);

  function onSubmit(data: FormValues) {
    setFormSubmissionData(data);
    setIsConfirming(true);
  }

  function handleFinalSubmit() {
    if (!formSubmissionData) return;
    
    console.log("正在提交操作:", formSubmissionData);

    toast({
      title: "操作已提交",
      description: `${operationMap[formSubmissionData.operationType].name} 操作已为 ${formSubmissionData.serverIds.length} 台服务器安排。`,
      variant: "default",
    });

    setIsConfirming(false);
    setFormSubmissionData(null);
    form.reset();
    setOpenItems(["step-1"]);
  }

  const selectedServerIds = form.watch("serverIds");
  const operationType = form.watch("operationType");
  const isScheduled = form.watch("isScheduled");
  
  useEffect(() => {
    if (selectedServerIds.length > 0 && !openItems.includes('step-2')) {
      setOpenItems(prev => [...prev, 'step-2']);
    }
  }, [selectedServerIds, openItems]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="w-full space-y-2"
          >
            <AccordionItem value="step-1">
              <AccordionTrigger className="text-lg font-medium hover:no-underline px-4 bg-card rounded-t-lg border data-[state=open]:rounded-b-none">
                第 1 步：选择服务器
              </AccordionTrigger>
              <AccordionContent className="bg-card p-4 rounded-b-lg border border-t-0">
                <Card className="border-0 shadow-none">
                  <CardHeader className="p-2">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <Input
                        placeholder="按主机名或 IP 筛选..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                      <p className="text-sm text-muted-foreground font-medium">
                        已选择 {selectedServerIds.length} / {servers.length} 台服务器
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <FormField
                      control={form.control}
                      name="serverIds"
                      render={({ field }) => (
                        <FormItem>
                          <div className="rounded-md border max-h-96 overflow-auto">
                            <Table>
                              <TableHeader className="sticky top-0 bg-muted/50">
                                <TableRow>
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={
                                        selectedServerIds.length > 0 &&
                                        filteredServers.every((s) => selectedServerIds.includes(s.id))
                                      }
                                      onCheckedChange={(checked) => {
                                        const filteredIds = filteredServers.map(s => s.id);
                                        const newSelectedIds = checked
                                            ? [...new Set([...selectedServerIds, ...filteredIds])]
                                            : selectedServerIds.filter(id => !filteredIds.includes(id));
                                        field.onChange(newSelectedIds);
                                      }}
                                    />
                                  </TableHead>
                                  <TableHead>主机名</TableHead>
                                  <TableHead>IP 地址</TableHead>
                                  <TableHead>状态</TableHead>
                                  <TableHead>区域</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredServers.length > 0 ? (
                                  filteredServers.map((server) => (
                                    <TableRow key={server.id}>
                                      <TableCell>
                                        <Checkbox
                                          checked={field.value?.includes(server.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, server.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== server.id
                                                  )
                                                );
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium">{server.hostname}</TableCell>
                                      <TableCell>{server.ipAddress}</TableCell>
                                      <TableCell>
                                        <span className={cn("px-2 py-1 text-xs rounded-full", server.status === 'Online' ? 'bg-green-100 text-green-800' : server.status === 'Offline' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')}>
                                          {server.status === 'Online' ? '在线' : server.status === 'Offline' ? '离线' : '维护中'}
                                        </span>
                                      </TableCell>
                                      <TableCell>{server.region}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                      未找到服务器。
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          <FormMessage className="pt-2" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step-2">
              <AccordionTrigger className="text-lg font-medium hover:no-underline px-4 bg-card rounded-lg border data-[state=open]:rounded-b-none">
                第 2 步：配置操作
              </AccordionTrigger>
              <AccordionContent className="bg-card p-4 rounded-b-lg border border-t-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="operationType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>操作类型</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? operations.find((op) => op.id === field.value)?.name
                                  : "选择操作"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="搜索操作..." />
                              <CommandEmpty>未找到操作。</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {operations.map((op) => (
                                    <CommandItem
                                      value={op.name}
                                      key={op.id}
                                      onSelect={() => {
                                        form.setValue("operationType", op.id);
                                        if (op.id !== 'reboot') form.setValue('rebootType', 'soft');
                                        if (op.id !== 'run-script') form.setValue('scriptContent', '');
                                        if (op.id !== 'install-package') form.setValue('packageName', '');
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          op.id === field.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex items-center gap-3">
                                        <op.icon className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                          <p>{op.name}</p>
                                          <p className="text-xs text-muted-foreground">{op.description}</p>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {operationType === "reboot" && (
                    <FormField
                      control={form.control}
                      name="rebootType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>重启方法</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="soft" />
                                </FormControl>
                                <FormLabel className="font-normal">软重启</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="hard" />
                                </FormControl>
                                <FormLabel className="font-normal">硬重启</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {operationType === "run-script" && (
                    <FormField
                      control={form.control}
                      name="scriptContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shell 脚本</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={`#!/bin/bash\necho "来自服务器的问候"...`}
                              className="min-h-[150px] font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {operationType === "install-package" && (
                    <FormField
                      control={form.control}
                      name="packageName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>软件包名称</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：nginx、redis-server" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step-3">
              <AccordionTrigger className="text-lg font-medium hover:no-underline px-4 bg-card rounded-lg border data-[state=open]:rounded-b-none">
                第 3 步：安排执行（可选）
              </AccordionTrigger>
              <AccordionContent className="bg-card p-4 rounded-b-lg border border-t-0">
                <FormField
                  control={form.control}
                  name="isScheduled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>稍后执行</FormLabel>
                        <FormDescription>
                          在指定的未来时间运行此操作。
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isScheduled && (
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-4">
                        <FormLabel>执行日期</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>选择一个日期</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="pt-2"/>
                      </FormItem>
                    )}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base"
            >
              审查并提交操作
            </Button>
          </div>
        </form>
      </Form>
      
      {formSubmissionData && (
        <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>确认操作</AlertDialogTitle>
                <AlertDialogDescription>
                    您即将执行以下操作。此操作无法撤销。
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-sm space-y-2">
                    <p><strong>操作：</strong> {operationMap[formSubmissionData.operationType].name}</p>
                    <p><strong>服务器 ({formSubmissionData.serverIds.length}):</strong></p>
                    <ul className="list-disc pl-5 max-h-24 overflow-y-auto bg-muted p-2 rounded-md">
                        {formSubmissionData.serverIds.map(id => (
                            <li key={id}>{servers.find(s => s.id === id)?.hostname}</li>
                        ))}
                    </ul>
                    {formSubmissionData.isScheduled && (
                        <p><strong>计划于：</strong> {format(formSubmissionData.scheduledAt!, "PPP 'at' h:mm b")}</p>
                    )}
                </div>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFormSubmissionData(null)}>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleFinalSubmit} className="bg-primary hover:bg-primary/90">
                    确认并运行
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
