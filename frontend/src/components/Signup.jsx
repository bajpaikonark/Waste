import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OTPVerification from './OTPVerification';
import { useNavigate } from "react-router-dom";
const Signup = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [step, setStep] = useState('form'); // form -> otp -> complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idToken, setIdToken] = useState(null);

  const { signup, sendOtp, verifyOtp } = useAuth();
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits for phone input
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
    if (phone.startsWith('+')) return phone;
    return `+${cleaned}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const normalizedPhone = normalizePhone(formData.phone);
      const otpResult = await sendOtp(normalizedPhone);

      if (!otpResult.success) {
        setError(otpResult.error || 'Failed to send OTP');
        return;
      }

      setFormData(prev => ({ ...prev, phone: normalizedPhone }));
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (code) => {
    setError('');
    try {
      setLoading(true);
      const verifyResult = await verifyOtp(code);
      if (!verifyResult.success) {
        setError(verifyResult.error || 'OTP verification failed');
        return;
      }

      setIdToken(verifyResult.idToken);
      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      const signupResult = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address
      }, verifyResult.idToken);

      if (!signupResult.success) {
        setError(signupResult.error || 'Signup failed');
        setStep('form');
      } else {
        setStep('complete');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    setError('');
    try {
      await sendOtp(formData.phone);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  const handleOtpCancel = () => {
    setStep('form');
    setError('');
  };

  if (step === 'otp') {
    return (
      <OTPVerification
        phoneNumber={formData.phone}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        onCancel={handleOtpCancel}
      />
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Signup Complete!</h2>
        <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
      {error && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone.replace('+91', '')}
            onChange={handleChange}
            placeholder="1234567890"
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
          {loading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{' '}
        <button onClick={() => navigate("/login")} className="text-green-600 hover:text-green-500 font-medium">Login</button>
      </p>
    </div>
  );
};

export default Signup;