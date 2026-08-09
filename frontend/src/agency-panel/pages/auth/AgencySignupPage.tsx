import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Agency Signup / Registration Page
 * Route: /agency/signup
 */
export const AgencySignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ agencyName: '', email: '', phone: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with POST /api/agency/auth/register
    alert('Agency registration coming soon! A team member will contact you within 24 hours.');
    navigate('/agency/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-4 font-sans py-12">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => navigate('/agency')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#6356E5] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Agency Portal
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Register Your Agency</h1>
            <p className="text-xs font-medium text-slate-400">Join 500+ verified travel agencies on ApnaTrip</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Agency Name', name: 'agencyName', type: 'text', placeholder: 'e.g. Himalayan Explorers' },
              { label: 'Business Email', name: 'email', type: 'email', placeholder: 'agency@example.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
              { label: 'Create Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white font-extrabold text-sm shadow-md shadow-[#6356E5]/20 transition-all cursor-pointer"
            >
              Register Agency
            </button>
          </form>

          <p className="text-center text-xs font-medium text-slate-400">
            Already registered?{' '}
            <button
              onClick={() => navigate('/agency/login')}
              className="text-[#6356E5] font-bold cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgencySignupPage;
