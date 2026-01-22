'use client';

import { useState } from 'react';
import ComingSoonModal from './ComingSoonModal';

interface ComingSoonButtonProps {
  text: string;
  className?: string;
  message?: string;
}

export default function ComingSoonButton({ 
  text, 
  className = '',
  message = "This feature is coming soon. Stay tuned for updates!"
}: ComingSoonButtonProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowComingSoon(true)}
        className={className}
      >
        {text}
      </button>
      
      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)}
        title="Coming Soon"
        message={message}
      />
    </>
  );
}
