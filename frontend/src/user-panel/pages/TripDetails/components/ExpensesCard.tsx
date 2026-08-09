import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface ExpensesCardProps {
  trip: Trip;
}

export const ExpensesCard: React.FC<ExpensesCardProps> = ({ trip }) => {
  const { expenses } = trip;

  return (
    <div
      onClick={() => alert(`Total Budget: ₹${expenses.totalBudget.toLocaleString('en-IN')}\nSpent: ₹${expenses.spent.toLocaleString('en-IN')}\nRemaining: ₹${expenses.remaining.toLocaleString('en-IN')}`)}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] truncate">Expenses Summary</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Circular Progress Badge */}
          <div className="relative w-11 h-11 rounded-full border-4 border-slate-100 flex items-center justify-center border-t-emerald-500 border-r-emerald-500">
            <span className="text-xs font-black text-[#0F172A]">{expenses.percentage}%</span>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Budget</p>
          <p className="text-xs sm:text-sm font-black text-[#0F172A]">₹{expenses.totalBudget.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spent</p>
          <p className="text-xs sm:text-sm font-black text-[#0F172A]">₹{expenses.spent.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining</p>
          <p className="text-xs sm:text-sm font-black text-[#0F172A]">₹{expenses.remaining.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};
