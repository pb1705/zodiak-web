'use client';

import { useState } from 'react';
import ComingSoonModal from './ComingSoonModal';

interface AppDownloadButtonsProps {
  className?: string;
}

export default function AppDownloadButtons({ className = '' }: AppDownloadButtonsProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div className={`flex flex-col sm:flex-row gap-4 justify-center ${className}`}>
        <button 
          onClick={() => setShowComingSoon(true)}
          className="btn-trust px-12 py-4 text-sm tracking-widest uppercase"
        >
          App Store
        </button>
        <button 
          onClick={() => setShowComingSoon(true)}
          className="btn-minimal px-12 py-4 text-sm tracking-widest uppercase"
        >
          Google Play
        </button>
      </div>
      
      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)}
        title="Coming Soon"
        message="The Zodiak app will be available on iOS and Android soon. Stay tuned for updates!"
      />
    </>
  );
}
