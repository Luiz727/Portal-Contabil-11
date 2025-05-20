import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import NixconLogo from '@/components/NixconLogo';
    import HeroSection from '@/components/landing/HeroSection';
    import FeaturesSection from '@/components/landing/FeaturesSection';
    import DetailedFeaturesSection from '@/components/landing/DetailedFeaturesSection';
    import PricingSection from '@/components/landing/PricingSection';
    import CallToActionSection from '@/components/landing/CallToActionSection';
    import { supabase } from '@/lib/supabaseClient';
    import { Loader2 } from 'lucide-react';

    const LandingPage = () => {
      const [content, setContent] = useState({});
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchLandingPageContent = async () => {
          setLoading(true);
          try {
            const { data, error: dbError } = await supabase
              .from('landing_page_content')
              .select('section_key, content_value, content_type');

            if (dbError) {
              throw dbError;
            }

            const formattedContent = data.reduce((acc, item) => {
              acc[item.section_key] = item.content_value;
              return acc;
            }, {});
            setContent(formattedContent);
          } catch (err) {
            console.error("Error fetching landing page content:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchLandingPageContent();
      }, []);

      if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Carregando conteúdo...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
            <NixconLogo className="h-20 w-20 text-destructive mb-6" />
            <h1 className="text-3xl font-semibold text-destructive mb-3">Erro ao Carregar Conteúdo</h1>
            <p className="text-lg text-muted-foreground max-w-md mb-6">
              Não foi possível carregar as informações da página inicial. Por favor, tente novamente mais tarde.
            </p>
            <p className="text-sm text-muted-foreground/70">Detalhe do erro: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-8">Tentar Novamente</Button>
          </div>
        );
      }
      
      return (
        <div className="bg-gradient-to-br from-background to-blue-50/50 text-foreground min-h-screen">
          <header className="py-6 px-4 md:px-8 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-2">
                <NixconLogo className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold text-primary">Nixcon</span>
              </Link>
              <nav className="space-x-3 md:space-x-4">
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Planos</a>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Entrar</Link>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                  <Link to="/register">Cadastre-se Grátis</Link>
                </Button>
              </nav>
            </div>
          </header>

          <main>
            <HeroSection content={content} />
            <FeaturesSection content={content} />
            <DetailedFeaturesSection content={content} />
            <PricingSection content={content} />
            <CallToActionSection content={content} />
          </main>
        </div>
      );
    };

    export default LandingPage;