  // import React, { createContext, useContext, useState, useEffect } from 'react';
  // import axios from 'axios';
  // import { 
  //   getAuth, 
  //   signInWithPhoneNumber, 
  //   RecaptchaVerifier,
  //   signOut as firebaseSignOut,
  //   setPersistence,
  //   browserLocalPersistence
  // } from 'firebase/auth';
  // import { auth } from '../firebase';

  // const AuthContext = createContext();
  // export const useAuth = () => useContext(AuthContext);

  // const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

  // export const AuthProvider = ({ children }) => {
  //   const [currentUser, setCurrentUser] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [confirmationResult, setConfirmationResult] = useState(null);

  //   useEffect(() => {
  //     // Set persistence when component mounts
  //     setPersistence(auth, browserLocalPersistence)
  //       .then(() => {
  //         console.log("Persistence set to local");
  //       })
  //       .catch((error) => {
  //         console.error("Error setting persistence:", error);
  //       });

  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       axios.get(`${API_BASE}/auth/profile`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       })
  //       .then(res => setCurrentUser(res.data.user))
  //       .catch(() => {
  //         localStorage.removeItem('token');
  //         setCurrentUser(null);
  //       })
  //       .finally(() => setLoading(false));
  //     } else {
  //       setLoading(false);
  //     }
  //   }, []);

  //   // Improved phone number normalization
  //   const normalizePhone = (phone) => {
  //     let cleaned = phone.replace(/\D/g, '');
      
  //     // Always ensure +91 prefix for 10-digit Indian numbers
  //     if (cleaned.length === 10) {
  //       return '+91' + cleaned;
  //     }
      
  //     // Handle numbers that already have 91 prefix
  //     if (cleaned.length === 12 && cleaned.startsWith('91')) {
  //       return '+' + cleaned;
  //     }
      
  //     // Return as is if already in proper format
  //     if (phone.startsWith('+')) {
  //       return phone;
  //     }
      
  //     throw new Error('Invalid phone number format');
  //   };

  //   // Setup reCAPTCHA
  //   const setupRecaptcha = () => {
  //     try {
  //       // Clear any existing recaptcha
  //       const container = document.getElementById('recaptcha-container');
  //       if (container) container.innerHTML = '';
        
  //       // Create a new recaptcha verifier
  //       return new RecaptchaVerifier(
  //         auth,
  //         'recaptcha-container',
  //         {
  //           size: 'invisible',
  //           callback: () => console.log('reCAPTCHA solved'),
  //           'expired-callback': () => console.log('reCAPTCHA expired'),
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error setting up recaptcha:", error);
  //       throw error;
  //     }
  //   };

  //   const sendOtp = async (phoneNumber) => {
  //     try {
  //       // Normalize phone number
  //       const normalizedPhone = normalizePhone(phoneNumber);
  //       console.log('Sending OTP to:', normalizedPhone);
        
  //       // Setup recaptcha
  //       const appVerifier = setupRecaptcha();
        
  //       const result = await signInWithPhoneNumber(
  //         auth, 
  //         normalizedPhone, 
  //         appVerifier
  //       );
        
  //       setConfirmationResult(result);
  //       return { success: true };
  //     } catch (error) {
  //       console.error('Error sending OTP:', error);
        
  //       // Handle specific error cases
  //       let errorMessage = 'Failed to send OTP. Please try again.';
        
  //       if (error.message === 'Invalid phone number format') {
  //         errorMessage = 'Please enter a valid 10-digit Indian phone number.';
  //       } else if (error.code === 'auth/invalid-phone-number') {
  //         errorMessage = 'Invalid phone number format. Please use a valid Indian phone number.';
  //       } else if (error.code === 'auth/quota-exceeded') {
  //         errorMessage = 'SMS quota exceeded. Please try again later.';
  //       } else if (error.code === 'auth/operation-not-allowed') {
  //         errorMessage = 'Phone authentication is not enabled. Please contact support.';
  //       } else if (error.code === 'auth/too-many-requests') {
  //         errorMessage = 'Too many requests. Please try again later.';
  //       } else if (error.code === 'auth/captcha-check-failed') {
  //         errorMessage = 'reCAPTCHA verification failed. Please try again.';
  //       } else if (error.code === 'auth/app-not-authorized') {
  //         errorMessage = 'App is not authorized to use Firebase Authentication.';
  //       }
        
  //       return { 
  //         success: false, 
  //         error: errorMessage,
  //         code: error.code 
  //       };
  //     }
  //   };

  //   const verifyOtp = async (code) => {
  //     try {
  //       if (!confirmationResult) {
  //         return { success: false, error: 'No OTP verification in progress' };
  //       }
        
  //       const result = await confirmationResult.confirm(code);
  //       const idToken = await result.user.getIdToken();
        
  //       return { 
  //         success: true, 
  //         idToken,
  //         user: result.user
  //       };
  //     } catch (error) {
  //       console.error('Error verifying OTP:', error);
        
  //       let errorMessage = 'Invalid OTP code. Please try again.';
        
  //       if (error.code === 'auth/invalid-verification-code') {
  //         errorMessage = 'Invalid verification code. Please check the code and try again.';
  //       } else if (error.code === 'auth/session-expired') {
  //         errorMessage = 'Session expired. Please request a new OTP.';
  //       }
        
  //       return { 
  //         success: false, 
  //         error: errorMessage,
  //         code: error.code 
  //       };
  //     }
  //   };
  //   const apiRequest = async (method, endpoint, data = null) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const config = {
  //       method,
  //       url: `${API_BASE}${endpoint}`,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...(token && { Authorization: `Bearer ${token}` })
  //       },
  //       ...(data && { data })
  //     };

  //     const response = await axios(config);
  //     return response;
  //   } catch (error) {
  //     if (error.response?.status === 0 || error.code === 'NETWORK_ERROR') {
  //       throw new Error('Cannot connect to server. Please check your connection.');
  //     }
  //     throw error;
  //   }
  // };

  //   // loginWithPassword function
  //   const loginWithPassword = async (email, password) => {
  //   try {
  //     const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
  //     if (res.data.token) {
  //       localStorage.setItem('token', res.data.token);
  //       setCurrentUser(res.data.user);
  //       return { success: true, user: res.data.user };
  //     }
  //     return { success: false, error: res.data.message || 'Login failed' };
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     return { 
  //       success: false, 
  //       error: err.response?.data?.message || err.message || 'Login failed' 
  //     };
  //   }
  // };

  //   // loginWithOtp function
  //   const loginWithOtp = async (idToken) => {
  //     try {
  //       const res = await axios.post(`${API_BASE}/auth/login-otp`, { idToken });
  //       if (res.data.token) {
  //         localStorage.setItem('token', res.data.token);
  //         setCurrentUser(res.data.user);
  //         return { success: true, user: res.data.user };
  //       }
  //       return { success: false, error: res.data.message || 'OTP login failed' };
  //     } catch (err) {
  //       console.error('OTP login error:', err);
  //       return { success: false, error: err.response?.data?.message || 'OTP login failed' };
  //     }
  //   };

  //   // signup function
  //   const signup = async (userData, idToken) => {
  //     try {
  //       const res = await axios.post(`${API_BASE}/auth/signup`, { ...userData, idToken });
  //       if (res.data.token) {
  //         localStorage.setItem('token', res.data.token);
  //         setCurrentUser(res.data.user);
  //         return { success: true, user: res.data.user };
  //       }
  //       return { success: false, error: res.data.message || 'Signup failed' };
  //     } catch (err) {
  //       console.error('Signup error:', err);
  //       return { success: false, error: err.response?.data?.message || 'Signup failed' };
  //     }
  //   };

  //   // logout function
  //   const logout = () => {
  //     localStorage.removeItem('token');
  //     setCurrentUser(null);
  //     firebaseSignOut(auth);
  //   };

  //   return (
  //     <AuthContext.Provider value={{
  //       currentUser,
  //       signup,
  //       loginWithPassword,
  //       loginWithOtp,
  //       sendOtp,
  //       verifyOtp,
  //       logout,
  //       loading
  //     }}>
  //       {children}
  //       <div id="recaptcha-container" style={{ display: 'none' }}></div>
  //     </AuthContext.Provider>
  //   );
  // };

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   signInWithPhoneNumber, 
//   RecaptchaVerifier,
//   signOut as firebaseSignOut,
//   setPersistence,
//   browserLocalPersistence
// } from 'firebase/auth';
// import { auth } from '../firebase';

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// const API_BASE = "http://localhost:8000";

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   useEffect(() => {
//     setPersistence(auth, browserLocalPersistence).catch(err => {
//       console.error("Persistence error:", err);
//     });

//     const token = localStorage.getItem("token");
//     if (token) {
//       axios.get(`${API_BASE}/api/auth/profile`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => setCurrentUser(res.data.user))
//       .catch(() => {
//         localStorage.removeItem("token");
//         setCurrentUser(null);
//       })
//       .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const normalizePhone = (phone) => {
//     let cleaned = phone.replace(/\D/g, '');
//     if (cleaned.length === 10) return '+91' + cleaned;
//     if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned;
//     if (phone.startsWith('+')) return phone;
//     throw new Error('Invalid phone number format');
//   };

//   const setupRecaptcha = () => {
//     const container = document.getElementById("recaptcha-container");
//     if (container) container.innerHTML = "";
//     return new RecaptchaVerifier(auth, "recaptcha-container", {
//       size: "invisible",
//     });
//   };

//   const sendOtp = async (phoneNumber) => {
//     try {
//       const normalized = normalizePhone(phoneNumber);
//       const verifier = setupRecaptcha();
//       const result = await signInWithPhoneNumber(auth, normalized, verifier);
//       setConfirmationResult(result);
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   };

//   const verifyOtp = async (code) => {
//     try {
//       if (!confirmationResult) {
//         return { success: false, error: "No OTP request in progress" };
//       }
//       const result = await confirmationResult.confirm(code);
//       const idToken = await result.user.getIdToken();
//       return { success: true, idToken, user: result.user };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   };

//   const loginWithPassword = async (email, password) => {
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         setCurrentUser(res.data.user);
//         return { success: true, user: res.data.user };
//       }
//       return { success: false, error: res.data.message || "Login failed" };
//     } catch (err) {
//       return { success: false, error: err.response?.data?.message || "Login failed" };
//     }
//   };

//   const loginWithOtp = async (idToken) => {
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/login-otp`, { idToken });
//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         setCurrentUser(res.data.user);
//         return { success: true, user: res.data.user };
//       }
//       return { success: false, error: res.data.message || "OTP login failed" };
//     } catch (err) {
//       return { success: false, error: err.response?.data?.message || "OTP login failed" };
//     }
//   };

//   const signup = async (userData, idToken) => {
//     try {
//       // ✅ Fixed: send idToken inside body
//       const res = await axios.post(`${API_BASE}/api/auth/signup`, {
//         ...userData,
//         idToken
//       });
//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         setCurrentUser(res.data.user);
//         return { success: true, user: res.data.user };
//       }
//       return { success: false, error: res.data.message || "Signup failed" };
//     } catch (err) {
//       return { success: false, error: err.response?.data?.message || "Signup failed" };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setCurrentUser(null);
//     firebaseSignOut(auth);
//   };

//   return (
//     <AuthContext.Provider value={{
//       currentUser,
//       signup,
//       loginWithPassword,
//       loginWithOtp,
//       sendOtp,
//       verifyOtp,
//       logout,
//       loading
//     }}>
//       {children}
//       <div id="recaptcha-container" style={{ display: "none" }}></div>
//     </AuthContext.Provider>
//   );
// };





  import React, { createContext, useContext, useState, useEffect } from 'react';
  import axios from 'axios';
  import { 
    getAuth, 
    signInWithPhoneNumber, 
    RecaptchaVerifier,
    signOut as firebaseSignOut,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from '../firebase';

  const AuthContext = createContext();
  export const useAuth = () => useContext(AuthContext);

  const API_BASE = "http://localhost:8000/api";

  export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState(null);
   // const[authloading, setAuthloading]= useState(true)
    // Sync with Firebase + backend
    useEffect(() => {
      setPersistence(auth, browserLocalPersistence).catch((error) =>
        console.error("Error setting persistence:", error)
      );

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Always get a fresh Firebase ID token
            const idToken = await firebaseUser.getIdToken(true);

            // Try backend login/refresh with that token
            const res = await axios.post(`${API_BASE}/auth/login-otp`, { idToken });

            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
              setCurrentUser(res.data.user);
            } else {
              setCurrentUser(null);
              localStorage.removeItem("token");
            }
          } catch (err) {
            console.error("Error refreshing backend session:", err);
            setCurrentUser(null);
            localStorage.removeItem("token");
          }
        } else {
          // No Firebase session
          setCurrentUser(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    // Normalize Indian phone numbers
    const normalizePhone = (phone) => {
      let cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) return '+91' + cleaned;
      if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned;
      if (phone.startsWith('+')) return phone;
      throw new Error('Invalid phone number format');
    };

    const setupRecaptcha = () => {
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';
      return new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
        'expired-callback': () => console.log('reCAPTCHA expired'),
      });
    };

    const sendOtp = async (phoneNumber) => {
      try {
        const normalizedPhone = normalizePhone(phoneNumber);
        const appVerifier = setupRecaptcha();
        const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
        setConfirmationResult(result);
        return { success: true };
      } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error.message };
      }
    };

    const verifyOtp = async (code) => {
      try {
        if (!confirmationResult) {
          return { success: false, error: 'No OTP verification in progress' };
        }
        const result = await confirmationResult.confirm(code);
        const idToken = await result.user.getIdToken();
        return { success: true, idToken, user: result.user };
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, error: error.message };
      }
    };

    const loginWithPassword = async (email, password) => {
      try {
        const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          setCurrentUser(res.data.user);
          return { success: true, user: res.data.user };
        }
        return { success: false, error: res.data.message || 'Login failed' };
      } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: err.response?.data?.message || 'Login failed' };
      }
    };

    const loginWithOtp = async (idToken) => {
      try {
        const res = await axios.post(`${API_BASE}/auth/login-otp`, { idToken });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          setCurrentUser(res.data.user);
          return { success: true, user: res.data.user };
        }
        return { success: false, error: res.data.message || 'OTP login failed' };
      } catch (err) {
        console.error('OTP login error:', err);
        return { success: false, error: err.response?.data?.message || 'OTP login failed' };
      }
    };

    const signup = async (userData, idToken) => {
      try {
        const res = await axios.post(`${API_BASE}/auth/signup`, { ...userData, idToken });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          setCurrentUser(res.data.user);
          return { success: true, user: res.data.user };
        }
        return { success: false, error: res.data.message || 'Signup failed' };
      } catch (err) {
        console.error('Signup error:', err);
        return { success: false, error: err.response?.data?.message || 'Signup failed' };
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      setCurrentUser(null);
      firebaseSignOut(auth);
    };

    return (
      <AuthContext.Provider value={{
        currentUser,
        signup,
        loginWithPassword,
        loginWithOtp,
        sendOtp,
        verifyOtp,
        logout,
        loading
      }}>
        {children}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </AuthContext.Provider>
    );
  };









  // import React, { createContext, useContext, useState, useEffect } from 'react';
  // import axios from 'axios';

  // const AuthContext = createContext();
  // export const useAuth = () => useContext(AuthContext);

  // const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

  // export const AuthProvider = ({ children }) => {
  //   const [currentUser, setCurrentUser] = useState(null);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       axios.get(`${API_BASE}/auth/profile`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       })
  //       .then(res => setCurrentUser(res.data.user))
  //       .catch(() => {
  //         localStorage.removeItem('token');
  //         setCurrentUser(null);
  //       })
  //       .finally(() => setLoading(false));
  //     } else {
  //       setLoading(false);
  //     }
  //   }, []);

  //   const loginWithPassword = async (email, password) => {
  //     try {
  //       const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  //       if (res.data.token) {
  //         localStorage.setItem('token', res.data.token);
  //         setCurrentUser(res.data.user);
  //         return { success: true, user: res.data.user };
  //       }
  //       return { success: false, error: res.data.message || 'Login failed' };
  //     } catch (err) {
  //       console.error('Login error:', err);
  //       return { success: false, error: err.response?.data?.message || 'Login failed' };
  //     }
  //   };

  //   const signup = async (userData) => {
  //     try {
  //       const res = await axios.post(`${API_BASE}/auth/signup`, userData);
  //       if (res.data.token) {
  //         localStorage.setItem('token', res.data.token);
  //         setCurrentUser(res.data.user);
  //         return { success: true, user: res.data.user };
  //       }
  //       return { success: false, error: res.data.message || 'Signup failed' };
  //     } catch (err) {
  //       console.error('Signup error:', err);
  //       return { success: false, error: err.response?.data?.message || 'Signup failed' };
  //     }
  //   };

  //   const logout = () => {
  //     localStorage.removeItem('token');
  //     setCurrentUser(null);
  //   };

  //   return (
  //     <AuthContext.Provider value={{
  //       currentUser,
  //       signup,
  //       loginWithPassword,
  //       logout,
  //       loading
  //     }}>
  //       {children}
  //     </AuthContext.Provider>
  //   );
  // };
