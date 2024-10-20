import React from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Message } from '@/model/User';



type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<{ message: string }>(`/api/delete-messages/${message._id}`);
            toast({ title: response.data.message });
            const messageId:any = message._id
            onMessageDelete(messageId);
        } catch (error) {
          console.log("Delete error", error);
            toast({ title: 'Error deleting message' });
        }
    };

    return (
      <div className="border border-gray-300 rounded-lg shadow-lg p-5 mb-4 bg-white transition-all hover:shadow-xl">
      <div className="flex justify-between items-start">
          <div className="flex-1">
              <p className="font-semibold text-gray-800 text-lg">{message.content}</p>
              <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
          <button 
              onClick={handleDeleteConfirm} 
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200">
              Delete
          </button>
      </div>
  </div>
    );
}

export default MessageCard;
