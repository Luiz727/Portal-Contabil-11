import React from 'react';
    import { Outlet, Link, useLocation } from 'react-router-dom';
    import { UserCircle, Building, ShieldCheck, Percent, Palette, KeyRound, Bell, GitBranch, HelpCircle, FileKey2, Users, Lock, FileText, SlidersHorizontal, Briefcase } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';

    const settingsTabs = [
      { value: 'profile', label: 'Meu Perfil', icon: UserCircle, path: '/settings/profile' },
      { value: 'company', label: 'Empresa', icon: Building, path: '/settings/company' },
      { value: 'users', label: 'Usuários', icon: Users, path: '/user-management' },
      { value: 'permissions', label: 'Permissões', icon: Lock, path: '/settings/permissions' },
      { value: 'fiscal-configs', label: 'Fiscal', icon: Percent, path: '/settings/fiscal-configs' },
      { value: 'appearance', label: 'Aparência', icon: Palette, path: '/settings/appearance' },
      { value: 'integrations', label: 'Integrações', icon: KeyRound, path: '/settings/integrations' },
      { value: 'notifications', label: 'Notificações', icon: Bell, path: '/settings/notifications' },
      { value: 'advanced', label: 'Avançado', icon: GitBranch, path: '/settings/advanced' },
      { value: 'help', label: 'Ajuda', icon: HelpCircle, path: '/settings/help' },
      { value: 'plans', label: 'Planos', icon: FileKey2, path: '/registrations/plans', isGlobalAdminOnly: true },
      { value: 'global-settings', label: 'Admin Central', icon: ShieldCheck, path: '/settings/central-admin', isGlobalAdminOnly: true },
      { value: 'audit-log', label: 'Logs Auditoria', icon: FileText, path: '/audit-log', isGlobalAdminOnly: true },
      { value: 'tax-calculator-config', label: 'Calc. Impostos', icon: SlidersHorizontal, path: '/settings/tax-calculator-config' },
      { value: 'global-products', label: 'Produtos Globais', icon: Briefcase, path: '/registrations/products', isGlobalAdminOnly: true },
    ];
    
    const SettingsPage = () => {
      const location = useLocation();
      const activeTab = settingsTabs.find(tab => location.pathname.startsWith(tab.path))?.value || 'profile';

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <nav className="space-y-1 bg-card p-3 rounded-lg border border-border shadow-sm">
                {settingsTabs.map(tab => {
                  // TODO: Adicionar lógica para filtrar tabs baseada em permissões (isGlobalAdminOnly)
                  const Icon = tab.icon;
                  const isActive = location.pathname.startsWith(tab.path);
                  return (
                    <Link
                      key={tab.value}
                      to={tab.path}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <main className="flex-1">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card p-4 md:p-6 rounded-lg shadow-sm border border-border min-h-[calc(100vh-200px)]"
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </motion.div>
      );
    };

    export default SettingsPage;