import React from 'react';
import InvoiceList from '@/components/invoices/InvoiceList';
import { FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

const InvoicesPage = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <FileSpreadsheet className="mr-3 h-8 w-8 text-primary" /> Notas Fiscais
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie a emissão e consulta de NF-e, NFS-e, NFC-e e CT-e.</p>
        </div>
      </motion.div>
      <InvoiceList />
    </div>
  );
};

export default InvoicesPage;