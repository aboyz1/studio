'use client';

import { useEffect, useState } from 'react';
import WalletProvider from './wallet-provider';

export default function ClientWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <WalletProvider>{children}</WalletProvider>;
}
