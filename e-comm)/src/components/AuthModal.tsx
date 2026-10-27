import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  redirectNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  redirectNotice,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regCountry, setRegCountry] = useState('Switzerland');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [managerPin, setManagerPin] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      setSuccessMessage(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (regRole === 'manager' && managerPin !== 'admin123' && managerPin !== 'admin') {
      setErrorMessage('Store Manager authorization code required (hint: admin123).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        phone: regPhone.trim(),
        shippingAddress: regAddress.trim(),
        city: regCity.trim(),
        postalCode: regPostalCode.trim(),
        country: regCountry.trim(),
      });

      setSuccessMessage(`Account created! Welcome to SERENO Genève, ${res.user.name}.`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (type: 'customer' | 'manager') => {
    if (type === 'customer') {
      setLoginEmail('alexander@sereno.ch');
      setLoginPassword('password123');
    } else {
      setLoginEmail('manager@sereno.ch');
      setLoginPassword('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e111a] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Header Banner */}
        <div className="bg-gradient-to-r from-[#141926] via-[#1a2030] to-[#141926] p-6 border-b border-[#232a3d] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1e2538] border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-wider text-white uppercase">
            SERENO Genève
          </h2>
          <p className="text-xs text-[#a3aabf] tracking-widest uppercase mt-0.5 font-mono">
            {mode === 'login' ? 'Collector & Manager Access' : 'Create Exclusive Member Account'}
          </p>

          {redirectNotice && (
            <div className="mt-3 p-2 bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#f3e3cb] rounded-lg text-xs flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
              <span>{redirectNotice}</span>
            </div>
          )}
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="flex border-b border-[#22283a] bg-[#121622]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'text-[#c5a880] border-b-2 border-[#c5a880] bg-[#171c2b]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'register'
                ? 'text-[#c5a880] border-b-2 border-[#c5a880] bg-[#171c2b]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. alexander@sereno.ch"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Password
                  </label>
                  <span className="text-[11px] text-[#c5a880]/80 hover:text-[#c5a880] cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#c5a880] to-[#b39366] hover:from-[#d1b58d] hover:to-[#be9f72] text-[#0b0c10] rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-[#c5a880]/10"
              >
                {loading ? 'Authenticating...' : 'Sign In to Account'}
              </button>

              {/* Quick 1-Click Demo Logins */}
              <div className="pt-4 mt-2 border-t border-[#23283a]">
                <p className="text-[11px] text-neutral-400 text-center mb-2 font-mono uppercase tracking-wider">
                  Instant One-Click Demo Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('customer')}
                    className="py-2 px-3 bg-[#171c2b] hover:bg-[#1f263b] border border-[#2a3248] text-[#c5a880] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Demo Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('manager')}
                    className="py-2 px-3 bg-[#171c2b] hover:bg-[#1f263b] border border-[#2a3248] text-amber-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Demo Manager</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Account Type Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Select Account Privilege / Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      regRole === 'customer'
                        ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#f5ebd7]'
                        : 'border-[#262c3e] bg-[#161a26] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Customer / Collector</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('manager')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      regRole === 'manager'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                        : 'border-[#262c3e] bg-[#161a26] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Store Manager</span>
                  </button>
                </div>
              </div>

              {regRole === 'manager' && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1.5">
                  <label className="block text-[11px] font-semibold text-amber-300">
                    Store Manager Authorization PIN (Use: admin123)
                  </label>
                  <input
                    type="password"
                    required
                    value={managerPin}
                    onChange={(e) => setManagerPin(e.target.value)}
                    placeholder="Enter PIN (admin123)"
                    className="w-full bg-[#161a26] border border-amber-700/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maximilian Ross"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. max@example.com"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {/* Password & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Password * (Min 4 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+41 22 819 4400"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {/* Shipping Address & City */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Default Delivery Address
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Street Address, Suite / Apartment"
                  className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Genève"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={regPostalCode}
                    onChange={(e) => setRegPostalCode(e.target.value)}
                    placeholder="1204"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    placeholder="Switzerland"
                    className="w-full bg-[#161a26] border border-[#2b3348] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-gradient-to-r from-[#c5a880] to-[#b39366] hover:from-[#d1b58d] hover:to-[#be9f72] text-[#0b0c10] rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-[#c5a880]/10"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
