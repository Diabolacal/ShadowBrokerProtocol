import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DAppKitProvider } from '@mysten/dapp-kit-react';
import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

const dAppKit = createDAppKit({
  networks: ['testnet'] as const,
  createClient: (network) =>
    new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl(network), network }),
  defaultNetwork: 'testnet',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <App />
      </DAppKitProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
