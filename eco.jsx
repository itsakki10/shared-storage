import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { Zap, Trophy, MapPin, User, CheckCircle, Camera, Leaf, Trash2, BookOpen, Download, TrendingUp } from 'lucide-react';


const __app_id = 'eco-platform-demo'; 
const __initial_auth_token = 'mock-auth-token'; 


const INITIAL_USER_STATE = {
    userId: 'mock-user-12345',
    username: 'EcoWarrior',
    totalPoints: 40,
    badges: [],
    missions: [
        { id: 'm1', name: 'Clean 5 Plastic Bottles', completed: false, location: null, reward: 30 },
        { id: 'm2', name: 'Identify 3 New Plants', completed: false, location: null, reward: 25 },
        { id: 'm3', name: 'Plant a Sapling', completed: false, location: null, reward: 50 },
    ],
    completedActions: [], 
};

const QUIZ_DATA = [
    { id: 1, question: "What is the primary gas causing the greenhouse effect?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen"], answer: "Carbon Dioxide" },
    { id: 2, question: "What is the cleanest source of energy?", options: ["Coal", "Solar Power", "Natural Gas"], answer: "Solar Power" },
    { id: 3, question: "What should you do with used batteries?", options: ["Throw in trash", "Recycle at special points", "Keep at home"], answer: "Recycle at special points" },
];

const POINTS_PER_CORRECT_ANSWER = 10;
const GREEN_STARTER_THRESHOLD = 50;


function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const apiKey = "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;


const analyzeImageWithGemini = async (base64Image, prompt) => {
    const [mimePart, dataPart] = base64Image.split(',');
    const mimeType = mimePart.match(/:(.*?);/)[1];

    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: dataPart
                        }
                    }
                ]
            }
        ],
        systemInstruction: {
            parts: [{ text: "You are an expert environmental assistant. Analyze the image and respond concisely and professionally, adhering strictly to the required JSON output structure." }]
        }
    };


    const MAX_RETRIES = 3;
    let lastError = null;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorBody)}`);
            }
            
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis failed to return text.";

        } catch (error) {
            lastError = error;
            if (attempt < MAX_RETRIES - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Gemini API call failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
};


const ActionButton = ({ onClick, children, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
        } ${className}`}
    >
        {children}
    </button>
);


const Navbar = ({ setPage }) => (
    <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md sticky top-0 z-20 mx-auto max-w-7xl border-b border-gray-100">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage('Dashboard')}>
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-black text-gray-800">Smart</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <NavItem pageName="Dashboard" setPage={setPage} text="Features" />
            <NavItem pageName="Missions" setPage={setPage} text="How It Works" />
            <NavItem pageName="Leaderboard" setPage={setPage} text="Impact" />
            <NavItem pageName="Dashboard" setPage={setPage} text="About" />
        </nav>
        <div className="flex items-center space-x-4">
            <button className="text-gray-600 font-semibold hidden sm:inline" onClick={() => alert('Sign In functionality pending.')}>Sign In</button>
            <button
                onClick={() => setPage('Dashboard')} // Link Join Now to Dashboard for simplicity
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-200"
            >
                Join Now
            </button>
        </div>
    </header>
);

const NavItem = ({ pageName, setPage, text }) => (
    <button
        onClick={() => setPage(pageName)}
        className="text-gray-600 hover:text-green-600 transition-colors duration-200"
    >
        {text}
    </button>
);



