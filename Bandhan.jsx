

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, Briefcase, Calendar, GraduationCap, Code, MessageSquare, Send, X, Filter, ChevronDown, Check } from 'lucide-react';
 
  
const PRIMARY_COLOR_CLASSES = 'bg-[#00A389] hover:bg-[#008F79]';
const SECONDARY_COLOR_CLASSES = 'text-[#1F3A66]';
const ACCENT_COLOR_CLASSES = 'text-[#00A389]';

// --- MOCK DATA ---
const MOCK_ALUMNI_DATA = [
    { id: 1, name: 'Sanjay Sharma', company: 'TCS', role: 'Senior Consultant', year: 2010, branch: 'CSE', college: 'NIT Uttarakhand', email: 'sanjay@tcs.com' },
    { id: 2, name: 'Priya Verma', company: 'Flipkart', role: 'Product Head', year: 2014, branch: 'ECE', college: 'IIT Delhi', email: 'priya@flipkart.com' },
    { id: 3, name: 'Rohit Gupta', company: 'Infosys', role: 'Lead Software Architect', year: 2018, branch: 'CSE', college: 'Graphic Era University', email: 'rohit@infosys.com' },
    { id: 4, name: 'Anjali Singh', company: 'Wipro', role: 'Data Scientist', year: 2019, branch: 'Mechanical', college: 'DTU', email: 'anjali@wipro.com' },
    { id: 5, name: 'Vikram Menon', company: 'Zoho', role: 'VP, Engineering', year: 2005, branch: 'CSE', college: 'NIT Uttarakhand', email: 'vikram@zoho.com' },
    { id: 6, name: 'Shreya Das', company: 'Google India', role: 'Full Stack Developer', year: 2021, branch: 'CSE', college: 'IIT Delhi', email: 'shreya@google.com' },
    { id: 7, name: 'Ravi Kumar', company: 'L&T', role: 'Project Manager', year: 2012, branch: 'Civil', college: 'NIT Uttarakhand', email: 'ravi@lnt.com' },
    { id: 8, name: 'Neha Reddy', company: 'TCS', role: 'UI/UX Designer', year: 2020, branch: 'ECE', college: 'Graphic Era University', email: 'neha@tcs.com' },
];

const LOGGED_IN_USER = {
    id: 'student-99',
    name: 'Current Student',
    avatar: 'https://placehold.co/40x40/1F3A66/ffffff?text=CS' 
};

const DROPDOWN_OPTIONS = {
    year: [...new Set(MOCK_ALUMNI_DATA.map(a => a.year.toString()))].sort((a, b) => b - a),
    branch: [...new Set(MOCK_ALUMNI_DATA.map(a => a.branch))].sort(),
    college: [...new Set(MOCK_ALUMNI_DATA.map(a => a.college))].sort(),
};


