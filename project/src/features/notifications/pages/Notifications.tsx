import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

const Notifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { sendBroadcast, isSending } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      // Basic client validation
      return;
    }

    try {
      await sendBroadcast({ title, body });
      setTitle('');
      setBody('');
      // Toast handled by hook
    } catch (err) {
      // Toast handled by hook
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
        <p className="text-gray-500 mt-1">Send a push notification to all active Stylique app users.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Big Sale Today"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Up to 50% off on selected items. Shop now!"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {isSending ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
};

export default Notifications;
