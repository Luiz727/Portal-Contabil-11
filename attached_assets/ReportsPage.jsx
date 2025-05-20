import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, FileText, Download, CalendarCheck2, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const reportTypes = [
  { 
    title: "Relatório de Desempenho Financeiro", 
    description: "Análise detalhada de receitas, despesas e lucratividade.",
    icon: <TrendingUp className="h-8 w-8 text-green-400" />,
    category: "Financeiro",
    delay: 0.1
  },
  { 
    title: "Obrigações Pendentes", 
    description: "Lista de todas as obrigações fiscais e contábeis com prazos.",
    icon: <AlertTriangle className="h-8 w-8 text-red-400" />,
    category: "Fiscal",
    delay: 0.2
  },
  { 
    title: "Faturamento por Cliente", 
    description: "Detalhes do faturamento individual de cada cliente.",
    icon: <Users className="h-8 w-8 text-blue-400" />,
    category: "Clientes",
    delay: 0.3
  },
  { 
    title: "Relatório de Vencimentos", 
    description: "Contas a pagar e a receber com datas de vencimento próximas.",
    icon: <CalendarCheck2 className="h-8 w-8 text-yellow-400" />,
    category: "Financeiro",
    delay: 0.4
  },
  { 
    title: "Produtividade da Equipe", 
    description: "Análise de tarefas concluídas e tempo gasto por colaborador.",
    icon: <BarChart2 className="h-8 w-8 text-purple-400" />,
    category: "Equipe",
    delay: 0.5
  },
  { 
    title: "Log de Auditoria", 
    description: "Histórico de acessos e ações realizadas no sistema.",
    icon: <FileText className="h-8 w-8 text-gray-400" />,
    category: "Sistema",
    delay: 0.6
  },
];

const ReportCard = ({ title, description, icon, category, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="bg-slate-800/60 border-slate-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        {icon}
        <div>
          <CardTitle className="text-lg text-purple-300">{title}</CardTitle>
          <span className="text-xs px-2 py-0.5 mt-1 inline-block rounded-full bg-slate-700 text-gray-400">{category}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-gray-400">{description}</CardDescription>
      </CardContent>
      <div className="p-4 pt-0">
        <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300">
          <Download className="mr-2 h-4 w-4" /> Gerar Relatório
        </Button>
      </div>
    </Card>
  </motion.div>
);

const ReportsPage = () => {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Central de Relatórios</h1>
        <p className="text-lg text-gray-400">Acesse e gere relatórios detalhados para otimizar sua gestão.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <ReportCard key={report.title} {...report} />
        ))}
      </div>
      
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: reportTypes.length * 0.1 + 0.2 }}
      >
        <p className="text-gray-500 text-sm">
          Precisa de um relatório personalizado? <Button variant="link" className="text-purple-400 p-0">Entre em contato com o suporte.</Button>
        </p>
      </motion.div>
    </div>
  );
};

export default ReportsPage;