import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus, Package, Users, Briefcase, Tag, Box, Factory, TruckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryCard = ({ title, icon: Icon, description, count, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card className="bg-card hover:shadow-md transition-shadow duration-300 group cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Icon className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <span className="text-sm px-2 py-1 bg-accent rounded-full">{count}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Último atualizado: 17/05/2025</span>
        <Button size="sm" variant="ghost" className="text-primary">
          Acessar
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const FiscalCadastrosPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  const categories = [
    { id: 'produtos', title: 'Produtos', icon: Package, description: 'Gerenciar catálogo de produtos', count: 458, type: 'items' },
    { id: 'servicos', title: 'Serviços', icon: Briefcase, description: 'Gerenciar catálogo de serviços', count: 72, type: 'items' },
    { id: 'clientes', title: 'Clientes', icon: Users, description: 'Gerenciar cadastro de clientes', count: 124, type: 'entities' },
    { id: 'fornecedores', title: 'Fornecedores', icon: Factory, description: 'Gerenciar cadastro de fornecedores', count: 45, type: 'entities' },
    { id: 'marcas', title: 'Marcas', icon: Tag, description: 'Gerenciar marcas de produtos', count: 32, type: 'config' },
    { id: 'categorias', title: 'Categorias', icon: Box, description: 'Gerenciar categorias de produtos', count: 18, type: 'config' },
    { id: 'transportadoras', title: 'Transportadoras', icon: TruckIcon, description: 'Gerenciar transportadoras', count: 8, type: 'entities' },
    { id: 'kits', title: 'Kits', icon: Box, description: 'Gerenciar kits de produtos', count: 12, type: 'items' },
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'todos' || category.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Cadastros e Configurações
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os cadastros do sistema fiscal
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Cadastro
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar cadastros..."
            className="pl-9 bg-input border-border text-foreground focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="entities">Entidades</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCategories.map((category, index) => (
          <CategoryCard 
            key={category.id}
            title={category.title}
            icon={category.icon}
            description={category.description}
            count={category.count}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

export default FiscalCadastrosPanel;