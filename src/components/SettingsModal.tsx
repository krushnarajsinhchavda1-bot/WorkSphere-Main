// ============================================================
// SETTINGS MODAL
// A popup for editing the user's profile and notification settings.
// Has two tabs: "My Profile" and "Settings".
//
// The profile tab shows editable name and email fields.
// The settings tab has toggle switches for email and push notifications.
// This is a demo — changes are not actually saved anywhere.
// ============================================================

import { useState, useEffect } from 'react';
import { X, User, Mail, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SettingsModalProps {
  initialTab: 'profile' | 'settings';
  onClose: () => void;
}

function SettingsModal({ initialTab, onClose }: SettingsModalProps) {
  // Get the current user's session from the auth context.
  const { session } = useAuth();

  // Which tab is active: 'profile' or 'settings'.
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);

  // Profile form fields (pre-filled with current user info).
  const [name, setName] = useState(session?.name || '');
  const [email, setEmail] = useState(session?.email || '');

  // Notification toggle states (demo only).
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  // Close the modal when the Escape key is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Save button — just closes the modal (demo only).
  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    onClose();
  }

  return (
    // Dark overlay — clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Account Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-6 pt-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
              (activeTab === 'profile'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent')
            }
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
              (activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent')
            }
          >
            <Shield className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Tab content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {activeTab === 'profile' ? (
            <>
              {/* PROFILE TAB: editable name and email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              {/* Role is read-only */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <span className="inline-block px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium capitalize">
                  {session?.role || 'admin'}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* SETTINGS TAB: notification toggles */}
              <div className="space-y-3">
                {/* Email notifications toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive task updates via email</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={
                      'w-12 h-6 rounded-full transition-colors relative ' +
                      (emailNotifs ? 'bg-blue-600' : 'bg-slate-300')
                    }
                  >
                    <span className={'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ' + (emailNotifs ? 'left-6' : 'left-0.5')} />
                  </button>
                </div>

                {/* Push notifications toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Push Notifications</p>
                      <p className="text-xs text-slate-500">Get alerts in your browser</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={
                      'w-12 h-6 rounded-full transition-colors relative ' +
                      (pushNotifs ? 'bg-blue-600' : 'bg-slate-300')
                    }
                  >
                    <span className={'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ' + (pushNotifs ? 'left-6' : 'left-0.5')} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
