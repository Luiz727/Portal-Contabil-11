import React, { useMemo } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { useEmpresas } from '@/contexts/EmpresasContext';
    import { getNavLinks } from '@/components/sidebar/navLinkConfig';
    import { Briefcase, FilePlus, DollarSign, BarChart3, Users, Settings, AlertTriangle, Loader2, Bell, Activity } from 'lucide-react';

    const QuickAccessCard = ({ title, description, icon: Icon, link, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="h-full"
      >
        <Card className="bg-card hover:shadow-primary/10 transition-shadow duration-300 flex flex-col h-full border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
              {Icon && <Icon className="h-6 w-6 text-primary" />}
            </div>
            <CardDescription className="text-sm text-muted-foreground pt-1">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button asChild variant="ghost" className="w-full justify-start text-primary hover:bg-primary/5">
              <Link to={link}>Acessar Módulo</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

    const DashboardPage = () => {
      const { user, userType } = useAuth();
      const { selectedEmpresa, actingAsEmpresa, loadingEmpresas, stopActingAs } = useEmpresas();

      const contextualEmpresa = actingAsEmpresa || selectedEmpresa;
      const empresaNome = contextualEmpresa?.nome || "Nenhuma empresa selecionada";
      const isEscritorioAtuando = userType === 'Escritorio' && actingAsEmpresa;

      const navLinks = useMemo(() => {
        if (user && userType) {
          return getNavLinks(userType, selectedEmpresa, actingAsEmpresa, user);
        }
        return [];
      }, [user, userType, selectedEmpresa, actingAsEmpresa]);

      const isModuleEnabled = (moduleKeyOrPath) => {
        if (!contextualEmpresa && userType !== 'Escritorio' && userType !== 'UsuarioCalculadora' && !isEscritorioAtuando) {
            if (userType === 'Escritorio' && !actingAsEmpresa) { // Escritório não atuando, checa permissões do escritório
                // Special case for global settings or admin modules for office user not acting as company
            } else {
                return false;
            }
        }
        
        const userPermissions = user?.user_metadata?.perfil_permissoes || {};
        
        const checkPermission = (key) => {
          const permissionLevel = userPermissions[key];
          return permissionLevel && permissionLevel !== 'none';
        };
    
        let targetLink = null;
        const findLink = (linksToSearch) => {
          for (const link of linksToSearch) {
            if (link.moduleKey === moduleKeyOrPath || link.href === moduleKeyOrPath) {
              targetLink = link;
              return;
            }
            if (link.subLinks) {
              findLink(link.subLinks);
              if (targetLink) return;
            }
          }
        };
        findLink(navLinks);
    
        if (targetLink && targetLink.moduleKey) {
          return checkPermission(targetLink.moduleKey);
        }
        if (typeof moduleKeyOrPath === 'string' && !moduleKeyOrPath.startsWith('/')) {
            return checkPermission(moduleKeyOrPath);
        }

        return false; 
      };


      const quickAccessItemsBase = [
        { title: 'Cadastros', description: 'Gerencie produtos, clientes e mais.', icon: Briefcase, link: '/registrations/products', moduleKey: 'registrations' },
        { title: 'Emissor Fiscal', description: 'Emita NF-e, NFS-e e outros documentos.', icon: FilePlus, link: '/issuer/nfe-issuer', moduleKey: 'issuer' },
        { title: 'Financeiro', description: 'Controle suas contas a pagar e receber.', icon: DollarSign, link: '/financial/payable', moduleKey: 'financial' },
        { title: 'Relatórios', description: 'Visualize o desempenho do seu negócio.', icon: BarChart3, link: '/reports/sales', moduleKey: 'reports' },
        { title: 'Usuários', description: 'Gerencie usuários e permissões.', icon: Users, link: '/user-management', moduleKey: userType === 'Escritorio' && !actingAsEmpresa ? 'admin_nixcon_users' : 'settings_company_users' },
        { title: 'Configurações', description: 'Ajuste as preferências do sistema.', icon: Settings, link: '/settings', moduleKey: userType === 'Escritorio' && !actingAsEmpresa ? 'settings_global' : 'settings_company' },
      ];
      
      const quickAccessItems = quickAccessItemsBase.filter(item => isModuleEnabled(item.moduleKey));

      if (loadingEmpresas && (!contextualEmpresa && userType !== 'Escritorio' && userType !== 'UsuarioCalculadora')) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">Carregando Dados...</h1>
            <p className="text-muted-foreground">Aguarde um momento enquanto preparamos seu painel.</p>
          </div>
        );
      }
      
      if (!contextualEmpresa && userType !== 'Escritorio' && userType !== 'UsuarioCalculadora') {
         return (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">Nenhuma Empresa Selecionada</h1>
            <p className="text-muted-foreground">Por favor, selecione uma empresa para visualizar o painel de controle.</p>
            {userType === 'Escritorio' && (
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/registrations/clients">Gerenciar Empresas Usuárias</Link>
              </Button>
            )}
          </div>
        );
      }


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Painel de Controle {isEscritorioAtuando ? `- Atuando como: ${actingAsEmpresa.nome}` : (contextualEmpresa && contextualEmpresa.nome ? `- ${contextualEmpresa.nome}`: '')}
              </h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo(a) de volta, {user?.user_metadata?.full_name || user?.email}! Aqui estão seus atalhos e informações importantes.
              </p>
            </div>
            {isEscritorioAtuando && (
              <Button variant="outline" onClick={stopActingAs} className="border-primary text-primary hover:bg-primary/10">
                Voltar para Visão do Escritório
              </Button>
            )}
          </div>

          {quickAccessItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {quickAccessItems.map((item, index) => (
                <QuickAccessCard key={item.title} {...item} delay={index * 0.1} />
              ))}
            </div>
          ) : (
             <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-primary flex items-center">
                        <AlertTriangle className="mr-2 h-6 w-6"/> Nenhum Módulo Acessível
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Você não tem permissão para acessar módulos nesta empresa/contexto ou nenhum módulo foi habilitado.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Se você for um administrador, verifique as configurações de permissões do seu perfil (<Link to="/settings/permissions" className="text-primary underline">Permissões de Acesso</Link>) e os módulos habilitados para a empresa (<Link to="/settings/company" className="text-primary underline">Configurações da Empresa</Link>).
                    </p>
                </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center"><Bell className="mr-2 h-5 w-5"/>Notificações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma notificação nova por enquanto.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center"><Activity className="mr-2 h-5 w-5"/>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dados financeiros indisponíveis no momento.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      );
    };

    export default DashboardPage;