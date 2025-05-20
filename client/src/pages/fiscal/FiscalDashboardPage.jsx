import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  Percent, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building, 
  Scale, 
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subMonths, getYear, getMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const ImpostometroWidget = ({ valor, mesAno }) => {
  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  return (
    <Card className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
          <span>Impostômetro ({mesAno})</span>
          <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 opacity-80" />
        </CardTitle>
        <CardDescription className="text-red-100 text-xs sm:text-sm">Estimativa de impostos sobre vendas registradas no período.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl sm:text-4xl font-bold">{formatCurrency(valor)}</p>
        <p className="text-xs text-red-100 mt-1">Valores simulados para o período selecionado.</p>
      </CardContent>
    </Card>
  );
};

const OverviewCard = ({ title, value, icon: Icon, description, colorClass = "text-primary" }) => (
  <Card className="bg-card border-border h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold text-foreground">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const MonthYearSelector = ({ selectedDate, onDateChange }) => {
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleYearChange = (year) => {
    const newDate = new Date(parseInt(year), getMonth(selectedDate), 1);
    onDateChange(newDate);
  };

  const handleMonthChange = (month) => {
    const newDate = new Date(getYear(selectedDate), parseInt(month), 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 mb-4 sm:mb-6 p-3 bg-muted/30 rounded-lg border border-border">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Período:</span>
      <div className="flex flex-wrap gap-2 w-full xs:w-auto">
        <Select value={getMonth(selectedDate).toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full xs:w-[140px] sm:w-[180px] bg-input border-border text-foreground focus:border-primary text-xs sm:text-sm">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {months.map(month => (
              <SelectItem key={month} value={month.toString()}>
                {format(new Date(0, month), 'MMMM', { locale: ptBR })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={getYear(selectedDate).toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full xs:w-[100px] sm:w-[120px] bg-input border-border text-foreground focus:border-primary text-xs sm:text-sm">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Dashboard do módulo fiscal com melhoria na responsividade
const FiscalDashboardPage = () => {
  const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
  const [impostometroValor, setImpostometroValor] = useState(0);
  const [fiscalData, setFiscalData] = useState({
    previsaoImpostosMes: 0,
    receitaBrutaAcumulada: 0,
    aliquotaSimples: 0, 
    fechamentoAnteriorStatus: "Pendente", 
  });
  
  // Simulando carregamento dos dados quando a data mudar
  useEffect(() => {
    const randomFactor = (getMonth(currentSelectedDate) + 1) / 12 + getYear(currentSelectedDate) / (getYear(new Date()) + 1);
    setImpostometroValor((Math.random() * 5000 + 8000) * randomFactor); 
    setFiscalData({
      previsaoImpostosMes: (Math.random() * 10000 + 5000) * randomFactor,
      receitaBrutaAcumulada: (Math.random() * 150000 + 100000) * (getYear(currentSelectedDate) <= getYear(new Date()) ? randomFactor : 0.1),
      aliquotaSimples: (Math.random() * 0.1 + 0.04).toFixed(3),
      fechamentoAnteriorStatus: getMonth(currentSelectedDate) === getMonth(subMonths(new Date(), 1)) ? "Concluído" : "Pendente"
    });
  }, [currentSelectedDate]);

  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  const formatPercent = (value) => `${(Number(value) * 100).toFixed(2)}%`;
  const formatDate = (date) => format(date, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
          <Scale className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Módulo Fiscal
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Acompanhe sua situação fiscal, emita notas e monitore obrigações.
        </p>
      </motion.div>

      <MonthYearSelector 
        selectedDate={currentSelectedDate} 
        onDateChange={setCurrentSelectedDate} 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <ImpostometroWidget 
            valor={impostometroValor} 
            mesAno={format(currentSelectedDate, "MMM/yyyy", { locale: ptBR })}
          />
        </div>
        
        <OverviewCard 
          title="Previsão de Impostos no Mês" 
          value={formatCurrency(fiscalData.previsaoImpostosMes)} 
          icon={DollarSign} 
          description={`Ref: ${formatDate(currentSelectedDate)}`} 
          colorClass="text-red-500"
        />
        
        <OverviewCard 
          title="Receita Bruta Acumulada" 
          value={formatCurrency(fiscalData.receitaBrutaAcumulada)} 
          icon={TrendingUp} 
          description="Últimos 12 meses" 
          colorClass="text-blue-500"
        />
        
        <OverviewCard 
          title="Alíquota Simples Nacional" 
          value={formatPercent(fiscalData.aliquotaSimples)} 
          icon={Percent} 
          description="Próximo período de apuração" 
          colorClass="text-purple-500"
        />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Fechamento de Obrigações</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="obrigacoes">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="obrigacoes">Obrigações</TabsTrigger>
              <TabsTrigger value="guias">Guias</TabsTrigger>
              <TabsTrigger value="apuracao">Apuração</TabsTrigger>
            </TabsList>
            
            <TabsContent value="obrigacoes">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border border-border bg-background">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm sm:text-base flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            Fechamento Mês Anterior
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            {format(subMonths(currentSelectedDate, 1), "MMMM 'de' yyyy", { locale: ptBR })}
                          </CardDescription>
                        </div>
                        <Badge className={fiscalData.fechamentoAnteriorStatus === "Concluído" 
                          ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                          : "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
                        }>
                          {fiscalData.fechamentoAnteriorStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs sm:text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Início:</span>
                          <span>01/05/2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prazo:</span>
                          <span>20/05/2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Responsável:</span>
                          <span>Ana Clara</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 text-xs sm:text-sm"
                      >
                        {fiscalData.fechamentoAnteriorStatus === "Concluído" ? "Ver Detalhes" : "Iniciar Fechamento"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border bg-background">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm sm:text-base flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                            Próximas Obrigações
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            Vencimentos em 7 dias
                          </CardDescription>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                          3 Pendentes
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs sm:text-sm space-y-2">
                        <li className="flex justify-between items-center">
                          <span>DARF PIS/COFINS</span>
                          <Badge variant="outline">25/05/2025</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>GFIP</span>
                          <Badge variant="outline">20/05/2025</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>SPED Fiscal</span>
                          <Badge variant="outline">22/05/2025</Badge>
                        </li>
                      </ul>
                      <Button 
                        className="w-full mt-3 text-xs sm:text-sm"
                      >
                        Ver Calendário Completo
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-border bg-background">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm sm:text-base flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Status de Envio de Obrigações
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Acompanhe o envio das principais obrigações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">EFD-ICMS/IPI</h4>
                          <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                            Enviado
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enviado em: 10/05/2025<br />
                          Protocolo: 12345678
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">EFD-Contribuições</h4>
                          <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">
                            Pendente
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prazo: 15/05/2025<br />
                          Responsável: Carlos Silva
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">DCTF</h4>
                          <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                            Enviado
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enviado em: 05/05/2025<br />
                          Protocolo: 87654321
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="guias">
              <div className="flex items-center justify-center h-60 text-muted-foreground text-sm">
                Conteúdo da aba Guias em desenvolvimento...
              </div>
            </TabsContent>
            
            <TabsContent value="apuracao">
              <div className="flex items-center justify-center h-60 text-muted-foreground text-sm">
                Conteúdo da aba Apuração em desenvolvimento...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" /> 
              Notas Emitidas
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Resumo de documentos fiscais do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex flex-col xs:flex-row justify-between mb-2">
                  <h4 className="font-medium text-sm">NF-e (Produtos)</h4>
                  <Badge variant="outline" className="mt-1 xs:mt-0 self-start xs:self-auto">
                    45 documentos
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Valor Total:</span>
                    <span className="font-medium text-foreground">R$ 124.780,45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canceladas:</span>
                    <span>2 (R$ 3.450,00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICMS Total:</span>
                    <span>R$ 21.212,88</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex flex-col xs:flex-row justify-between mb-2">
                  <h4 className="font-medium text-sm">NFS-e (Serviços)</h4>
                  <Badge variant="outline" className="mt-1 xs:mt-0 self-start xs:self-auto">
                    18 documentos
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Valor Total:</span>
                    <span className="font-medium text-foreground">R$ 45.320,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canceladas:</span>
                    <span>1 (R$ 1.200,00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ISS Total:</span>
                    <span>R$ 2.266,00</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                Ver Detalhamento Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" /> 
              Empresas
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Status das empresas gerenciadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Empresa Alpha Ltda.</h4>
                    <p className="text-xs text-muted-foreground mt-1">CNPJ: 12.345.678/0001-99</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                    Regular
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Simples Nacional</Badge>
                  <Badge variant="outline" className="text-xs">Comércio</Badge>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Comércio Beta S.A.</h4>
                    <p className="text-xs text-muted-foreground mt-1">CNPJ: 98.765.432/0001-10</p>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">
                    Pendências
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Lucro Presumido</Badge>
                  <Badge variant="outline" className="text-xs">Serviços</Badge>
                </div>
                <p className="text-xs text-red-500 mt-2">
                  Pendência: Certidão Negativa de Débitos vencida
                </p>
              </div>
              
              <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                Gerenciar Empresas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FiscalDashboardPage;