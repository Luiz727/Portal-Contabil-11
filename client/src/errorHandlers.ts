/**
 * Configuração de handlers globais para erros não capturados
 */

export const setupErrorHandlers = () => {
  // Handler para erros gerais
  window.addEventListener('error', (event) => {
    console.error('Erro global não tratado:', event.error);
    console.error('Mensagem:', event.message);
    console.error('Stack:', event.error?.stack);
  });

  // Handler para promessas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promessa rejeitada não tratada:', event.reason);
    if (event.reason?.stack) {
      console.error('Stack:', event.reason.stack);
    }
  });

  console.log('Handlers de erro global configurados');
};