import React from 'react';
import { RorkHeader } from './RorkHeader';
import { RorkHero } from './RorkHero';
import { RorkAppBuilder } from './RorkAppBuilder';
import { RorkFooter } from './RorkFooter';

interface RorkLayoutProps {
  children?: React.ReactNode;
}

export function RorkLayout({ children }: RorkLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <RorkHeader />
      
      {/* Main Content */}
      <main>
        <RorkHero />
        <RorkAppBuilder />
        
        {/* Original app content if provided */}
        {children && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </section>
        )}
      </main>
      
      <RorkFooter />
    </div>
  );
}
