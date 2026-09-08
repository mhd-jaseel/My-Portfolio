import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Trash2, Mail, Calendar, Loader2 } from 'lucide-react';
import { showConfirm, showSuccess, showError } from '../../utils/alertUtils';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      if (res.data?.data) {
        setMessages(res.data.data);
      }
    } catch (err) {
      showError(err, 'Unable to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id, senderName) => {
    const confirmed = await showConfirm({
      title: `Delete message from ${senderName || 'client'}?`,
      text: 'Are you sure you want to delete this message?',
      confirmText: 'Yes, Delete',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/messages/${id}`);
      showSuccess('Message deleted successfully.');
      fetchMessages();
    } catch (err) {
      showError(err, 'Unable to delete message.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Checking Messages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Client Messages
        </h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Messages received from visitors through the Contact page form.
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#dce7fa] space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dce7fa] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">{msg.name}</h3>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs text-[#1683FF] hover:underline flex items-center gap-1.5 mt-0.5 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{msg.email}</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-[11px] text-[#8a99ad] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleDelete(msg._id, msg.name)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {msg.subject && (
              <p className="text-xs font-bold text-[#1a1a1a]">
                Subject: {msg.subject}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[#333333] leading-relaxed whitespace-pre-line font-normal">
              {msg.message}
            </p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#dce7fa] text-[#666666] space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-[#8a99ad]" />
            <p className="text-sm font-semibold">No messages received yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMessagesPage;

