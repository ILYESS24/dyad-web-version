import React from 'react';
import { RorkLayout } from '@/components/rork-layout/RorkLayout';
import { Toaster } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <RorkLayout>
        {children}
      </RorkLayout>
      <Toaster />
    </>
  );
}