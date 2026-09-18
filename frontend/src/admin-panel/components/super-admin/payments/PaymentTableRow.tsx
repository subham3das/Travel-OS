import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CreditCard,
  Smartphone,
  Landmark,
} from 'lucide-react';
import { AdminPaymentItem } from '../../../types/paymentManagement';

interface PaymentTableRowProps {
  payment: AdminPaymentItem;
  isSelected: boolean;
  isDrawerSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectPayment: (payment: AdminPaymentItem) => void;
  onRowAction: (actionType: string, payment: AdminPaymentItem) => void;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  isSelected,
  isDrawerSelected,
  onToggleSelect,
  onSelectPayment,
  onRowAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; openUpwards: boolean }>({
    top: 0,
    left: 0,
    openUpwards: false,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < 280 && rect.top > 280;
      const menuWidth = 192; // w-48 = 192px
      const left = Math.max(10, rect.right - menuWidth);
      const top = openUpwards ? rect.top - 6 : rect.bottom + 6;
      setMenuCoords({ top, left, openUpwards });
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      setIsMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const getStatusBadgeStyle = () => {
    switch (payment.paymentStatus) {
      case 'Success':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Failed':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-black';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
      case 'Refunded':
        return 'bg-purple-50 text-[#6356E5] border-purple-100 font-extrabold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-bold';
    }
  };

  const getSettlementBadgeStyle = () => {
    switch (payment.settlementStatus) {
      case 'Settled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-extrabold';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold';
      case '—':
      default:
        return 'text-slate-400 font-bold';
    }
  };

  const renderMethodIcon = () => {
    if (payment.paymentMethod.toLowerCase().includes('upi')) {
      return (
        <span className="flex items-center gap-1 font-bold text-slate-700">
          <span>UPI</span>
          <span className="text-[9px] px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-black">UPI</span>
        </span>
      );
    }
    if (payment.paymentMethod.toLowerCase().includes('card')) {
      return (
        <span className="flex items-center gap-1 font-bold text-slate-700">
          <span>Card</span>
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 font-bold text-slate-700">
        <span>Netbanking</span>
        <Landmark className="w-3.5 h-3.5 text-slate-400" />
      </span>
    );
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectPayment(payment)}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] cursor-pointer group select-none ${
        isDrawerSelected ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' : isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td
        className="py-3 pl-4 pr-2 w-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(payment.id);
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(payment.id)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
        />
      </td>

      {/* Transaction ID */}
      <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#6356E5] group-hover:underline whitespace-nowrap">
        {payment.transactionId}
      </td>

      {/* Booking ID */}
      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600 whitespace-nowrap">
        {payment.bookingId}
      </td>

      {/* Traveler (Avatar + Name + Email) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5 min-w-[150px]">
          <img
            src={payment.travelerAvatar}
            alt={payment.travelerName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate block">
              {payment.travelerName}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 truncate block">
              {payment.travelerEmail}
            </span>
          </div>
        </div>
      </td>

      {/* Agency (Logo + Name) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5 min-w-[130px]">
          <img
            src={payment.agencyLogo}
            alt={payment.agencyName}
            className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <span className="font-bold text-slate-700 truncate">{payment.agencyName}</span>
        </div>
      </td>

      {/* Package */}
      <td className="py-3 px-3 text-slate-700 font-bold truncate max-w-[140px]">
        {payment.packageName}
      </td>

      {/* Amount */}
      <td className="py-3 px-3 whitespace-nowrap font-black text-[#0F172A]">
        {payment.totalAmount}
      </td>

      {/* Platform Fee */}
      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-bold text-[11px]">
        {payment.platformFee}
      </td>

      {/* Gateway */}
      <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-700">
        {payment.gateway}
      </td>

      {/* Method */}
      <td className="py-3 px-3 whitespace-nowrap">
        {renderMethodIcon()}
      </td>

      {/* Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getStatusBadgeStyle()}`}
        >
          {payment.paymentStatus}
        </span>
      </td>

      {/* Settlement */}
      <td className="py-3 px-3 whitespace-nowrap">
        {payment.settlementStatus === '—' ? (
          <span className="text-slate-400 font-bold pl-2">—</span>
        ) : (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getSettlementBadgeStyle()}`}
          >
            {payment.settlementStatus}
          </span>
        )}
      </td>

      {/* Payment Date */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="text-slate-700 font-bold block text-[11px]">{payment.paymentDate}</span>
        <span className="text-[10px] font-semibold text-slate-400">{payment.paymentTime}</span>
      </td>

      {/* Actions */}
      <td
        className="py-3 pr-4 pl-2 text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={buttonRef}
          onClick={handleToggleMenu}
          className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="More Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isMenuOpen &&
          createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                left: `${menuCoords.left}px`,
                ...(menuCoords.openUpwards
                  ? { bottom: `${window.innerHeight - menuCoords.top}px` }
                  : { top: `${menuCoords.top}px` }),
                zIndex: 9999,
              }}
              className="w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 text-left select-none space-y-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view', payment);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('invoice', payment);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Invoice</span>
              </button>

              {payment.settlementStatus !== 'Settled' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('approve_settlement', payment);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Approve Settlement</span>
                </button>
              )}

              {payment.settlementStatus !== 'Failed' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('reject_settlement', payment);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reject Settlement</span>
                </button>
              )}

              {payment.paymentStatus !== 'Refunded' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('refund', payment);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Process Refund</span>
                </button>
              )}
            </div>,
            document.body
          )}
      </td>
    </motion.tr>
  );
};
