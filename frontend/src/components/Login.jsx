


import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OTPVerification from './OTPVerification';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState('input');
  const { loginWithPassword, loginWithOtp, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginWithPassword(email, password);
    if (!result.success) setError(result.error);
    else navigate('/');
    setLoading(false);
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await sendOtp(phone);
      if (!result.success) setError(result.error);
      else setOtpStep('verify');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (code) => {
    setError('');
    setLoading(true);
    try {
      const verificationResult = await verifyOtp(code);
      if (!verificationResult.success) setError(verificationResult.error);
      else {
        const result = await loginWithOtp(verificationResult.idToken);
        if (!result.success) {
          setError(result.error);
          setOtpStep('input');
        } else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    setError('');
    try {
      await sendOtp(phone);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (otpStep === 'verify') {
    return (
      <OTPVerification
        phoneNumber={phone}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        onCancel={() => setOtpStep('input')}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Welcome Back</h2>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {!otpStep || otpStep === 'input' ? (
          <>
            {/* Email/Password Login */}
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Phone/OTP Login */}
            <form onSubmit={handleOtpRequest} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Login with OTP'}
              </button>
            </form>
          </>
        ) : null}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-green-600 font-semibold hover:text-green-700 transition"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ onToggleMode, onClose }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { loginWithPassword } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await loginWithPassword(email, password);

//     if (!result.success) {
//       setError(result.error);
//     } else {
//       navigate('/');
//       if (onClose) onClose();
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>

//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-600">
//           Don't have an account?{' '}
//           <button onClick={onToggleMode} className="font-medium text-green-600 hover:text-green-500">
//             Sign up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;