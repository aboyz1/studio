'use client';

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import {
    PhantomWalletAdapter
} from '@solana/wallet-adapter-phantom';
import {
    SolflareWalletAdapter
} from '@solana/wallet-adapter-solflare';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

const WalletProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    // The network can be set to 'mainnet-beta', 'honeynet', or 'sonic'.
    // Using Honeynet for development as per docs.
    const network = "https://rpc.test.honeycombprotocol.com";
    const endpoint = useMemo(() => network, [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
};

export default WalletProvider;