const ChatBubble = ({ message, isSender }) => (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[80%] px-4 py-2 rounded-xl shadow-md transition duration-200 ease-in-out ${
            isSender 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
        }`}>
            <p className="text-sm break-words">{message.text}</p>
            <span className={`text-[10px] block mt-1 ${isSender ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                {message.time}
            </span>
        </div>
    </div>
);

const ChatDrawer = ({ targetAlumnus, closeChat, loggedInUser }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${targetAlumnus.name}, I'm a student interested in your career path at ${targetAlumnus.company}.`, time: '10:00 AM', senderId: loggedInUser.id },
        { id: 2, text: `Hi there! I'd be happy to share my experience. What are your main questions about ${targetAlumnus.role}?`, time: '10:01 AM', senderId: targetAlumnus.id },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            senderId: loggedInUser.id,
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };
    
  
    return (
        <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm bg-black/30">
            <div className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                            src={`https://placehold.co/40x40/1F3A66/ffffff?text=${targetAlumnus.name.charAt(0)}`} 
                            alt={targetAlumnus.name} 
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/1F3A66/ffffff?text=Al" }}
                        />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{targetAlumnus.name}</h3>
                            <p className="text-xs text-green-500 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                Online (Dummy)
                            </p>
                        </div>
                    </div>
                    <button onClick={closeChat} className="p-2 text-gray-500 hover:text-blue-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {messages.map(msg => (
                        <ChatBubble 
                            key={msg.id} 
                            message={msg} 
                            isSender={msg.senderId === loggedInUser.id} 
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

           
                <form onSubmit={handleSend} className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                            disabled={!newMessage.trim()}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- ALUMNI CARD COMPONENT ---

const AlumniCard = React.memo(({ alumnus, startChat }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
                <img 
                    src={`https://placehold.co/60x60/1F3A66/ffffff?text=${alumnus.name.charAt(0)}`} 
                    className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-[#1F3A66]/30"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/1F3A66/ffffff?text=Al" }}
                />
                <div>
                    <h3 className={`text-xl font-bold ${SECONDARY_COLOR_CLASSES}`}>{alumnus.name}</h3>
                    <p className={`font-medium text-base flex items-center mt-1 ${ACCENT_COLOR_CLASSES}`}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        {alumnus.role} @ {alumnus.company}
                    </p>
                </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                    <GraduationCap className={`w-4 h-4 mr-3 ${ACCENT_COLOR_CLASSES}`} />
                    <span className="font-semibold">{alumnus.college}</span>
                </p>
                <p className="flex items-center">
                    <Code className={`w-4 h-4 mr-3 ${ACCENT_COLOR_CLASSES}`} />
                    Branch: {alumnus.branch}
                </p>
                <p className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-3 ${ACCENT_COLOR_CLASSES}`} />
                    Graduation: {alumnus.year}
                </p>
            </div>
            
            <button
                onClick={() => startChat(alumnus)}
                className={`mt-6 w-full flex items-center justify-center text-sm font-semibold text-white px-4 py-3 rounded-lg transition duration-150 shadow-md transform hover:scale-[1.01] ${PRIMARY_COLOR_CLASSES}`}
            >
                <MessageSquare className="w-4 h-4 mr-2" />
                Connect (Chat)
            </button>
           
        </div>
    );
});



const FilterDropdown = ({ title, options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto flex items-center justify-between px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:border-[#00A389] transition duration-150 text-sm font-medium"
            >
                {title}: <span className={`font-bold ml-1 ${ACCENT_COLOR_CLASSES}`}>{selected || 'All'}</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl bg-white z-10 border border-gray-200">
                    <div
                        onClick={() => { onSelect(null); setIsOpen(false); }}
                        className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 text-gray-900 transition ${!selected ? 'bg-gray-100 font-semibold' : ''}`}
                    >
                        All {title} {selected && <Check className={`w-4 h-4 ml-auto ${ACCENT_COLOR_CLASSES}`} />}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <div
                                key={option}
                                onClick={() => { onSelect(option); setIsOpen(false); }}
                                className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 text-gray-900 transition ${selected === option ? 'bg-gray-100 font-semibold' : ''}`}
                            >
                                {option}
                                {selected === option && <Check className={`w-4 h-4 ml-auto ${ACCENT_COLOR_CLASSES}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const AlumniConnect = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ year: null, branch: null, college: null });
    const [chatTarget, setChatTarget] = useState(null);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const startChat = useCallback((alumnus) => {
        setChatTarget(alumnus);
    }, []);

    const closeChat = useCallback(() => {
        setChatTarget(null);
    }, []);

    
    const filteredAlumni = useMemo(() => {
        let results = MOCK_ALUMNI_DATA;

        
        if (filters.year) {
            results = results.filter(a => a.year.toString() === filters.year);
        }
        if (filters.branch) {
            results = results.filter(a => a.branch === filters.branch);
        }
        if (filters.college) {
            results = results.filter(a => a.college === filters.college);
        }

        
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(a =>
                a.name.toLowerCase().includes(lowerCaseSearch) ||
                a.company.toLowerCase().includes(lowerCaseSearch) ||
                a.role.toLowerCase().includes(lowerCaseSearch)
            );
        }
        
       
        return results;
    }, [filters, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans transition-colors duration-300">
            
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                      
                        <div className="flex items-center space-x-4">
                           
                            <img src="https://placehold.co/32x32/1F3A66/ffffff?text=TC" alt="TheCampusCap Logo" className="h-8 w-auto" />
                            <span className={`font-extrabold text-xl ${SECONDARY_COLOR_CLASSES} mr-4`}>TheCampusCap</span>
                            {/* Feature Name */}
                            <span className="hidden sm:inline-block text-lg font-bold text-gray-500">/ Bandhan</span>
                        </div>

                        
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-600 hover:text-[#00A389] transition hidden md:block">Explore Streams</a>
                            
                           
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-full text-sm focus:ring-[#00A389] focus:border-[#00A389] w-32 md:w-48 transition"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                            </div>

                            
                            <button className={`px-4 py-2 text-white rounded-md transition duration-150 ${PRIMARY_COLOR_CLASSES}`}>Login</button>
                            
                            
                        </div>
                    </div>
                </div>
            </nav>

            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">
                    <span className={ACCENT_COLOR_CLASSES}>Bandhan</span> - Alumni Connect
                </h1>

                
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search alumni by Name, Role, or Company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-[#00A389] focus:border-[#00A389] bg-white transition duration-150"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>

                
                    <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
                        <span className="text-gray-700 font-semibold text-base flex items-center">
                            <Filter className={`w-4 h-4 mr-2 ${ACCENT_COLOR_CLASSES}`} />
                            Filters:
                        </span>
                        
                        <FilterDropdown 
                            title="College" 
                            options={DROPDOWN_OPTIONS.college} 
                            selected={filters.college} 
                            onSelect={(val) => handleFilterChange('college', val)}
                        />
                        <FilterDropdown 
                            title="Branch" 
                            options={DROPDOWN_OPTIONS.branch} 
                            selected={filters.branch} 
                            onSelect={(val) => handleFilterChange('branch', val)}
                        />
                        <FilterDropdown 
                            title="Year" 
                            options={DROPDOWN_OPTIONS.year} 
                            selected={filters.year} 
                            onSelect={(val) => handleFilterChange('year', val)}
                        />
                    </div>
                </div>

                
                <div className="mb-6 text-xl font-medium text-gray-700 text-center lg:text-left">
                    Showing <span className={`font-bold ${ACCENT_COLOR_CLASSES}`}>{filteredAlumni.length}</span> alumni
                </div>

                
                <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                    {filteredAlumni.length > 0 ? (
                        filteredAlumni.map(alumnus => (
                            <AlumniCard 
                                key={alumnus.id} 
                                alumnus={alumnus} 
                                startChat={startChat} 
                            />
                        ))
                    ) : (
                        <div className="lg:col-span-3 p-12 bg-white rounded-xl text-center shadow-lg border border-gray-200">
                            <p className="text-2xl font-medium text-gray-500">
                                No alumni found matching your criteria.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilters({ year: null, branch: null, college: null }); }}
                                className={`mt-4 px-6 py-2 text-white rounded-lg transition font-semibold ${PRIMARY_COLOR_CLASSES}`}
                            >
                                Reset Filters and Search
                            </button>
                        </div>
                    )}
                </div>
            </main>

           
            {chatTarget && (
                <ChatDrawer 
                    targetAlumnus={chatTarget} 
                    closeChat={closeChat} 
                    loggedInUser={LOGGED_IN_USER} 
                />
            )}
        </div>
    );
};

export default AlumniConnect;
