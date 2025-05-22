import React from 'react';

const Billing: React.FC = () => {
  const currentPlan = {
    name: 'Plano Profissional',
    price: 'R$ 199,90',
    billingCycle: 'mensal',
    nextBillingDate: '22/06/2025',
    features: [
      'Emissão ilimitada de NF-e',
      'Emissão ilimitada de NFS-e',
      'Conciliação bancária',
      'Até 5 usuários',
      'Suporte prioritário',
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Faturamento e Assinatura</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Seu Plano Atual</h2>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h3 className="font-medium text-xl">{currentPlan.name}</h3>
                <p className="text-gray-600">{currentPlan.price} / {currentPlan.billingCycle}</p>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
                Alterar Plano
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">Próxima cobrança: {currentPlan.nextBillingDate}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Recursos Incluídos:</h3>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Histórico de Faturas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatura</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22/05/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 199,90</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Pago
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                      <a href="#" className="hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 199,90</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Pago
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                      <a href="#" className="hover:underline">Download</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22/03/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 199,90</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Pago
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                      <a href="#" className="hover:underline">Download</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Método de Pagamento</h2>
            <div className="border rounded-md p-4 mb-4 flex items-center">
              <div className="h-10 w-16 bg-gray-200 rounded-md mr-4"></div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-gray-600 text-sm">Expira em 12/2026</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
              Atualizar Cartão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;