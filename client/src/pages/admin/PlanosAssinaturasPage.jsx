import React, { useState } from 'react';
import { 
  CreditCard,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PlanosAssinaturasPage = () => {
  // Estado para armazenar os planos
  const [planos, setPlanos] = useState([
    {
      id: 1,
      nome: 'Gratuito',
      preco: 'R$ 0',
      periodo: '/mês',
      popular: false,
      recursos: [
        { label: 'Usuários: 1 Usuário', incluido: true },
        { label: 'Armazenamento: 500MB', incluido: true },
        { label: 'Clientes Gerenciáveis: 5 Clientes', incluido: true },
        { label: 'Suporte Prioritário', incluido: false },
        { label: 'Emissão de NF-e/NFS-e', incluido: false }
      ],
      chamadaAcao: 'Selecionar Plano',
      descricao: 'Para experimentar a plataforma e pequenas necessidades.'
    },
    {
      id: 2,
      nome: 'Básico',
      preco: 'R$ 49,90',
      periodo: '/mês',
      popular: false,
      recursos: [
        { label: 'Usuários: 3 Usuários', incluido: true },
        { label: 'Armazenamento: 5GB', incluido: true },
        { label: 'Clientes Gerenciáveis: 50 Clientes', incluido: true },
        { label: 'Suporte Prioritário', incluido: true },
        { label: 'Emissão de NF-e/NFS-e', incluido: true }
      ],
      chamadaAcao: 'Selecionar Plano',
      descricao: 'Ideal para escritórios em crescimento e autônomos.'
    },
    {
      id: 3,
      nome: 'Intermediário',
      preco: 'R$ 99,90',
      periodo: '/mês',
      popular: true,
      recursos: [
        { label: 'Usuários: 10 Usuários', incluido: true },
        { label: 'Armazenamento: 20GB', incluido: true },
        { label: 'Clientes Gerenciáveis: 200 Clientes', incluido: true },
        { label: 'Suporte Prioritário', incluido: true },
        { label: 'Emissão de NF-e/NFS-e', incluido: true }
      ],
      chamadaAcao: 'Começar Agora',
      descricao: 'Recursos avançados para otimizar sua produtividade.'
    },
    {
      id: 4,
      nome: 'Premium',
      preco: 'R$ 199,90',
      periodo: '/mês',
      popular: false,
      recursos: [
        { label: 'Usuários: Ilimitados', incluido: true },
        { label: 'Armazenamento: 100GB', incluido: true },
        { label: 'Clientes Gerenciáveis: Ilimitados', incluido: true },
        { label: 'Suporte Prioritário', incluido: true },
        { label: 'Emissão de NF-e/NFS-e', incluido: true }
      ],
      chamadaAcao: 'Selecionar Plano',
      descricao: 'Acesso total e suporte prioritário para grandes demandas.'
    }
  ]);
  
  // Estado para perguntas frequentes
  const [faq, setFaq] = useState([
    {
      pergunta: 'Posso mudar de plano a qualquer momento?',
      resposta: 'Sim, você pode fazer upgrade ou downgrade do seu plano diretamente na plataforma ou entrar em contato com o suporte.'
    },
    {
      pergunta: 'O que acontece se eu exceder o limite de clientes do meu plano?',
      resposta: 'Quando você se aproxima do limite, receberá uma notificação sugerindo o upgrade para um plano superior. Não há cobrança adicional por cliente excedente, mas será necessário fazer o upgrade para adicionar novos clientes.'
    },
    {
      pergunta: 'Posso cancelar minha assinatura a qualquer momento?',
      resposta: 'Sim, você pode cancelar sua assinatura a qualquer momento. O acesso permanecerá ativo até o final do período faturado.'
    },
    {
      pergunta: 'Como funciona o armazenamento de documentos?',
      resposta: 'O armazenamento se refere ao espaço disponível para documentos, relatórios, notas fiscais e outros arquivos relacionados aos seus clientes. Todos os arquivos são armazenados de forma segura e com backup.'
    },
    {
      pergunta: 'Existe um período de teste gratuito?',
      resposta: 'Sim, oferecemos o plano Gratuito que permite experimentar as funcionalidades básicas da plataforma. Além disso, você pode solicitar uma demonstração completa das funcionalidades dos planos pagos.'
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#d9bb42]/10 flex items-center justify-center rounded-lg">
          <CreditCard size={20} className="text-[#d9bb42]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Planos e Assinaturas Nixcon</h1>
      </div>
      <p className="text-gray-500 mb-10">Escolha o plano que melhor se adapta às necessidades do seu escritório contábil.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {planos.map(plano => (
          <Card key={plano.id} className={`overflow-hidden ${plano.popular ? 'border-[#d9bb42] ring-1 ring-[#d9bb42]' : ''}`}>
            {plano.popular && (
              <div className="bg-[#d9bb42] text-white text-xs font-medium py-1 px-3 text-center">
                Mais Popular
              </div>
            )}
            <CardHeader className={`${plano.popular ? 'pt-4' : 'pt-6'}`}>
              <CardTitle className="text-xl font-bold">{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">{plano.preco}</p>
                <p className="text-sm text-gray-500">{plano.periodo}</p>
              </div>
              
              <ul className="space-y-3">
                {plano.recursos.map((recurso, index) => (
                  <li key={index} className="flex items-start">
                    {recurso.incluido ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                    )}
                    <span className={recurso.incluido ? "text-sm" : "text-sm text-gray-400"}>
                      {recurso.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={plano.popular 
                  ? "w-full bg-[#d9bb42] hover:bg-[#c5aa3a] text-white" 
                  : "w-full bg-gray-800 hover:bg-gray-700 text-white"
                }
              >
                {plano.chamadaAcao}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <HelpCircle size={18} className="text-[#d9bb42]" />
          Dúvidas Frequentes sobre Planos
        </h2>
        
        <Accordion type="single" collapsible className="border rounded-lg">
          {faq.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
        <h2 className="text-lg font-medium mb-2">Precisa de um plano personalizado?</h2>
        <p className="text-gray-600 mb-4">Entre em contato com nossa equipe para criar um plano sob medida para seu escritório.</p>
        <Button variant="outline" className="border-[#d9bb42] text-[#d9bb42] hover:bg-[#d9bb42]/10">
          Falar com Consultor
        </Button>
      </div>
    </div>
  );
};

export default PlanosAssinaturasPage;