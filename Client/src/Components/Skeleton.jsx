import React from "react";

const Skeleton = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F1] pt-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Skeleton */}
        <div className="relative h-[60vh] md:h-[75vh] w-full rounded-[3rem] bg-stone-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          <div className="absolute bottom-12 left-12 space-y-4 w-full">
            <div className="h-16 bg-stone-300 rounded-2xl w-2/3" />
            <div className="h-6 bg-stone-300 rounded-xl w-1/3" />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-stone-100">
              <div className="h-64 bg-stone-200 rounded-[2rem]" />
              <div className="h-8 bg-stone-200 rounded-xl w-3/4" />
              <div className="h-4 bg-stone-200 rounded-lg w-full" />
              <div className="h-12 bg-orange-100 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Skeleton;