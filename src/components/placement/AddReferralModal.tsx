import React, { useState } from 'react';
import {
  X,
  Users,
  Building,
  Link,
  Calendar,
  MessageSquare,
  Sparkles,
  Plus,
} from 'lucide-react';
import { ReferralResponseStatus } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface AddReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESPONSE_STATUSES: ReferralResponseStatus[] = [
  'Pending',
  'Connected',
  'Referral Submitted',
  'Declined',
  'No Response',
];

export const AddReferralModal: React.FC<AddReferralModalProps> = ({ isOpen, onClose }) => {
  const { addReferral } = usePlacement();
  const { theme } = useTheme();

  const [contactName, setContactName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [responseStatus, setResponseStatus] = useState<ReferralResponseStatus>('Pending');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4); // Default follow-up 4 days later
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !company.trim()) return;

    addReferral({
      contactName: contactName.trim(),
      company: company.trim(),
      role: role.trim() || 'Software Engineer',
      profileLink: profileLink.trim(),
      dateContacted: new Date().toISOString().slice(0, 10),
      responseStatus,
      followUpDate: followUpDate || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset & Close
    setContactName('');
    setCompany('');
    setRole('');
    setProfileLink('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transition-all relative overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-amber-500/40 text-slate-800'
            : 'bg-[#101228] border-violet-500/40 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Log Referral Outreach
              </h3>
              <p className="text-xs text-slate-400">
                Track professional outreach toward your weekly 5–7 referral goal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tip Banner */}
        <div className="mt-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 flex items-center space-x-2">
          <Sparkles size={16} className="text-violet-400 flex-shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Reach out to 2–3 engineers at each target company to maximize response rate!
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Contact Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company *
              </label>
              <div className="relative">
                <Building size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Uber, Amazon, Atlassian"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Contact Role & Profile Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact's Role
              </label>
              <input
                type="text"
                placeholder="e.g. Senior SWE, Tech Lead"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LinkedIn / Profile Link
              </label>
              <div className="relative">
                <Link size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Response Status & Follow-Up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Response Status
              </label>
              <select
                value={responseStatus}
                onChange={(e) => setResponseStatus(e.target.value as ReferralResponseStatus)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              >
                {RESPONSE_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Follow-Up Due Date
              </label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Outreach Message / Referral Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sent warm note mentioning common university background and interest in Cloud Systems."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-950/50 flex items-center space-x-1.5 transition-all"
            >
              <Plus size={16} />
              <span>Save Referral</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
