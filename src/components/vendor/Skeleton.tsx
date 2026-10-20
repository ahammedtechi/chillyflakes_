import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#EAE5DB]/70 rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
};
export default Skeleton;
