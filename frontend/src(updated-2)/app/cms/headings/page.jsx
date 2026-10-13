'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

export default function ManageSectionHeadingsPage() {
  const [headings, setHeadings] = useState({
    whyChooseUsTitle: '',
    whyChooseUsSubtitle: '',
    wayWeWorkTitle: '',
    wayWeWorkSubtitle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/cms-headings`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.headings) setHeadings(data.headings);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to load headings.');
        setLoading(false);
      });
  }, []);

  const handleChange = (key, value) => {
    setHeadings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/cms-headings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headings }),
      });

      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      setMessage(data.message || 'Headings updated successfully!');
    } catch (err) {
      setMessage('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading section headings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Section Headings</h1>
          <p className="text-sm text-gray-500">Update &quot;Why Choose Us&quot; and &quot;The Way We Work&quot; headings across your website.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium shadow transition-colors disabled:opacity-50"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Why Choose Us Section Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Why Choose Us Section</h2>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Section Title</label>
            <input
              type="text"
              value={headings.whyChooseUsTitle || ''}
              onChange={(e) => handleChange('whyChooseUsTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Section Subtitle / Description</label>
            <textarea
              value={headings.whyChooseUsSubtitle || ''}
              onChange={(e) => handleChange('whyChooseUsSubtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* The Way We Work Section Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">The Way We Work Section</h2>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Section Title</label>
            <input
              type="text"
              value={headings.wayWeWorkTitle || ''}
              onChange={(e) => handleChange('wayWeWorkTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Section Subtitle / Description</label>
            <textarea
              value={headings.wayWeWorkSubtitle || ''}
              onChange={(e) => handleChange('wayWeWorkSubtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}