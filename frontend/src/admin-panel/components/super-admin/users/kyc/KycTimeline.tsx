import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileUp,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  User,
  ScanText,
  ScanFace,
  Landmark,
  Cpu,
} from 'lucide-react';
import { KycTimelineItem } from '../../../../types/userKyc';

interface KycTimelineProps {
  timeline: KycTimelineItem[];
}

export const KycTimeline: React.FC<KycTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-100 text-center text-xs text-slate-400">
        No verification events recorded yet.
      </div>
    );
  }

  const getEventIcon = (action: string) => {
    const act = (action || '').toLowerCase();
    if (act.includes('ocr')) {
      return <ScanText className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (act.includes('forgery')) {
      return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (act.includes('face match') || act.includes('biometric')) {
      return <ScanFace className="w-3.5 h-3.5 text-indigo-500" />;
    }
    if (act.includes('government') || act.includes('validation')) {
      return <Landmark className="w-3.5 h-3.5 text-teal-600" />;
    }
    if (act.includes('approve')) {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (act.includes('reject')) {
      return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
    }
    if (act.includes('view') || act.includes('opened')) {
      return <Eye className="w-3.5 h-3.5 text-[#6356E5]" />;
    }
    if (act.includes('review')) {
      return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (act.includes('submit') || act.includes('upload')) {
      return <FileUp className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (act.includes('revoke')) {
      return <RotateCcw className="w-3.5 h-3.5 text-rose-500" />;
    }
    if (act.includes('renew')) {
      return <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (act.includes('suspend')) {
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
          Verification Timeline & Audit Trail
        </h4>
        <span className="text-[10px] font-bold text-slate-400">
          {timeline.length} stage{timeline.length === 1 ? '' : 's'} recorded
        </span>
      </div>

      <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {timeline.map((item, idx) => {
          const timestampFormatted = item.timestamp
            ? new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent';

          const isSystem = !item.admin || !item.admin.name;

          return (
            <div key={item.id || idx} className="relative space-y-1 group">
              {/* Timeline circle icon */}
              <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                {getEventIcon(item.action)}
              </div>

              {/* Action Title & Timestamp */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-black text-[#0F172A]">
                  {item.action}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                  {timestampFormatted}
                </span>
              </div>

              {/* Performed by tag */}
              <div className="flex items-center gap-1.5">
                {isSystem ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    <Cpu className="w-2.5 h-2.5 text-teal-600" />
                    <span>System Automated</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6356E5] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    <User className="w-2.5 h-2.5 text-[#6356E5]" />
                    <span>
                      {item.admin?.name} {item.admin?.role ? `(${item.admin.role})` : ''}
                    </span>
                  </span>
                )}
              </div>

              {/* Notes / Description */}
              {item.notes && (
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                  {item.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
