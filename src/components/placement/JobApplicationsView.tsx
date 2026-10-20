import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
  UserCheck,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, JobApplicationPlatform } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface JobApplicationsViewProps {
  onOpenAddModal: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Online Assessment',
  'Technical Interview',
  'HR Round',
  'Offered',
  'Rejected',
];

export const JobApplicationsView: React.FC<JobApplicationsViewProps> = ({
  onOpenAddModal,
}) => {
  const {
    applications,
    todayApplicationsCount,
    todayApplicationsTarget,
    updateJobApplication,
    deleteJobApplication,
  } = usePlacement();
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.referralContact && app.referralContact.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesPlatform = selectedPlatform === 'All' || app.platform === selectedPlatform;

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const percentComplete = Math.min(
    100,
    Math.round((todayApplicationsCount / todayApplicationsTarget) * 100)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Daily Target Progress Hero Banner */}
      <div className="p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
              Daily Application Sprint
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Final Year Placement Target
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {todayApplicationsCount} / {todayApplicationsTarget} Applications Submitted Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Maintain daily outbound volume across LinkedIn, Naukri, and verified company career portals.
          </p>
        </div>

        {/* Circular / Meter Progress Indicator */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-3xl font-black text-white">{percentComplete}%</span>
            <span className="text-xs text-slate-400 block font-medium">Daily Goal</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-950/60 flex items-center space-x-1.5 transition-all transform active:scale-98"
          >
            <Plus size={16} />
            <span>Quick-Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, role, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-xs text-white focus:outline-none focus:border-violet-400"
          >
            <option value="All">All Stages</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-white">
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-xs text-white focus:outline-none focus:border-violet-400"
          >
            <option value="All">All Portals</option>
            <option value="LinkedIn" className="bg-slate-900 text-white">LinkedIn</option>
            <option value="Naukri" className="bg-slate-900 text-white">Naukri</option>
            <option value="Company Portal" className="bg-slate-900 text-white">Company Portal</option>
            <option value="Wellfound" className="bg-slate-900 text-white">Wellfound</option>
            <option value="Internshala" className="bg-slate-900 text-white">Internshala</option>
            <option value="Other" className="bg-slate-900 text-white">Other</option>
          </select>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
            <Briefcase size={36} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No Applications Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your job applications to track status updates, OA invites, and interviews.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#101228]/80 hover:bg-[#131633] border border-violet-500/20 hover:border-violet-500/40 shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left details */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-300 font-extrabold flex items-center justify-center text-sm border border-violet-500/30 flex-shrink-0">
                    {app.company.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {app.company}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        • {app.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-medium">
                        {app.platform}
                      </span>
                      <span>Applied: {app.applicationDate}</span>
                      {app.location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin size={12} /> {app.location}
                        </span>
                      )}
                      {app.referralContact && (
                        <span className="flex items-center gap-0.5 text-teal-400">
                          <UserCheck size={12} /> Referral: {app.referralContact}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-400 italic pt-0.5">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-3 self-end sm:self-center flex-shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateJobApplication(app.id, {
                        status: e.target.value as ApplicationStatus,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-violet-950/70 border border-violet-500/30 text-xs font-semibold text-violet-300 focus:outline-none"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* External Job Link */}
                  {app.jobLink && (
                    <a
                      href={app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Open job posting"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteJobApplication(app.id)}
                    className="p-2 rounded-xl hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove application"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