const QuizPage = ({ userState, setUserState, setPage }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [message, setMessage] = useState(null);
    const [showBadge, setShowBadge] = useState(false);

    const handleAnswer = (option) => {
        setSelectedAnswer(option);
        if (option === QUIZ_DATA[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < QUIZ_DATA.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            handleSubmitQuiz();
        }
    };

    const handleSubmitQuiz = () => {
        setQuizComplete(true);
        const pointsEarned = score * POINTS_PER_CORRECT_ANSWER;
        let badgeAwarded = false;
        
        setUserState(prev => {
            const newTotalPoints = prev.totalPoints + pointsEarned;
            const newBadges = [...prev.badges];

            if (newTotalPoints >= GREEN_STARTER_THRESHOLD && 
                !prev.badges.includes('Green Starter Badge')) {
                
                newBadges.push('Green Starter Badge');
                badgeAwarded = true;
            }

            return {
                ...prev,
                totalPoints: newTotalPoints,
                badges: newBadges
            };
        });

        setMessage(`Quiz complete! You scored ${score} out of ${QUIZ_DATA.length}. You earned ${pointsEarned} eco-points.`);
        if (badgeAwarded) {
            setShowBadge(true);
        }
    };

    const currentQ = QUIZ_DATA[currentQuestion];

    if (quizComplete) {
        return (
            <div className="p-8 bg-white rounded-xl shadow-2xl text-center max-w-xl mx-auto">
                <h3 className="text-3xl font-extrabold text-green-700 mb-4">Quiz Finished!</h3>
                <p className="text-xl text-gray-700 mb-6">{message}</p>
                <p className="text-2xl font-bold mb-8">
                    Your New Total Points: <span className="text-yellow-500">{userState.totalPoints}</span>
                </p>
                {showBadge && (
                    <div className="bg-yellow-100 p-6 rounded-lg border-2 border-yellow-500 animate-pulse">
                        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-yellow-700">BADGE EARNED!</p>
                        <p className="text-lg text-yellow-600">Green Starter Badge</p>
                    </div>
                )}
                <ActionButton onClick={() => setPage('Dashboard')} className="mt-8">
                    Back to Dashboard
                </ActionButton>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Question {currentQuestion + 1} of {QUIZ_DATA.length}</h3>
            <p className="text-xl text-gray-700 mb-8">{currentQ.question}</p>
            
            <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedAnswer === option
                                ? 'bg-green-100 border-green-500 text-green-700 font-semibold shadow-inner'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                        }`}
                        disabled={selectedAnswer !== null}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <ActionButton 
                onClick={nextQuestion} 
                disabled={selectedAnswer === null}
                className="mt-8 w-full"
            >
                {currentQuestion < QUIZ_DATA.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </ActionButton>
        </div>
    );
};



const InfoCard = ({ icon, title, description, color }) => (
    <div className={`p-5 rounded-xl shadow-lg border-t-4 ${color} bg-white transition-shadow duration-300 hover:shadow-xl`}>
        <div className={`flex items-center space-x-3 mb-2 text-${color.split('-')[1]}-600`}>
            {icon}
            <h4 className="text-xl font-bold text-gray-800">{title}</h4>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);


const SuggestionCard = ({ title, context, suggestion, benefit }) => (
    <div className="p-5 rounded-xl border-2 border-green-300 bg-green-50 shadow-md">
        <h4 className="text-xl font-extrabold text-green-800 mb-3">{title}</h4>
        
        <div className="space-y-3 text-gray-700">
            <div>
                <strong className="text-green-700">Context:</strong>
                <p className="text-sm">{context}</p>
            </div>
            <div>
                <strong className="text-green-700">Benefit:</strong>
                <p className="text-sm">{benefit}</p>
            </div>
            <div>
                <strong className="text-green-700">Suggestion:</strong>
                <p className="text-sm">{suggestion}</p>
            </div>
        </div>
    </div>
);


const ImageVerificationPage = ({ userState, setUserState, setPage }) => {
    
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null); 

    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = null;
        if (cameraInputRef.current) cameraInputRef.current.value = null;
    };


    const triggerCamera = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };


    const handleVerification = async () => {
        if (!imageSrc) return;

        setIsLoading(true);
        setResult(null);
        setError(null);

       
        const prompt = `Analyze this image. First, identify the most relevant eco-action object (must be one of: 'plant', 'dustbin', or 'bottle/plastic'). 
        If it is a plant, provide its potential common name. Then, generate a brief 'context', 'benefit', and 'suggestion' based on the identified object. 
        Return ONLY a single line JSON object with the following exact structure: 
        {"object": "[plant/dustbin/bottle/plastic/none]", 
        "name": "[common name if plant, or object name if dustbin/bottle, or 'none']", 
        "context": "[A short sentence describing the item's role in the ecosystem or waste management.]", 
        "benefit": "[A short sentence describing the positive impact of this item or action.]", 
        "suggestion": "[A short sentence with a practical suggestion for the user to do next.]"}`;
        
        try {
            const rawResponse = await analyzeImageWithGemini(imageSrc, prompt);
            
            
            let data = {};
            try {
                
                data = JSON.parse(rawResponse.trim().replace(/```json|```/g, ''));
            } catch (e) {
                console.error("Failed to parse AI response as JSON:", rawResponse);
                throw new Error("AI could not return a valid structured response. Please try again with a clearer image.");
            }

            const actionObject = data.object ? data.object.toLowerCase() : 'none';
            const name = data.name || 'Unknown';
            let pointsEarned = 0;
            let actionType = 'unverified';
            let verificationMessage = "Image uploaded, but could not be verified as a clear eco-action.";
            
            if (actionObject !== 'none' && actionObject !== 'unknown') {
                actionType = actionObject;
                
                if (actionObject === 'plant') {
                    pointsEarned = 35;
                    verificationMessage = `Verified: Plant Identification! Identified as ${name}.`;
                } else if (actionObject === 'dustbin' || actionObject === 'bottle/plastic') {
                    pointsEarned = 20;
                    verificationMessage = `Verified: Eco-Action! Identified as ${actionObject}.`;
                }
            }
            
            const finalResult = { 
                success: pointsEarned > 0, 
                message: verificationMessage, 
                points: pointsEarned, 
                name: name,
                context: data.context,
                benefit: data.benefit,
                suggestion: data.suggestion
            };

            
            if (pointsEarned > 0) {
                setUserState(prev => {
                    const newTotalPoints = prev.totalPoints + pointsEarned;
                    const newActions = [...prev.completedActions, { 
                        actionType, 
                        points: pointsEarned, 
                        date: new Date().toISOString(),
                        details: verificationMessage,
                        name: name
                    }];
                    return { ...prev, totalPoints: newTotalPoints, completedActions: newActions };
                });
            }

            setResult(finalResult);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setImageSrc(null); 
        }
    };

    const handleClear = () => {
        setImageSrc(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-4 text-center">AI Verification Hub</h3>
            <p className="text-gray-600 mb-6 text-center">Upload proof (plant, dustbin, or bottle) for points!</p>

            {/* NEW: Descriptive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InfoCard
                    icon={<Leaf className="w-6 h-6" />}
                    title="About Plant Identification"
                    description="Knowing the plants in your environment helps track local biodiversity and identify native or invasive species. Earn points by identifying new species!"
                    color="border-green"
                />
                <InfoCard
                    icon={<Trash2 className="w-6 h-6" />}
                    title="About Waste Verification"
                    description="Verifying proper disposal (dustbins) or cleanup efforts (bottles) encourages community responsibility and reduces local pollution. Every action counts!"
                    color="border-blue"
                />
            </div>
            {/* END NEW CARDS */}

            <div className="flex flex-col items-center space-y-4 mb-6 p-6 border border-gray-100 rounded-xl">
                
                
                {!imageSrc && (
                    <div className="w-full space-y-4">
                       
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            ref={cameraInputRef} 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <ActionButton onClick={triggerCamera} className="w-full">
                            <Camera className="w-5 h-5" /> <span>Open Camera</span>
                        </ActionButton>
                        
                        <div className="text-center text-gray-500">— OR —</div>
                        
                        {/* Standard File Upload */}
                        <label className="block w-full">
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </label>
                    </div>
                )}
                
                
                {imageSrc && (
                    <div className="w-full text-center p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">Image Preview</h4>
                        <img 
                            src={imageSrc} 
                            alt="Preview" 
                            className="max-w-full h-auto max-h-64 object-contain rounded-lg mx-auto" 
                        />
                        <div className="flex justify-center space-x-4 mt-4">
                            <ActionButton 
                                onClick={handleVerification} 
                                disabled={isLoading} 
                                className={isLoading ? 'bg-gray-500' : 'bg-green-600'}
                            >
                                {isLoading ? 'Verifying...' : <> <Zap className="w-5 h-5" /> Verify & Reward</>}
                            </ActionButton>
                            <button 
                                onClick={handleClear} 
                                className="py-2 px-6 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(isLoading || result || error) && (
                <div className="mt-6 p-4 rounded-lg border-2">
                    {isLoading && (
                        <div className="text-center text-blue-600">
                            <p className="font-semibold">AI is analyzing the image...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border-red-400 text-red-700 p-3">
                            <strong className="font-bold">Verification Failed:</strong> {error}
                        </div>
                    )}
                    {result && (
                        <>
                            <div className={`p-3 mb-4 ${result.success ? 'bg-green-100 border-green-400 text-green-700' : 'bg-yellow-100 border-yellow-400 text-yellow-700'}`}>
                                <p className="font-bold text-xl mb-1">{result.success ? '✅ Success!' : '⚠️ Unverified'}</p>
                                <p>{result.message}</p>
                                {result.points > 0 && (
                                    <p className="mt-2 font-bold text-lg">+{result.points} Eco-Points Earned!</p>
                                )}
                            </div>
                            
                            {/* NEW DETAILED SUGGESTION CARD */}
                            {result.context && (
                                <SuggestionCard 
                                    title={`Environmental Insight: ${result.name}`}
                                    context={result.context}
                                    benefit={result.benefit}
                                    suggestion={result.suggestion}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};



const MissionTrackerPage = ({ userState, setUserState, setPage }) => {
    const mapRef = useRef(null); 
    const mapInstanceRef = useRef(null); 

    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); 
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isGpsLoading, setIsGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    

    const loadedMissions = useMemo(() => userState.missions
        .filter(m => m.completed && m.location)
        .map(m => ({
            id: m.id,
            name: m.name,
            lat: m.location.latitude,
            lng: m.location.longitude,
            reward: m.reward
        })), [userState.missions]);

  
    useEffect(() => {
        
        if (typeof L !== 'undefined' && typeof L.map === 'function' && mapRef.current) {
            
            
            if (L.Icon && L.Icon.Default) {
                delete L.Icon.Default.prototype._getIconUrl;

                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                });
            }
           

            if (mapInstanceRef.current) {
                
                mapInstanceRef.current.remove();
            }

            try {
                 
                 const initialCenter = loadedMissions.length > 0 
                    ? [loadedMissions[loadedMissions.length - 1].lat, loadedMissions[loadedMissions.length - 1].lng]
                    : [20.5937, 78.9629]; 

                 
                const map = L.map(mapRef.current).setView(initialCenter, loadedMissions.length > 0 ? 10 : 5);
                mapInstanceRef.current = map;

                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

               
                loadedMissions.forEach(mission => {
                    L.marker([mission.lat, mission.lng])
                        .addTo(map)
                        .bindPopup(`<p class="font-semibold">${mission.name}</p><p class="text-xs text-yellow-500">Reward: ${mission.reward} Pts</p>`);
                });

                
                if (currentLocation) {
                     L.marker([currentLocation.latitude, currentLocation.longitude], {
                        icon: L.divIcon({
                            className: 'custom-div-icon',
                            html: '<div class="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>',
                            iconSize: [16, 16]
                        })
                     })
                     .addTo(map)
                     .bindPopup("Your Current Location (for next mission)");
                }

            } catch (e) {
                console.error("Leaflet initialization failed. Check CDN loading or L variable availability.", e);
            }
        }
    
    }, [loadedMissions, currentLocation]); 
    
  
    const getGpsLocation = (callback) => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            
            
            const mockLocation = { latitude: 28.6139, longitude: 77.2090 }; 
            setCurrentLocation(mockLocation);
            setIsGpsLoading(false);
            callback(mockLocation);
            return;
        }

        setIsGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const loc = { latitude, longitude };
                setCurrentLocation(loc); 
                setIsGpsLoading(false);
                callback(loc);
            },
            (error) => {
        
                console.error("GPS Error:", error); 
                setGpsError(`Could not get location. Error: ${error.message || JSON.stringify(error)}. Using mock location for demo.`);
                setIsGpsLoading(false);

               
                const mockLocation = { latitude: 28.6139 + Math.random() * 0.1, longitude: 77.2090 + Math.random() * 0.1 }; // Slightly randomized mock
                setCurrentLocation(mockLocation);
                callback(mockLocation);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleMissionCompletion = (missionId, reward) => {
        getGpsLocation((location) => {
            if (location) {
                setUserState(prev => {
                    const updatedMissions = prev.missions.map(m => 
                        m.id === missionId 
                        ? { ...m, completed: true, location: location } 
                        : m
                    );
                    const newTotalPoints = prev.totalPoints + reward;
                    
                    return { ...prev, missions: updatedMissions, totalPoints: newTotalPoints };
                });
                
                const newActions = [...userState.completedActions, { 
                    actionType: 'mission_complete', 
                    points: reward, 
                    date: new Date().toISOString(),
                    details: `Mission ${missionId} completed at ${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
                    name: userState.missions.find(m => m.id === missionId).name
                }];
                setUserState(prev => ({ ...prev, completedActions: newActions }));
            } else {
                
                const newActions = [...userState.completedActions, { 
                    actionType: 'mission_fail', 
                    points: 0, 
                    date: new Date().toISOString(),
                    details: `Mission failed: Could not get GPS location.`,
                    name: userState.missions.find(m => m.id === missionId).name
                }];
                setUserState(prev => ({ ...prev, completedActions: newActions }));
            }
        });
    };

    const pendingMissions = userState.missions.filter(m => !m.completed);

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">Mission Tracker</h3>
            
            {/* Mission List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pendingMissions.length > 0 ? (
                    pendingMissions.map(mission => (
                        <div key={mission.id} className="p-4 border-2 border-blue-200 rounded-lg shadow-sm flex flex-col justify-between">
                            <p className="font-bold text-lg text-gray-800">{mission.name}</p>
                            <p className="text-sm text-gray-600 mb-3">Reward: <span className="font-bold text-yellow-500">{mission.reward} Pts</span></p>
                            <ActionButton 
                                onClick={() => handleMissionCompletion(mission.id, mission.reward)}
                                disabled={isGpsLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-sm"
                            >
                                {isGpsLoading ? 'Getting GPS...' : 'Mark Completed (Capture Location)'}
                            </ActionButton>
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-2 text-center p-8 bg-green-50 rounded-lg border-dashed border-2 border-green-300">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-xl font-semibold text-green-700">All missions complete!</p>
                        <p className="text-gray-600">Great work, Eco-Warrior!</p>
                    </div>
                )}
            </div>
            
            {gpsError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">GPS Error:</strong>
                    <span className="block sm:inline"> {gpsError}</span>
                </div>
            )}

            <h4 className="text-2xl font-bold text-gray-700 mb-4 border-t pt-4">Community Impact Map</h4>
            
            {/* Map Component (Now uses a ref for pure JS initialization) */}
            <div ref={mapRef} id="leaflet-map-container" className="h-[400px] w-full rounded-lg shadow-xl overflow-hidden" />
        </div>
    );
};



