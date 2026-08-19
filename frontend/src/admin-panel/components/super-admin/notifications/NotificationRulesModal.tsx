import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Shield, Zap, Check, Save } from 'lucide-react';

interface NotificationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: Array<{ id: string; name: string; enabled: boolean }>) => void;
}

export const NotificationRulesModal: React.FC<NotificationRulesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      name: 'Auto-Escalate Failed Payments > ₹20,000 to Finance Admin',
      description: 'Automatically elevate priority to High and dispatch email alert.',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Instant KYC Document Verification Queue',
      description: 'Route agency onboarding applications immediately to Compliance Lead.',
      enabled: true,
    },
    {
      id: 'rule-3',
      name: 'Abuse & Spam Review Immediate Take-down Alert',
      description: 'Flag reported reviews with > 2 flags for immediate moderation.',
      enabled: true,
    },
    {
      id: 'rule-4',
      name: 'Server CPU / Memory Threshold > 90% SLA Notification',
      description: 'Trigger DevOps pager when server resources breach limits for > 2m.',
      enabled: false,
    },
  ]);

  if (!isOpen) return null;

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSave = () => {
    onSave(rules);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100">
                <Sliders className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Notification Routing Rules</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Configure automated dispatch and SLA thresholds
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-black text-[#0F172A]">{rule.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{rule.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                    rule.enabled ? 'bg-[#6356E5]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      rule.enabled ? 'left-4' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Rules</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
