import React from 'react';
import { Conversation } from '../../data/inbox';
import { ConversationCard } from './ConversationCard';
import { MessageSquare } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
}) => {
  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 space-y-2">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-slate-400">No conversations found</p>
          <p className="text-[11px] font-medium text-slate-300">Try adjusting your search query or filter chip</p>
        </div>
      ) : (
        conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            conversation={conv}
            isSelected={selectedId === conv.id}
            onSelect={() => onSelectConversation(conv.id)}
          />
        ))
      )}
    </div>
  );
};

export default ConversationList;
