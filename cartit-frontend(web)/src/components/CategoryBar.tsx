import React from 'react';
import { MOCK_CATEGORIES } from '../data/mockData';

import { Category } from '../types';

interface CategoryBarProps {
  categories?: Category[];
  selectedCategory?: string;
  selectedCategoryId?: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories = MOCK_CATEGORIES,
  selectedCategory,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const activeId = selectedCategory || selectedCategoryId || 'all';
  return (
    <div className="bg-white border-b border-[#e0e4da] py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map(cat => {
            const isSelected = activeId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0d631b] text-white shadow-md scale-102'
                    : 'bg-[#f7fbf0] text-[#40493d] hover:bg-[#e6f4e8] hover:text-[#0d631b] border border-[#e0e4da]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/50"
                />
                <span>{cat.name}</span>
                {cat.id !== 'all' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      isSelected
                        ? 'bg-[#2e7d32] text-[#cbffc2]'
                        : 'bg-[#ebefe5] text-[#707a6c]'
                    }`}
                  >
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
