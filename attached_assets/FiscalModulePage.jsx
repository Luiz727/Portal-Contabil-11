import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { DollarSign, TrendingUp, FileText, Users, Percent, CalendarDays, BarChart2, AlertTriangle, CheckCircle, Clock, Building, Scale, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmpresas } from '@/contexts/EmpresasContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { format, subMonths, getYear, getMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ImpostometroWidget = ({ valor, mesAno }) => {
  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  return (
    <Card className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Impostômetro ({mesAno})</span>
          <DollarSign className="h-7 w-7 opacity-80" />
        </CardTitle>
        <CardDescription className="text-red-200">Estimativa de impostos sobre vendas registradas no período.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{formatCurrency(valor)}</p>
        <p className="text-xs text-red-100 mt-1">Valores simulados para o período selecionado.</p>
      </CardContent>
    </Card>
  );
};

const OverviewCard = ({ title, value, icon: Icon, description, colorClass = "text-primary" }) => (
  <Card className="bg-card border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
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
    <div className="flex items-center space-x-2 mb-6 p-3 bg-muted/30 rounded-lg border border-border">
      <span className="text-sm font-medium text-muted-foreground">Período:</span>
      <Select value={getMonth(selectedDate).toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[180px] bg-input border-border text-foreground focus:border-primary">
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
        <SelectTrigger className="w-[120px] bg-input border-border text-foreground focus:border-primary">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-popover-foreground">
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const FiscalModulePage = () => {
  const { selectedEmpresa, actingAsEmpresa, allEmpresasSistema, empresasDisponiveis } = useEmpresas();
  const { userType } = useAuth();
  const { toast } = useToast();
  
  const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());
  const [impostometroValor, setImpostometroValor] = useState(0);
  const [fiscalData, setFiscalData] = useState({
    previsaoImpostosMes: 0,
    receitaBrutaAcumulada: 0,
    aliquotaSimples: 0, 
    fechamentoAnteriorStatus: "Pendente", 
  });
  const [empresaContextoEscritorio, setEmpresaContextoEscritorio] = useState(null);

  const empresaEscritorioMatriz = allEmpresasSistema.find(e => e.tipo === 'EscritorioContabil');

  const empresaParaVisualizar = 
    userType === 'Escritorio' && !actingAsEmpresa 
      ? (empresaContextoEscritorio || empresaEscritorioMatriz)
      : (actingAsEmpresa || selectedEmpresa);

  useEffect(() => {
    if (empresaParaVisualizar) {
      const randomFactor = (getMonth(currentSelectedDate) + 1) / 12 + getYear(currentSelectedDate) / (getYear(new Date()) +1) ;
      setImpostometroValor((Math.random() * 5000 + 8000) * randomFactor); 
      setFiscalData({
        previsaoImpostosMes: (Math.random() * 10000 + 5000) * randomFactor,
        receitaBrutaAcumulada: (Math.random() * 150000 + 100000) * (getYear(currentSelectedDate) <= getYear(new Date()) ? randomFactor : 0.1),
        aliquotaSimples: (Math.random() * 0.1 + 0.04).toFixed(3),
        fechamentoAnteriorStatus: getMonth(currentSelectedDate) === getMonth(subMonths(new Date(),1)) ? "Concluído" : "Pendente"
      });
      
      const toastTitle = userType === 'Escritorio' && !actingAsEmpresa && !empresaContextoEscritorio
        ? `Visão Geral do Escritório (Matriz)`
        : `Módulo Fiscal Carregado`;

      const toastDescription = userType === 'Escritorio' && !actingAsEmpresa && !empresaContextoEscritorio
        ? `Visualizando dados consolidados ou da Matriz referente a ${format(currentSelectedDate, 'MMMM/yyyy', { locale: ptBR })}.`
        : `Visualizando dados para ${empresaParaVisualizar.nome} referente a ${format(currentSelectedDate, 'MMMM/yyyy', { locale: ptBR })}.`;
      
      if (userType !== 'Escritorio' || actingAsEmpresa || (userType === 'Escritorio' && !actingAsEmpresa && empresaContextoEscritorio)) {
        toast({
          title: toastTitle,
          description: toastDescription,
          className: "bg-primary text-primary-foreground"
        });
      }
    }
  }, [empresaParaVisualizar, currentSelectedDate, toast, userType, actingAsEmpresa, empresaContextoEscritorio]);

  const handleEmpresaContextoChange = (empresaId) => {
    if (empresaId === "matriz_nixcon") {
      setEmpresaContextoEscritorio(null);
    } else {
      const empresaSelecionada = empresasDisponiveis.find(e => e.id === empresaId);
      setEmpresaContextoEscritorio(empresaSelecionada);
    }
  };

  if (!empresaParaVisualizar && userType !== 'Escritorio') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Building className="w-16 h-16 mb-6 text-primary/70" />
        <h1 className="text-3xl font-semibold text-primary mb-3">Nenhuma Empresa Ativa</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Por favor, selecione uma empresa para visualizar o módulo fiscal.
        </p>
      </div>
    );
  }
  
  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  const formatPercent = (value) => `${(Number(value) * 100).toFixed(2)}%`;
  const mesAnoSelecionado = format(currentSelectedDate, 'MMMM/yyyy', { locale: ptBR });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Scale className="mr-3 h-8 w-8 text-primary" /> Módulo Fiscal: 
          <span className="text-primary ml-2">{empresaParaVisualizar ? empresaParaVisualizar.nome : "Visão Geral Escritório"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Acompanhe e gerencie as informações fiscais.</p>
      </div>

      {userType === 'Escritorio' && !actingAsEmpresa && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Selecionar Empresa para Contexto Fiscal</CardTitle>
            <CardDescription>Escolha uma empresa para visualizar ou inserir dados fiscais específicos, ou veja os dados da Matriz.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={empresaContextoEscritorio ? empresaContextoEscritorio.id : "matriz_nixcon"}
              onValueChange={handleEmpresaContextoChange}
            >
              <SelectTrigger className="w-full md:w-[320px] bg-input border-border text-foreground focus:border-primary">
                <SelectValue placeholder="Selecione uma Empresa Usuária ou Matriz" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectGroup>
                  <SelectLabel className="text-muted-foreground">Visão Escritório</SelectLabel>
                  <SelectItem value="matriz_nixcon" className="hover:bg-accent focus:bg-accent">
                    Nixcon Contabilidade (Matriz)
                  </SelectItem>
                </SelectGroup>
                {empresasDisponiveis && empresasDisponiveis.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground">Empresas Usuárias</SelectLabel>
                    {empresasDisponiveis.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id} className="hover:bg-accent focus:bg-accent">
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {!empresaParaVisualizar && userType === 'Escritorio' && !actingAsEmpresa && !empresaContextoEscritorio && (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center border border-dashed border-border rounded-lg bg-muted/30">
            <Building className="w-12 h-12 mb-4 text-primary/50" />
            <h2 className="text-xl font-semibold text-primary mb-2">Selecione um Contexto</h2>
            <p className="text-md text-muted-foreground max-w-md">
              Para visualizar ou inserir dados fiscais, por favor selecione a Matriz ou uma Empresa Usuária acima.
            </p>
          </div>
      )}

      {empresaParaVisualizar && (
        <>
          <MonthYearSelector selectedDate={currentSelectedDate} onDateChange={setCurrentSelectedDate} />
          <ImpostometroWidget valor={impostometroValor} mesAno={mesAnoSelecionado} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <OverviewCard title={`Previsão Impostos (${mesAnoSelecionado})`} value={formatCurrency(fiscalData.previsaoImpostosMes)} icon={TrendingUp} description="Estimativa para o período." />
            <OverviewCard title={`Receita Bruta Acumulada (${getYear(currentSelectedDate)})`} value={formatCurrency(fiscalData.receitaBrutaAcumulada)} icon={BarChart2} description="Total de receita no ano." />
            <OverviewCard title={`Alíquota Simples (${mesAnoSelecionado})`} value={formatPercent(fiscalData.aliquotaSimples)} icon={Percent} description="Alíquota efetiva do Simples." colorClass="text-green-500" />
            <OverviewCard 
              title={`Fechamento (${format(subMonths(currentSelectedDate,1), 'MMMM/yy', { locale: ptBR })})`}
              value={fiscalData.fechamentoAnteriorStatus} 
              icon={fiscalData.fechamentoAnteriorStatus === "Concluído" ? CheckCircle : AlertTriangle} 
              description="Status do fechamento anterior."
              colorClass={fiscalData.fechamentoAnteriorStatus === "Concluído" ? "text-green-500" : "text-red-500"}
            />
          </div>

          <Tabs defaultValue="vendas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-muted/50 border-border">
              <TabsTrigger value="vendas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Vendas</TabsTrigger>
              <TabsTrigger value="compras" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Compras</TabsTrigger>
              <TabsTrigger value="servicos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Serviços</TabsTrigger>
              <TabsTrigger value="folha" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Folha Pagto.</TabsTrigger>
              <TabsTrigger value="fechamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Fechamento</TabsTrigger>
            </TabsList>
            
            {[ "vendas", "compras", "servicos", "folha", "fechamento"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground capitalize">Resumo de {tabValue === "folha" ? "Folha de Pagamento" : tabValue}</CardTitle>
                    <CardDescription className="text-muted-foreground">Informações de {tabValue} para {mesAnoSelecionado}.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    {tabValue === "vendas" && <FileText className="mx-auto h-12 w-12 text-primary/50 mb-4" />}
                    {tabValue === "compras" && <FileText className="mx-auto h-12 w-12 text-primary/50 mb-4" />}
                    {tabValue === "servicos" && <FileText className="mx-auto h-12 w-12 text-primary/50 mb-4" />}
                    {tabValue === "folha" && <Users className="mx-auto h-12 w-12 text-primary/50 mb-4" />}
                    {tabValue === "fechamento" && <Clock className="mx-auto h-12 w-12 text-primary/50 mb-4" />}
                    <p className="text-muted-foreground">Detalhes de {tabValue} para {mesAnoSelecionado} aparecerão aqui.</p>
                    { (userType === 'Escritorio' || (empresaParaVisualizar && empresaParaVisualizar.modulosHabilitados?.includes('fiscal_detalhado'))) && tabValue !== "fechamento" && <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Ver Relatório Detalhado</Button>}
                    {tabValue === "fechamento" && (
                      <>
                        <p className="text-muted-foreground mt-2">Status: {fiscalData.fechamentoAnteriorStatus === "Concluído" && getMonth(currentSelectedDate) === getMonth(new Date()) ? "Mês corrente em aberto." : fiscalData.fechamentoAnteriorStatus}</p>
                        {(userType === 'Escritorio' || (empresaParaVisualizar && empresaParaVisualizar.modulosHabilitados?.includes('fiscal_fechamento'))) && <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Iniciar/Verificar Fechamento de {mesAnoSelecionado}</Button>}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

export default FiscalModulePage;