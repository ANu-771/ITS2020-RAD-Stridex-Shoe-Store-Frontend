import type { FC } from 'react';

export const ProductSkeleton: FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#DCEBE0] overflow-hidden animate-pulse flex flex-col justify-between">
      <div className="aspect-square w-full bg-[#E8F3EB]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 bg-[#E8F3EB] rounded w-1/3" />
          <div className="h-3 bg-[#E8F3EB] rounded w-1/4" />
        </div>
        <div className="h-5 bg-[#E8F3EB] rounded w-3/4" />
        <div className="h-3 bg-[#E8F3EB] rounded w-1/2" />
        <div className="pt-3 border-t border-[#DCEBE0] flex justify-between items-center">
          <div className="h-6 bg-[#E8F3EB] rounded w-1/3" />
          <div className="h-4 bg-[#E8F3EB] rounded w-8" />
        </div>
      </div>
    </div>
  );
};
