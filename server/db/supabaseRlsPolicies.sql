-- Arquivo com políticas de RLS (Row Level Security) para o Supabase
-- Implementa regras de acesso para diferentes níveis de usuário no NIXCON

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE escritorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_empresas ENABLE ROW LEVEL SECURITY;

-- Configurações para SUPERADMIN (adm@nixcon.com.br)
-- Política que identifica o superadmin pelo email e concede acesso total a todas as tabelas
CREATE POLICY "Superadmin tem acesso total" ON usuarios
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'adm@nixcon.com.br' OR is_super_admin = true);

CREATE POLICY "Superadmin tem acesso total" ON escritorios
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'adm@nixcon.com.br' OR 
           EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.is_super_admin = true));

CREATE POLICY "Superadmin tem acesso total" ON empresas
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'adm@nixcon.com.br' OR 
           EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.is_super_admin = true));

CREATE POLICY "Superadmin tem acesso total" ON clientes
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'adm@nixcon.com.br' OR 
           EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.is_super_admin = true));

CREATE POLICY "Superadmin tem acesso total" ON usuarios_empresas
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'adm@nixcon.com.br' OR 
           EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.is_super_admin = true));

-- Políticas para Usuários do ESCRITÓRIO DE CONTABILIDADE
-- Eles podem ver todos os usuários, mas só podem editar os que pertencem ao seu escritório
CREATE POLICY "Escritório pode ver todos os usuários" ON usuarios
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'escritorio' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Escritório pode editar usuários do seu escritório" ON usuarios
    FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'escritorio' AND 
           escritorio_id = (SELECT escritorio_id FROM usuarios WHERE id = auth.uid()));

CREATE POLICY "Escritório pode adicionar usuários ao seu escritório" ON usuarios
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'role' = 'escritorio' AND 
                escritorio_id = (SELECT escritorio_id FROM usuarios WHERE id = auth.uid()));

-- Escritório pode ver e gerenciar todas as suas empresas
CREATE POLICY "Escritório pode ver e gerenciar suas empresas" ON empresas
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'escritorio' AND 
           escritorio_id = (SELECT escritorio_id FROM usuarios WHERE id = auth.uid()));

-- Escritório pode ver e gerenciar todos os clientes das suas empresas
CREATE POLICY "Escritório pode ver e gerenciar clientes de suas empresas" ON clientes
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'escritorio' AND 
           EXISTS (
               SELECT 1 FROM empresas 
               WHERE empresas.id = clientes.empresa_id AND 
               empresas.escritorio_id = (SELECT escritorio_id FROM usuarios WHERE id = auth.uid())
           ));

-- Políticas para Usuários das EMPRESAS USUÁRIAS
-- Empresas podem ver e editar apenas seus próprios dados e clientes
CREATE POLICY "Empresa pode ver e editar seus próprios dados" ON empresas
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'empresa' AND 
           id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

CREATE POLICY "Empresa pode ver e gerenciar seus próprios clientes" ON clientes
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'empresa' AND 
           empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Empresas podem ver e gerenciar seus próprios usuários
CREATE POLICY "Empresa pode ver e gerenciar seus próprios usuários" ON usuarios
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'empresa' AND 
           empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Políticas para CLIENTES
-- Clientes podem ver apenas seus próprios dados
CREATE POLICY "Cliente pode ver seus próprios dados" ON clientes
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'cliente' AND 
           cpf_cnpj = (SELECT cpf_cnpj FROM clientes WHERE id = auth.uid()));

-- Função para verificar se um usuário é superadmin ao fazer login
CREATE OR REPLACE FUNCTION public.check_if_superadmin()
RETURNS trigger AS $$
BEGIN
  IF NEW.email = 'adm@nixcon.com.br' THEN
    NEW.is_super_admin = true;
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para aplicar a verificação de superadmin a cada inserção/atualização
CREATE TRIGGER set_superadmin_status
BEFORE INSERT OR UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION public.check_if_superadmin();

-- Funções auxiliares que podem ser chamadas através da API do Supabase
-- Função para verificar se o usuário atual tem acesso a uma empresa específica
CREATE OR REPLACE FUNCTION public.has_empresa_access(empresa_id UUID)
RETURNS boolean AS $$
DECLARE
  user_role text;
  user_empresa_id UUID;
  user_escritorio_id UUID;
  is_super boolean;
BEGIN
  -- Obter dados do usuário atual
  SELECT 
    role, 
    empresa_id, 
    escritorio_id, 
    is_super_admin
  INTO 
    user_role, 
    user_empresa_id, 
    user_escritorio_id,
    is_super
  FROM usuarios 
  WHERE id = auth.uid();
  
  -- Super admin tem acesso a tudo
  IF is_super = true THEN
    RETURN true;
  END IF;
  
  -- Verificar acesso baseado no papel
  CASE user_role
    WHEN 'admin' THEN
      RETURN true;
    WHEN 'escritorio' THEN
      RETURN EXISTS (
        SELECT 1 FROM empresas 
        WHERE id = empresa_id 
        AND escritorio_id = user_escritorio_id
      );
    WHEN 'empresa' THEN
      RETURN user_empresa_id = empresa_id;
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;