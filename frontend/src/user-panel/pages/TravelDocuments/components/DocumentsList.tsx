import React from 'react';
import { motion } from 'framer-motion';
import { TravelDocument } from '../../../data/documents';
import { DocumentCard } from './DocumentCard';

interface DocumentsListProps {
  documents: TravelDocument[];
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-black text-[#0F172A] tracking-tight">
        Your Documents
      </h2>

      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <DocumentCard document={doc} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
