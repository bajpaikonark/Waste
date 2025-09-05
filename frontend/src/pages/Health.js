import React, { useState } from 'react';
import Layout from '../components/Layout';

const Health = ({ onReportClick }) => {
  const [activeScreen, setActiveScreen] = useState('main');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [emergencyDescription, setEmergencyDescription] = useState('');

  const symptomsList = [
    'Fever',
    'Headache',
    'Cold & Cough',
    'Body Ache',
    'Gas & Acidity',
    'Vomiting',
    'Dizziness'
  ];

  const healthCenters = [
    {
      name: 'Ursula Horsman Memorial Hospital',
      type: 'Govt. Hospital',
      distance: '2.5 km',
      phone: '0512-2305731',
      rating: 4.2,
      waitTime: '15 min'
    },
    {
      name: 'KPM Hospital',
      type: 'Govt. Hospital',
      distance: '3.1 km',
      phone: '0512-2540277',
      rating: 4.5,
      waitTime: '10 min'
    }
  ];

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmitRequest = () => {
    alert(`Your request with symptoms: ${selectedSymptoms.join(', ')} has been sent to nearby pharmacies.`);
    setActiveScreen('main');
    setSelectedSymptoms([]);
  };

  const handleSendEmergencyAlert = () => {
    alert('Emergency alert sent! Help is on the way.');
    setActiveScreen('main');
    setEmergencyDescription('');
  };

  return (
    // Passing props to Layout so its navbar can use them. If Layout doesn't support them yet,
    // see the fallback BottomNav below.
    <Layout onReportClick={onReportClick} activeTab="health">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Health Assistance</h1>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <p className="text-green-100">Find facilities or request emergency help</p>

          {/* Status */}
          <div className="flex items-center mt-4 bg-white/10 rounded-full px-3 py-1 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            <span>Services available in your area</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* MAIN */}
          {activeScreen === 'main' && (
            <div>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 cursor-pointer transition-all hover:shadow-lg hover:border-green-100"
                  onClick={() => setActiveScreen('emergency')}
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M4.93 19a10 10 0 0114.14 0l-7.07-14L4.93 19z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">Emergency Help</h3>
                  <p className="text-xs text-gray-500 mt-1">Immediate assistance</p>
                </div>

                <div
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 cursor-pointer transition-all hover:shadow-lg hover:border-green-100"
                  onClick={() => setActiveScreen('general')}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">General Medicine</h3>
                  <p className="text-xs text-gray-500 mt-1">Pharmacy request</p>
                </div>
              </div>

              {/* Nearby Health Centers */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Nearby Health Centers</h2>
                  <span className="text-xs text-green-600">See all</span>
                </div>

                {healthCenters.map((center, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{center.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mr-2">{center.type}</span>
                          <div className="flex items-center text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {center.distance}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-green-600">{center.waitTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(center.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">{center.rating}</span>
                      </div>

                      <a href={`tel:${center.phone}`} className="flex items-center text-green-600 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1" />
                        </svg>
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GENERAL MEDICINE SCREEN */}
          {activeScreen === 'general' && (
            <div>
              <div className="flex items-center mb-5">
                <button onClick={() => setActiveScreen('main')} className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Request Medicine</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Select Your Symptoms</h3>
                <p className="text-gray-600 text-sm mb-4">Select your symptoms and we'll notify nearby pharmacies</p>

                <div className="grid grid-cols-2 gap-3">
                  {symptomsList.map((symptom, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-green-50 border-green-500'
                          : 'bg-gray-50 border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => toggleSymptom(symptom)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-300'
                      }`}>
                        {selectedSymptoms.includes(symptom) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-xl font-semibold mt-6 flex items-center justify-center ${
                  selectedSymptoms.length === 0
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                onClick={handleSubmitRequest}
                disabled={selectedSymptoms.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Request to Pharmacies
              </button>
            </div>
          )}

          {/* EMERGENCY */}
          {activeScreen === 'emergency' && (
            <div>
              <div className="flex items-center mb-5">
                <button onClick={() => setActiveScreen('main')} className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Emergency Assistance</h2>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19a10 10 0 0114.14 0l-7.07-14L4.93 19z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Emergency Alert</h3>
                    <p className="text-red-600 text-sm mt-1">Your location will be shared with emergency services</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Describe Your Emergency</h3>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl mb-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  rows="3"
                  placeholder="Please describe your symptoms or emergency situation..."
                  value={emergencyDescription}
                  onChange={(e) => setEmergencyDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500">This information will help responders prepare</p>
              </div>

              <button
                className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold mt-4 flex items-center justify-center hover:bg-red-600"
                onClick={handleSendEmergencyAlert}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M4.93 19a10 10 0 0114.14 0l-7.07-14L4.93 19z" />
                </svg>
                Send Emergency Alert
              </button>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-3">Nearest Emergency Center</h3>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{healthCenters[0].name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mr-2">{healthCenters[0].type}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {healthCenters[0].distance}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <a href={`tel:${healthCenters[0].phone}`} className="flex items-center text-green-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1" />
                      </svg>
                      Call directly
                    </a>

                    <button className="flex items-center text-red-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NOTE: bottom navbar removed here because Layout provides it */}
      </div>
    </Layout>
  );
};

export default Health;
