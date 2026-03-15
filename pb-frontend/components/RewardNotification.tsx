import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardEvent {
  id: string;
  points: number;
  message: string;
}

const RewardNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<RewardEvent[]>([]);

  // Listen for custom "reward-earned" events
  useEffect(() => {
    const handleReward = (e: any) => {
      const newReward: RewardEvent = {
        id: Math.random().toString(36).substr(2, 9),
        points: e.detail.points,
        message: e.detail.message || 'Points Earned!'
      };
      
      setNotifications(prev => [...prev, newReward]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newReward.id));
      }, 5000);
    };

    window.addEventListener('reward-earned', handleReward);
    return () => window.removeEventListener('reward-earned', handleReward);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[200px] border border-white/10 pointer-events-auto overflow-hidden relative"
          >
            {/* Background Polish */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl -mr-12 -mt-12 rounded-full"></div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-secondary text-slate-900 rounded-full flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-secondary/20 animate-bounce">
                🪙
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none mb-1">PinoPoints Reward</p>
              <h4 className="text-lg font-black leading-none">+{notif.points} PTS</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[150px]">{notif.message}</p>
            </div>
            
            {/* Close Button or Timer Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-secondary w-full origin-left animate-timer"></div>
          </motion.div>
        ))}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes timer {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .animate-timer {
          animation: timer 5s linear forwards;
        }
      `}} />
    </div>
  );
};

export default RewardNotification;

// Helper function to trigger notification
export const triggerRewardNotification = (points: number, message: string) => {
  const event = new CustomEvent('reward-earned', { 
    detail: { points, message } 
  });
  window.dispatchEvent(event);
};
