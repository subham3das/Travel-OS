import React from 'react';
import { motion } from 'framer-motion';
import { Info, Shield, FileText, HelpCircle, Headphones, ExternalLink } from 'lucide-react';
import { AboutData } from '../../../data/profile';

interface AboutCardProps {
  about: AboutData;
}

export const AboutCard: React.FC<AboutCardProps> = ({ about }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#583BE8]" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">About Travel OS</h3>
            <p className="text-[11px] font-semibold text-slate-400">System version, legal policies & agency technical support</p>
          </div>
        </div>
        <span className="text-xs font-black text-[#583BE8] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          {about.version}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-extrabold">
        <a
          href={about.privacyPolicyUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Privacy Policy</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <a
          href={about.termsUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Terms & Conditions</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <a
          href={about.helpCenterUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help Center</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <a
          href={`mailto:${about.supportContact}`}
          className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 text-[#583BE8] flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#583BE8]" />
            <span>Contact Support</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#583BE8]" />
        </a>
      </div>
    </motion.div>
  );
};

export default AboutCard;
