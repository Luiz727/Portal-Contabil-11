import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type FinancialPeriod = "monthly" | "quarterly" | "yearly";

type FinancialSummaryCardProps = {
  title: string;
  amount: number;
  status: string;
  statusText: string;
  statusDirection: "up" | "down";
};

type FinancialTransactionProps = {
  name: string;
  amount: number;
};

const FinancialSummaryCard = ({
  title,
  amount,
  status,
  statusText,
  statusDirection,
}: FinancialSummaryCardProps) => {
  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <p className={`mt-1 text-xl font-semibold ${status}`}>
        {formatCurrency(amount)}
      </p>
      <div className={`mt-1 text-xs ${status} flex items-center`}>
        <span className="material-icons text-xs">
          {statusDirection === "up" ? "arrow_upward" : "arrow_downward"}
        </span>
        <span>{statusText}</span>
      </div>
    </div>
  );
};

type FinancialSummaryProps = {
  revenueData: {
    amount: number;
    percentChange: number;
    isPositive: boolean;
  };
  expensesData: {
    amount: number;
    percentChange: number;
    isPositive: boolean;
  };
  balanceData: {
    amount: number;
    percentChange: number;
    isPositive: boolean;
  };
  chartData: {
    month: string;
    receitas: number;
    despesas: number;
  }[];
  accountsReceivable: FinancialTransactionProps[];
  accountsPayable: FinancialTransactionProps[];
};

export default function FinancialSummary({
  revenueData,
  expensesData,
  balanceData,
  chartData,
  accountsReceivable,
  accountsPayable,
}: FinancialSummaryProps) {
  const [activePeriod, setActivePeriod] = useState<FinancialPeriod>("quarterly");

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-800">Resumo Financeiro</h3>
        <div className="flex space-x-2">
          <Button
            variant={activePeriod === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod("monthly")}
          >
            Mensal
          </Button>
          <Button
            variant={activePeriod === "quarterly" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod("quarterly")}
          >
            Trimestral
          </Button>
          <Button
            variant={activePeriod === "yearly" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod("yearly")}
          >
            Anual
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FinancialSummaryCard
            title="Receitas"
            amount={revenueData.amount}
            status="text-green-500"
            statusText={`${revenueData.percentChange}% ${revenueData.isPositive ? "acima" : "abaixo"} do previsto`}
            statusDirection={revenueData.isPositive ? "up" : "down"}
          />

          <FinancialSummaryCard
            title="Despesas"
            amount={expensesData.amount}
            status="text-red-500"
            statusText={`${expensesData.percentChange}% ${!expensesData.isPositive ? "abaixo" : "acima"} do previsto`}
            statusDirection={!expensesData.isPositive ? "down" : "up"}
          />

          <FinancialSummaryCard
            title="Balanço Líquido"
            amount={balanceData.amount}
            status="text-blue-700"
            statusText={`${balanceData.percentChange}% ${balanceData.isPositive ? "acima" : "abaixo"} do ${activePeriod === "monthly" ? "mês" : activePeriod === "quarterly" ? "trimestre" : "ano"} anterior`}
            statusDirection={balanceData.isPositive ? "up" : "down"}
          />
        </div>

        {/* Chart */}
        <div className="mt-6">
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem"
                  }}
                />
                <Bar dataKey="receitas" fill="hsl(var(--chart-1))" name="Receitas" />
                <Bar dataKey="despesas" fill="hsl(var(--chart-2))" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-2">Contas a Receber</h4>
            <ul className="space-y-2">
              {accountsReceivable.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">{item.name}</span>
                  <span className="text-xs font-medium text-green-500">
                    {formatCurrency(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-2">Contas a Pagar</h4>
            <ul className="space-y-2">
              {accountsPayable.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">{item.name}</span>
                  <span className="text-xs font-medium text-red-500">
                    {formatCurrency(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
