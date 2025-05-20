import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const InvoicesPage = () => {
  // Poderia importar componentes reais aqui
  const InvoiceList = () => (
    <div className="text-center py-6 text-muted-foreground">
      Lista de Notas Fiscais (Component Placeholder)
    </div>
  );

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
            <FileSpreadsheet className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" /> 
            Notas Fiscais
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gerencie a emissão e consulta de NF-e, NFS-e, NFC-e e CT-e.
          </p>
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            Emitir NF-e
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
          >
            Importar XML
          </Button>
        </div>
      </motion.div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <CardTitle className="text-xl text-foreground">Documentos Fiscais</CardTitle>
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar documentos..."
              className="pl-9 bg-input border-border text-foreground focus:border-primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nfe" className="w-full">
            <TabsList className="grid grid-cols-4 sm:inline-flex mb-4">
              <TabsTrigger value="nfe">NF-e</TabsTrigger>
              <TabsTrigger value="nfse">NFS-e</TabsTrigger>
              <TabsTrigger value="nfce">NFC-e</TabsTrigger>
              <TabsTrigger value="cte">CT-e</TabsTrigger>
            </TabsList>
            <TabsContent value="nfe">
              <InvoiceList />
            </TabsContent>
            <TabsContent value="nfse">
              <InvoiceList />
            </TabsContent>
            <TabsContent value="nfce">
              <InvoiceList />
            </TabsContent>
            <TabsContent value="cte">
              <InvoiceList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;