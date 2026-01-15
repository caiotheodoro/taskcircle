'use client';

import React, { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

import FinanceChart from '@/components/organisms/finance-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useGetFinances } from '@/hooks/finance';
import { deleteEarning, deleteSpending } from '@/server/actions/finance';

import EarningForm from '../organisms/earning-form';
import SpendingForm from '../organisms/spending-form';

export default function FinancePage() {
  const { data: finances, error, isLoading } = useGetFinances();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { execute: executeDeleteEarning } = useAction(deleteEarning, {
    onSuccess() {
      toast({
        title: 'Earning deleted!',
        description: 'The earning has been deleted successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['finances'],
      });
    },
  });

  const { execute: executeDeleteSpending } = useAction(deleteSpending, {
    onSuccess() {
      toast({
        title: 'Spending deleted!',
        description: 'The spending has been deleted successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['finances'],
      });
    },
  });

  const earningsList = finances?.success?.earnings || [];
  const spendingsList = finances?.success?.spendings || [];

  const chartData = useMemo(() => {
    if (!finances?.success) return [];

    const { earnings, spendings } = finances.success;

    const grouped: Record<string, { earnings: number; spendings: number }> = {};

    earnings.forEach((earning) => {
      const key = `${earning.year}-${earning.month}`;
      if (!grouped[key]) {
        grouped[key] = { earnings: 0, spendings: 0 };
      }
      grouped[key].earnings += Number.parseFloat(earning.amount);
    });

    spendings.forEach((spending) => {
      const key = `${spending.year}-${spending.month}`;
      if (!grouped[key]) {
        grouped[key] = { earnings: 0, spendings: 0 };
      }
      grouped[key].spendings += Number.parseFloat(spending.amount);
    });

    return Object.entries(grouped)
      .map(([key, values]) => {
        const [year, month] = key.split('-').map(Number);
        const monthName = new Date(year, month - 1).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        return {
          month: monthName,
          year,
          monthNum: month,
          earnings: values.earnings,
          spendings: values.spendings,
          balance: values.earnings - values.spendings,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthNum - b.monthNum;
      });
  }, [finances]);

  const earningsByType = useMemo(() => {
    const monthly = earningsList.filter((e) => e.type === 'monthly');
    const once = earningsList.filter((e) => e.type === 'once');

    const monthlyTotal = monthly.reduce(
      (sum, e) => sum + Number.parseFloat(e.amount),
      0,
    );

    const onceTotal = once.reduce(
      (sum, e) => sum + Number.parseFloat(e.amount),
      0,
    );

    return { monthly, once, monthlyTotal, onceTotal };
  }, [earningsList]);

  const spendingsByType = useMemo(() => {
    const monthly = spendingsList.filter((s) => s.type === 'monthly');
    const once = spendingsList.filter((s) => s.type === 'once');
    const installment = spendingsList
      .filter((s) => s.type === 'installment')
      .sort((a, b) => {
        const aRemaining =
          a.installment_total && a.installment_current
            ? a.installment_total - a.installment_current
            : Infinity;
        const bRemaining =
          b.installment_total && b.installment_current
            ? b.installment_total - b.installment_current
            : Infinity;
        return aRemaining - bRemaining;
      });

    const monthlyTotal = monthly.reduce(
      (sum, s) => sum + Number.parseFloat(s.amount),
      0,
    );

    const installmentTotal = installment.reduce(
      (sum, s) => sum + Number.parseFloat(s.amount),
      0,
    );

    return { monthly, once, installment, monthlyTotal, installmentTotal };
  }, [spendingsList]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) return <p className="text-destructive">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="w-full sm:w-auto">
                Add Earning
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register Earning</DialogTitle>
                <DialogDescription>Add your earning</DialogDescription>
              </DialogHeader>
              <EarningForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Add Spending
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register Spending</DialogTitle>
                <DialogDescription>Add your spending</DialogDescription>
              </DialogHeader>
              <SpendingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FinanceChart data={chartData} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Monthly Earnings
                </div>
                {earningsByType.monthly.length > 0 && (
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Total: ${earningsByType.monthlyTotal.toFixed(2)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {earningsByType.monthly.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No monthly earnings registered yet
                </p>
              ) : (
                earningsByType.monthly.map((earning) => {
                  const monthName = new Date(
                    earning.year,
                    earning.month - 1,
                  ).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={earning.id}
                      className="flex justify-between items-center p-3 border-l-4 border-l-green-500 rounded-lg bg-green-50/50 dark:bg-green-950/20"
                    >
                      <div>
                        <p className="font-medium">{monthName}</p>
                        {earning.description && (
                          <p className="text-sm text-muted-foreground">
                            {earning.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${Number.parseFloat(earning.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            executeDeleteEarning({ id: earning.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  One-time Earnings
                </div>
                {earningsByType.once.length > 0 && (
                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    Total: ${earningsByType.onceTotal.toFixed(2)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {earningsByType.once.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No one-time earnings registered yet
                </p>
              ) : (
                earningsByType.once.map((earning) => {
                  const monthName = new Date(
                    earning.year,
                    earning.month - 1,
                  ).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={earning.id}
                      className="flex justify-between items-center p-3 border-l-4 border-l-emerald-500 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20"
                    >
                      <div>
                        <p className="font-medium">{monthName}</p>
                        {earning.description && (
                          <p className="text-sm text-muted-foreground">
                            {earning.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${Number.parseFloat(earning.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            executeDeleteEarning({ id: earning.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Monthly Spendings
                </div>
                {spendingsByType.monthly.length > 0 && (
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Total: ${spendingsByType.monthlyTotal.toFixed(2)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {spendingsByType.monthly.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No monthly spendings registered yet
                </p>
              ) : (
                spendingsByType.monthly.map((spending) => {
                  const monthName = new Date(
                    spending.year,
                    spending.month - 1,
                  ).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={spending.id}
                      className="flex justify-between items-center p-3 border-l-4 border-l-blue-500 rounded-lg bg-blue-50/50 dark:bg-blue-950/20"
                    >
                      <div>
                        <p className="font-medium">{monthName}</p>
                        {spending.description && (
                          <p className="text-sm text-muted-foreground">
                            {spending.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          ${Number.parseFloat(spending.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            executeDeleteSpending({ id: spending.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                One-time Spendings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {spendingsByType.once.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No one-time spendings registered yet
                </p>
              ) : (
                spendingsByType.once.map((spending) => {
                  const monthName = new Date(
                    spending.year,
                    spending.month - 1,
                  ).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={spending.id}
                      className="flex justify-between items-center p-3 border-l-4 border-l-orange-500 rounded-lg bg-orange-50/50 dark:bg-orange-950/20"
                    >
                      <div>
                        <p className="font-medium">{monthName}</p>
                        {spending.description && (
                          <p className="text-sm text-muted-foreground">
                            {spending.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          ${Number.parseFloat(spending.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            executeDeleteSpending({ id: spending.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Installment Spendings
                </div>
                {spendingsByType.installment.length > 0 && (
                  <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    Total: ${spendingsByType.installmentTotal.toFixed(2)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {spendingsByType.installment.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No installment spendings registered yet
                </p>
              ) : (
                spendingsByType.installment.map((spending) => {
                  const monthName = new Date(
                    spending.year,
                    spending.month - 1,
                  ).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  });
                  const installmentText =
                    spending.installment_current && spending.installment_total
                      ? ` (${spending.installment_current}/${spending.installment_total})`
                      : '';
                  return (
                    <div
                      key={spending.id}
                      className="flex justify-between items-center p-3 border-l-4 border-l-purple-500 rounded-lg bg-purple-50/50 dark:bg-purple-950/20"
                    >
                      <div>
                        <p className="font-medium">
                          {monthName}
                          {installmentText}
                        </p>
                        {spending.description && (
                          <p className="text-sm text-muted-foreground">
                            {spending.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          ${Number.parseFloat(spending.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            executeDeleteSpending({ id: spending.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
