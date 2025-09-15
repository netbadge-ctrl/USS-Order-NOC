"use client";

import { useState } from 'react';
import { operations } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OperationId } from '@/lib/types';

export default function OperationSelector() {
  const [selectedOperation, setSelectedOperation] = useState<OperationId | null>(null);

  const handleSelectOperation = (operationId: OperationId) => {
    setSelectedOperation(operationId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {operations.map((op) => (
        <Card
          key={op.id}
          className={cn(
            'cursor-pointer hover:shadow-lg transition-shadow',
            selectedOperation === op.id && 'ring-2 ring-primary shadow-lg'
          )}
          onClick={() => handleSelectOperation(op.id)}
        >
          <CardHeader>
            <div className="flex items-center gap-4">
              <op.icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{op.name}</CardTitle>
                <CardDescription className="mt-1">{op.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
