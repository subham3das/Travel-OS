import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, CheckCircle2, FileText } from 'lucide-react';

interface DocumentSummaryProps {
  packageId: string;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ packageId }) => {
  const navigate = useNavigate();

  const docs = [
    { title: 'Aadhaar Card', status: 'Uploaded', icon: <FileText className="w-4 h-4 text-[#6356E5]" /> },
    { title: 'Passport', status: 'Uploaded', icon: <FileText className="w-4 h-4 text-sky-600" /> },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Documents
        </h2>
        <button
          onClick={() => navigate(`/booking/traveler-details/${packageId}`)}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {docs.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {doc.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{doc.title}</h3>
                <p className="text-[11px] font-semibold text-emerald-600">{doc.status}</p>
              </div>
            </div>

            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
