
import React from 'react';

export interface BreadcrumbStep {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  steps: BreadcrumbStep[];
  onHomeClick: () => void;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ steps, onHomeClick, className = "" }) => {
  return (
    <nav className={`flex items-center gap-2 text-slate-400 font-bold text-[13px] tracking-wide py-4 ${className}`} aria-label="Breadcrumb">
      <button 
        onClick={onHomeClick}
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Home"
      >
        <span className="material-symbols-outlined text-lg">home</span>
      </button>

      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
          {step.onClick && index < steps.length - 1 ? (
            <button 
              onClick={step.onClick}
              className="hover:text-primary transition-colors"
            >
              {step.label}
            </button>
          ) : (
            <span className={index === steps.length - 1 ? "text-slate-600 font-black" : ""}>
              {step.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
