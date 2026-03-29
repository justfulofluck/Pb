
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
  return null;
};

export default Breadcrumbs;