const LeaderboardPage = ({ userState }) => {

    const mockUsers = [
        { username: 'GreenThumb', totalPoints: 180, badges: ['Green Starter Badge', 'Botanist'] },
        { username: 'RecyclerPro', totalPoints: 120, badges: ['Green Starter Badge'] },
        { username: 'NatureLover', totalPoints: 80, badges: [] },
    ];

    const allUsers = [...mockUsers, { username: userState.username, totalPoints: userState.totalPoints, badges: userState.badges }];
    
    // Sort by points (descending)
    const sortedUsers = allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl max-w-lg mx-auto">
            <h3 className="text-3xl font-bold text-yellow-600 mb-6 text-center flex items-center justify-center">
                <Trophy className="w-8 h-8 mr-2" /> Global Eco-Leaderboard
            </h3>

            <div className="space-y-3">
                {sortedUsers.map((u, index) => (
                    <div key={u.username} className={`flex items-center p-4 rounded-lg transition-all ${
                        u.username === userState.username ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
                    }`}>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white mr-4 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-yellow-800' : 'bg-green-500'
                        }`}>
                            {index + 1}
                        </div>
                        <div className="flex-grow">
                            <p className={`font-semibold ${u.username === userState.username ? 'text-blue-700' : 'text-gray-800'}`}>
                                {u.username} {u.username === userState.username && "(You)"}
                            </p>
                            <div className="flex space-x-2 text-xs mt-1">
                                {u.badges.includes('Green Starter Badge') && (
                                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium">Starter Badge</span>
                                )}
                                {u.badges.length === 0 && <span className="text-gray-500">No Badges</span>}
                            </div>
                        </div>
                        <p className="font-extrabold text-xl text-yellow-500">{u.totalPoints} <span className="text-sm">Pts</span></p>
                    </div>
                ))}
            </div>
            <p className="text-xs text-center text-gray-500 mt-6">Leaderboard data is mocked for prototype purposes.</p>
        </div>
    );
};


const App = () => {
    const [page, setPage] = useState('Dashboard');
    const [userState, setUserState] = useState(INITIAL_USER_STATE);

    const renderPage = () => {
        switch (page) {
            case 'Dashboard':
                return <Dashboard userState={userState} setPage={setPage} />;
            case 'Quiz':
                return <QuizPage userState={userState} setUserState={setUserState} setPage={setPage} />;
            case 'Verify':
                return <ImageVerificationPage userState={userState} setUserState={setUserState} setPage={setPage} />;
            case 'Missions':
                return <MissionTrackerPage userState={userState} setUserState={setUserState} setPage={setPage} />;
            case 'Leaderboard':
                return <LeaderboardPage userState={userState} />;
            default:
                return <Dashboard userState={userState} setPage={setPage} />;
        }
    };

    const Dashboard = ({ userState, setPage }) => (
        <div className="p-4 md:p-8 bg-white rounded-xl shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                
                
                <div className="py-12">
                    <span className="inline-flex items-center space-x-2 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full mb-6">
                        <Leaf className="w-4 h-4" /> Smart Environmental Learning
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                        Play. <span className="text-green-600">Learn.</span> <span className="text-green-800">Sustain.</span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-md">
                        Transform environmental education into an exciting journey. Gamified learning that makes sustainability fun, interactive, and impactful for schools and colleges.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => setPage('Quiz')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
                        >
                            Start Your Eco Journey
                        </button>
                        <button
                            onClick={() => setPage('Dashboard')} 
                            className="bg-white text-green-600 border-2 border-green-600 font-semibold py-3 px-8 rounded-full hover:bg-green-50 transition-colors duration-200"
                        >
                            For Educators
                        </button>
                    </div>
                </div>

                
                <div className="hidden lg:block h-full min-h-[400px] bg-green-50/50 rounded-xl shadow-inner flex items-center justify-center p-8">
                    <p className="text-center text-green-700 font-semibold text-lg">
                        [Illustration Placeholder: Gamified Learning]
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center py-6 px-4 -mt-16 sm:-mt-12 mb-12 relative bg-white rounded-lg shadow-xl border-t-4 border-blue-500">
                <MetricItem count="10K+" label="Active Students" icon={<User className="w-6 h-6 text-blue-500" />} />
                <MetricItem count="50K+" label="Eco Points Earned" icon={<Zap className="w-6 h-6 text-yellow-500" />} />
                <MetricItem count="200+" label="Schools Joined" icon={<Trophy className="w-6 h-6 text-green-500" />} />
                <MetricItem count="35" label="Current Eco-Points" icon={<TrendingUp className="w-6 h-6 text-red-500" />} value={userState.totalPoints} />
            </div>

            
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                    How It <span className="text-green-600">Works</span>
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Four simple steps to transform your environmental education experience.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureStepCard 
                    step="01" 
                    title="Join the Platform" 
                    description="Sign up with your school or college to get started on your eco-journey." 
                    icon={Download}
                    onClick={() => setPage('Dashboard')}
                />
                <FeatureStepCard 
                    step="02" 
                    title="Learn & Explore" 
                    description="Complete interactive lessons, quizzes, and challenges about environmental topics." 
                    icon={BookOpen}
                    onClick={() => setPage('Quiz')}
                />
                <FeatureStepCard 
                    step="03" 
                    title="Take Action" 
                    description="Participate in real-world eco-missions and sustainable activities in your community." 
                    icon={Camera}
                    onClick={() => setPage('Verify')}
                />
                <FeatureStepCard 
                    step="04" 
                    title="Earn Rewards" 
                    description="Collect eco-points, unlock badges, and climb the leaderboard as you make an impact." 
                    icon={Trophy}
                    onClick={() => setPage('Leaderboard')}
                />
            </div>
            
        </div>
    );

    const MetricItem = ({ count, label, icon, value }) => (
        <div className="flex items-center space-x-3 w-1/2 sm:w-1/4 p-3 border-r last:border-r-0 border-gray-100/50">
            <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-xl font-extrabold text-gray-800">{value !== undefined ? value : count}</p>
                <p className="text-xs text-gray-500 font-semibold">{label}</p>
            </div>
        </div>
    );

    const FeatureStepCard = ({ step, title, description, icon: Icon, onClick }) => (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-green-300 cursor-pointer" onClick={onClick}>
            <div className="relative w-full mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-extrabold mx-auto text-lg absolute -top-10 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md">
                    {step}
                </div>
            </div>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-6 mb-4">
                <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pt-8 font-sans">
            <Navbar setPage={setPage} />

            <main className="max-w-7xl mx-auto mt-8">
                {renderPage()}
            </main>
            
            <footer className="text-center text-gray-500 text-sm mt-8 pb-4">
                <p>Presented by Unlock Ed.</p>
            </footer>
        </div>
    );
};

export default App;
