import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      navigate(`/chat/${id}`, { replace: true });
    } else {
      navigate('/chats', { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center font-sans">
      <div className="w-8 h-8 rounded-full border-4 border-[#6356E5]/20 border-t-[#6356E5] animate-spin" />
    </div>
  );
};
export default ChatPage;
