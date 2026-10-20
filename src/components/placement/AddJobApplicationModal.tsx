import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building,
  Globe,
  Link,
  Calendar,
  UserCheck,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import {
  JobApplicationPlatform,
  ApplicationStatus,
} from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface AddJobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS: JobApplicationPlatform[] = [
  'LinkedIn',
  'Naukri',
  'Company Portal',
  'Wellfound',
  'Internshala',
  'Indeed',
  'Other',
];

const STATUSES: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Online Assessment',
  'Technical Interview',
  'HR Round',
  'Offered',
  'Rejected',
];

export const AddJobApplicationModal: React.FC<AddJobApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addJobApplication, applications } = usePlacement();
  const { theme } = useTheme();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [platform, setPlatform] = useState<JobApplicationPlatform>('LinkedIn');
  const [jobLink, setJobLink] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [referralContact, setReferralContact] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [notes, setNotes] = useState('');

  // Duplicate warning detection
  const isDuplicate = applications.some(
    (a) =>
      a.company.trim().toLowerCase() === company.trim().toLowerCase() &&
      a.role.trim().toLowerCase() === role.trim().toLowerCase() &&
      company.trim().length > 0 &&
      role.trim().length > 0
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    addJobApplication({
      company: company.trim(),
      role: role.trim(),
      platform,
      jobLink: jobLink.trim(),
      applicationDate: new Date().toISOString().slice(0, 10),
      status,
      referralContact: referralContact.trim() || undefined,
      location: location.trim() || undefined,
      salaryRange: salaryRange.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset & close
    setCompany('');
    setRole('');
    setJobLink('');
    setReferralContact('');
    setLocation('');
    setSalaryRange('');
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
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Quick-Add Job Application
              </h3>
              <p className="text-xs text-slate-400">
                Log today's job application toward your 10/day placement target.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Duplicate warning alert */}
          {isDuplicate && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center space-x-2.5">
              <AlertTriangle size={18} className="flex-shrink-0 text-amber-400" />
              <span>
                <strong>Potential Duplicate:</strong> You already applied for{' '}
                <strong>{role}</strong> at <strong>{company}</strong>. You can still submit if this is a different batch or team.
              </span>
            </div>
          )}

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Uber"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Role *
              </label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE-1, Software Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Platform & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Platform / Portal
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as JobApplicationPlatform)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-slate-900 text-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Link & Referral Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Posting Link
              </label>
              <div className="relative">
                <Link size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Referral Contact (Optional)
              </label>
              <div className="relative">
                <UserCheck size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe (Senior SWE)"
                  value={referralContact}
                  onChange={(e) => setReferralContact(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Salary / CTC (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 18-24 LPA"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes & Next Steps
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Applied with resume v4. Mentioned project link in cover letter."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Footer Submit */}
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
              <span>Log Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
