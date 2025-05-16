import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type FinancialAccountCardProps = {
  account: {
    id: number;
    name: string;
    type: string;
    bankName: string;
    currentBalance: number;
  };
};

export default function FinancialAccountCard({ account }: FinancialAccountCardProps) {
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "checking":
        return "account_balance";
      case "savings":
        return "savings";
      case "cash":
        return "payments";
      case "credit_card":
        return "credit_card";
      default:
        return "account_balance_wallet";
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "checking":
        return "Conta Corrente";
      case "savings":
        return "Poupança";
      case "cash":
        return "Caixa";
      case "credit_card":
        return "Cartão de Crédito";
      default:
        return "Conta";
    }
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type === "credit_card") {
      return balance < 0 ? "text-red-600" : "text-green-600";
    }
    return balance >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{account.name}</CardTitle>
          <span className="material-icons text-neutral-500">
            {getAccountTypeIcon(account.type)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <span className="material-icons text-sm mr-2">business</span>
            <span>{account.bankName}</span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-600">
            <span className="material-icons text-sm mr-2">category</span>
            <span>{getAccountTypeLabel(account.type)}</span>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-sm text-neutral-500 mb-1">Saldo Atual</p>
            <p className={`text-xl font-semibold ${getBalanceColor(account.currentBalance, account.type)}`}>
              {formatCurrency(account.currentBalance)}
            </p>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <span className="material-icons text-sm mr-1">add</span>
              Transação
            </Button>
            <Button variant="outline" size="sm">
              <span className="material-icons text-sm mr-1">sync</span>
              Conciliar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
