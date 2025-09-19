const { useState, useEffect } = React;

function ScamDetector() {
    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    // Scam detection patterns and keywords
    const scamPatterns = {
        urgency: ['urgent', 'immediate', 'expires today', 'limited time', 'act now', 'hurry'],
        money: ['free money', 'cash prize', 'lottery', 'inheritance', 'million dollars', 'wire transfer', 'bitcoin', 'cryptocurrency'],
        personal: ['verify account', 'confirm identity', 'social security', 'bank details', 'credit card', 'password'],
        threats: ['suspended', 'blocked', 'legal action', 'arrest', 'fine', 'penalty'],
        suspicious: ['click here', 'download now', 'call immediately', 'reply with', 'send money', 'western union'],
        grammar: /[.]{3,}|[!]{2,}|[A-Z]{5,}/g
    };

    const analyzeMessage = () => {
        if (!message.trim()) return;
        
        setIsAnalyzing(true);
        setShowAnimation(true);
        setResult(null);

        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            let riskScore = 0;
            let flags = [];

            // Check for scam patterns
            Object.entries(scamPatterns).forEach(([category, patterns]) => {
                if (category === 'grammar') {
                    const matches = message.match(patterns);
                    if (matches && matches.length > 2) {
                        riskScore += 15;
                        flags.push('Suspicious formatting detected');
                    }
                } else {
                    patterns.forEach(pattern => {
                        if (lowerMessage.includes(pattern)) {
                            riskScore += category === 'money' ? 25 : 
                                       category === 'personal' ? 30 : 
                                       category === 'threats' ? 20 : 15;
                            flags.push(`${category.charAt(0).toUpperCase() + category.slice(1)} keyword: "${pattern}"`);
                        }
                    });
                }
            });

            // Additional checks
            if (lowerMessage.includes('http') || lowerMessage.includes('www.')) {
                riskScore += 10;
                flags.push('Contains external links');
            }

            if (message.length < 20) {
                riskScore += 5;
                flags.push('Very short message');
            }

            // Determine risk level
            let riskLevel, color, recommendation;
            if (riskScore >= 50) {
                riskLevel = 'HIGH RISK - Likely Scam';
                color = 'text-red-600';
                recommendation = 'Do not respond or click any links. Delete this message immediately.';
            } else if (riskScore >= 25) {
                riskLevel = 'MEDIUM RISK - Suspicious';
                color = 'text-yellow-600';
                recommendation = 'Be very cautious. Verify sender through official channels before taking any action.';
            } else {
                riskLevel = 'LOW RISK - Appears Safe';
                color = 'text-green-600';
                recommendation = 'Message appears legitimate, but always stay vigilant.';
            }

            setResult({
                riskLevel,
                riskScore,
                color,
                flags,
                recommendation
            });
            setIsAnalyzing(false);
            setShowAnimation(false);
        }, 2000);
    };

    const clearAnalysis = () => {
        setMessage('');
        setResult(null);
        setIsAnalyzing(false);
        setShowAnimation(false);
    };

    const sampleScams = [
        "URGENT! Your account will be suspended in 24 hours. Click here to verify your bank details immediately!",
        "Congratulations! You've won $1,000,000 in our lottery. Send $500 processing fee to claim your prize.",
        "Hi, this is a normal message from your friend about meeting for coffee tomorrow."
    ];

    return (
        <div className="min-h-screen gradient-bg">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🛡️</span>
                            </div>
                            {isAnalyzing && (
                                <div className="absolute inset-0 rounded-full border-4 border-blue-400 pulse-ring"></div>
                            )}
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Scam Shield</h1>
                    <p className="text-blue-100 text-lg">AI-Powered Message Safety Analyzer</p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analyze Your Message</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paste the message you want to analyze:
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Paste your message here..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                disabled={isAnalyzing}
                            />
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={analyzeMessage}
                                disabled={!message.trim() || isAnalyzing}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
                            </button>
                            <button
                                onClick={clearAnalysis}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Sample Messages */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Try these sample messages:</p>
                            <div className="grid gap-2">
                                {sampleScams.map((sample, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMessage(sample)}
                                        className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        disabled={isAnalyzing}
                                    >
                                        {sample.substring(0, 80)}...
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Analysis Animation */}
                        {showAnimation && (
                            <div className="relative h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500 scan-animation rounded-full"></div>
                            </div>
                        )}

                        {/* Results */}
                        {result && (
                            <div className="border-t pt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
                                
                                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-xl font-bold ${result.color}`}>
                                            {result.riskLevel}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Risk Score: {result.riskScore}/100
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                        <div 
                                            className={`h-3 rounded-full transition-all duration-1000 ${
                                                result.riskScore >= 50 ? 'bg-red-500' : 
                                                result.riskScore >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(result.riskScore, 100)}%` }}
                                        ></div>
                                    </div>

                                    <p className="text-gray-700 font-medium mb-4">
                                        {result.recommendation}
                                    </p>

                                    {result.flags.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Detected Issues:</h4>
                                            <ul className="space-y-1">
                                                {result.flags.map((flag, index) => (
                                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                                        <span className="text-red-500 mr-2">⚠️</span>
                                                        {flag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tips Section */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">🔍 Scam Detection Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1">🚨</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Urgency Tactics</h4>
                                        <p className="text-sm text-gray-600">Scammers create false urgency to pressure quick decisions</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1">💰</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Money Requests</h4>
                                        <p className="text-sm text-gray-600">Legitimate organizations don't ask for money via text/email</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1">🔗</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Suspicious Links</h4>
                                        <p className="text-sm text-gray-600">Never click links from unknown senders</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1">📝</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Personal Info</h4>
                                        <p className="text-sm text-gray-600">Never share passwords, SSN, or banking details</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<ScamDetector />, document.getElementById('root'));