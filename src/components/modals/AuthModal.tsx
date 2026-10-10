import React, { useState } from 'react';
import {
  X,
  Cloud,
  Lock,
  Mail,
  UserCheck,
  LogOut,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, syncLocalDataToCloud, addNotification } = useDSA();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syncingData, setSyncingData] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(
            data.session
              ? 'Account created and signed in successfully!'
              : 'Account registered! Please check your email to confirm.'
          );
          addNotification('Welcome to AlgoPulse Cloud', 'Account registered successfully.', 'success');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage('Signed in successfully! Replicating orbital telemetry...');
          addNotification('Cloud Connected', 'Signed in and synced with Supabase.', 'success');
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signOut();
      addNotification('Signed Out', 'Running in local storage mode.', 'info');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLocalToCloud = async () => {
    setSyncingData(true);
    try {
      await syncLocalDataToCloud();
      setSuccessMessage('Local questions and study history successfully backed up to Supabase Cloud!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync local data.');
    } finally {
      setSyncingData(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl max-w-md w-full p-6 border border-violet-500/30 shadow-glow-violet/30 overflow-hidden relative max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/10 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl gradient-violet text-white flex items-center justify-center shadow-glow-violet">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Supabase Cloud Command
              </h3>
              <p className="text-xs text-slate-400">
                Multi-device persistence & encrypted auth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* If Supabase is not configured yet */}
          {!isSupabaseConfigured ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 text-xs text-violet-300 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <AlertCircle size={15} className="text-violet-400" />
                  <span>Cloud Backend Setup Needed</span>
                </div>
                <p className="leading-relaxed">
                  The application is currently running in <strong>Local Storage Mode</strong>. All problems, timers, and notes are preserved in this browser.
                </p>
                <p className="leading-relaxed">
                  To sync across multiple computers or mobile devices:
                </p>
                <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px] text-violet-200">
                  <li>Create a free project at supabase.com</li>
                  <li>Run the schema from <code className="font-bold text-white">supabase/schema.sql</code></li>
                  <li>Add <code className="font-bold text-white">VITE_SUPABASE_URL</code> & <code className="font-bold text-white">VITE_SUPABASE_ANON_KEY</code></li>
                </ol>
              </div>

              <div className="p-3 bg-[#080918] rounded-2xl border border-violet-500/20 text-xs text-slate-400">
                <p className="font-semibold text-white mb-1">Row-Level Security (RLS) Ready</p>
                <p className="text-[11px] text-slate-400">
                  Strict RLS policies ensure each pilot can only access their authenticated telemetry records.
                </p>
              </div>
            </div>
          ) : currentUser ? (
            /* User is already logged in */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-3">
                <UserCheck size={24} className="text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-emerald-200">Cloud Sync Active</p>
                  <p className="text-emerald-300 truncate font-mono text-[11px]">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Sync local data button */}
              <div className="p-3.5 bg-[#080918] rounded-2xl border border-violet-500/20">
                <h4 className="font-bold text-xs text-white mb-1 flex items-center">
                  <UploadCloud size={14} className="mr-1.5 text-violet-400" />
                  Replicate Local Telemetry to Cloud
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  Upload all current problems, study logs, and settings from this browser to your cloud account.
                </p>
                <button
                  onClick={handleSyncLocalToCloud}
                  disabled={syncingData}
                  className="w-full py-2 px-3 rounded-xl gradient-violet hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-glow-violet flex items-center justify-center space-x-1.5"
                >
                  <Database size={13} />
                  <span>{syncingData ? 'Uploading...' : 'Upload & Replicate Telemetry'}</span>
                </button>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 size={14} />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 bg-rose-950/20 hover:bg-rose-900/40 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out (Switch to Local Mode)</span>
              </button>
            </div>
          ) : (
            /* User needs to sign in or sign up */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex rounded-xl bg-[#080918] p-1 text-xs font-bold border border-violet-500/20">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'signin' ? 'bg-violet-600 text-white shadow-glow-violet/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'signup' ? 'bg-violet-600 text-white shadow-glow-violet/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@station.space"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-[#080918] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Security Passphrase
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-[#080918] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center justify-center space-x-1.5 active:scale-95 transition-all mt-2 hover:opacity-95"
              >
                <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In to Station' : 'Create Flight Account'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-violet-500/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Row-Level Security isolates your personal space records.</span>
          <button
            onClick={onClose}
            className="font-bold text-violet-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
