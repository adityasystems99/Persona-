import React, { useState } from 'react';
import {
  Users,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Filter,
  MessageSquare,
} from 'lucide-react';
import { ReferralOutreach, ReferralResponseStatus } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface ReferralOutreachViewProps {
  onOpenAddModal: () => void;
}

const RESPONSE_STATUSES: ReferralResponseStatus[] = [
  'Pending',
  'Connected',
  'Referral Submitted',
  'Declined',
  'No Response',
];

export const ReferralOutreachView: React.FC<ReferralOutreachViewProps> = ({
  onOpenAddModal,
}) => {
  const {
    referrals,
    weeklyReferralsCount,
    weeklyReferralsTarget,
    followUpsDue,
    updateReferral,
    deleteReferral,
  } = usePlacement();
  const { theme } = useTheme();

  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Group referrals by company to encourage multi-contact outreach
  const companyGroups = referrals.reduce((acc, ref) => {
    const comp = ref.company.trim();
    if (!acc[comp]) acc[comp] = [];
    acc[comp].push(ref);
    return acc;
  }, {} as Record<string, ReferralOutreach[]>);

  const filteredReferrals = referrals.filter(
    (r) => filterStatus === 'All' || r.responseStatus === filterStatus
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weekly Referral Hero Banner */}
      <div className="p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white">
              Weekly Outreach Sprint
            </span>
            <span className="text-xs font-semibold text-slate-400">
              5–7 Referrals / Week
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {weeklyReferralsCount} / {weeklyReferralsTarget} Referrals Sent This Week
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Employee referrals boost your interview call rate by 4x–8x compared to cold online job boards.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-teal-950/60 flex items-center space-x-1.5 transition-all transform active:scale-98"
        >
          <Plus size={16} />
          <span>Log Referral Request</span>
        </button>
      </div>

      {/* Multi-Contact Outreach Recommendation Alert */}
      <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center space-x-3 text-xs text-violet-200">
        <Sparkles size={18} className="text-amber-400 flex-shrink-0" />
        <span>
          <strong>Strategy Tip:</strong> Always reach out to <strong>2–3 relevant people</strong> at each target company (e.g. 1 senior software engineer, 1 university alumni, and 1 engineering manager) to avoid single points of silence.
        </span>
      </div>

      {/* Follow-up Due Banner */}
      {followUpsDue.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-amber-400" />
            <span>
              <strong>{followUpsDue.length} Follow-ups due today:</strong>{' '}
              {followUpsDue.map((f) => `${f.contactName} at ${f.company}`).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Company Outreaches Grouped Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building size={16} className="text-violet-400" />
            <span>Target Company Outreach Networks ({Object.keys(companyGroups).length} Companies)</span>
          </h3>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/30 border border-violet-500/30 text-xs text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {RESPONSE_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(companyGroups).length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
            <Users size={36} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No Referrals Tracked Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Start adding alumni and engineers you contact on LinkedIn toward your 5–7 weekly target.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(companyGroups).map(([company, contacts]) => {
              const visibleContacts = contacts.filter(
                (c) => filterStatus === 'All' || c.responseStatus === filterStatus
              );
              if (visibleContacts.length === 0) return null;

              return (
                <div
                  key={company}
                  className="p-5 rounded-2xl bg-[#101228]/80 border border-violet-500/20 shadow-lg space-y-3"
                >
                  {/* Company Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-300 font-extrabold flex items-center justify-center text-xs border border-teal-500/30">
                        {company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{company}</h4>
                        <span className="text-[11px] text-slate-400">
                          {contacts.length} {contacts.length > 1 ? 'contacts reached' : 'contact reached'}{' '}
                          {contacts.length === 1 && '— recommend adding 1 more contact'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        contacts.length >= 2
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {contacts.length >= 2 ? 'Multi-Contact ✓' : 'Add 2nd Contact'}
                    </span>
                  </div>

                  {/* Contacts List for Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visibleContacts.map((ref) => {
                      const isFollowUpDue =
                        ref.followUpDate &&
                        ref.followUpDate <= new Date().toISOString().slice(0, 10) &&
                        ref.responseStatus === 'Pending';

                      return (
                        <div
                          key={ref.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isFollowUpDue
                              ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                              : 'bg-black/30 border-white/5 text-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-white text-xs">
                                  {ref.contactName}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  • {ref.role}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                Contacted: {ref.dateContacted}
                              </span>
                            </div>

                            {/* Status selector */}
                            <select
                              value={ref.responseStatus}
                              onChange={(e) =>
                                updateReferral(ref.id, {
                                  responseStatus: e.target.value as ReferralResponseStatus,
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-black/40 border border-violet-500/30 text-[11px] font-semibold text-teal-300 focus:outline-none"
                            >
                              {RESPONSE_STATUSES.map((s) => (
                                <option key={s} value={s} className="bg-slate-900 text-white">
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Follow-up date & Notes */}
                          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                            {ref.followUpDate ? (
                              <span
                                className={`flex items-center gap-1 ${
                                  isFollowUpDue ? 'text-amber-400 font-bold' : ''
                                }`}
                              >
                                <Calendar size={12} /> Follow-up: {ref.followUpDate}
                                {isFollowUpDue && ' (DUE)'}
                              </span>
                            ) : (
                              <span className="text-slate-500">No follow-up set</span>
                            )}

                            <div className="flex items-center space-x-1.5">
                              {ref.profileLink && (
                                <a
                                  href={ref.profileLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
                                  title="View LinkedIn Profile"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              )}
                              <button
                                onClick={() => deleteReferral(ref.id)}
                                className="p-1 rounded-md hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                                title="Delete referral"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {ref.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-1.5 line-clamp-2">
                              "{ref.notes}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
