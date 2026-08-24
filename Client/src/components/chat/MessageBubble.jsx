import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  FiUser, FiCpu, FiMapPin, FiCalendar, FiUsers, FiDollarSign, 
  FiSun, FiCoffee, FiInfo, FiHeart, FiTrendingUp, FiCloud, 
  FiCompass, FiClock, FiAward, FiFlag, FiGlobe
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MessageBubble = ({ message, index }) => {
  const isUser = message.type === 'user';
  const isGreeting = message.isGreeting;
  const isNonTravel = message.isTravelRelated === false;

  // Dynamic color generator based on destination
  const getDestinationColor = (destination) => {
    const colors = {
      'Goa': '#ff6b6b', 'Manali': '#4ecdc4', 'Kerala': '#45b7d1', 
      'Jaipur': '#f9ca24', 'Delhi': '#f0932b', 'Mumbai': '#eb4d4b',
      'Bali': '#6ab04c', 'Switzerland': '#e056fd', 'Paris': '#ffbe76'
    };
    return colors[destination] || '#4f73f2';
  };

  // Enhanced Trip Card Component - Works for ANY destination
  const EnhancedTripCard = ({ plan }) => {
    const [expandedDay, setExpandedDay] = React.useState(null);
    const destinationColor = getDestinationColor(plan.destination);
    
    const costData = plan.costBreakdown ? [
      { name: 'Transport', value: plan.costBreakdown.transport, color: '#4f73f2' },
      { name: 'Hotel', value: plan.costBreakdown.hotel, color: '#a855f7' },
      { name: 'Food', value: plan.costBreakdown.food, color: '#06b6d4' },
      { name: 'Activities', value: plan.costBreakdown.activities, color: '#f59e0b' },
    ] : [];

    const efficiency = plan.budget && plan.costBreakdown?.total 
      ? ((plan.budget - plan.costBreakdown.total) / plan.budget) * 100 
      : 50;
    const efficiencyScore = Math.max(0, Math.min(100, Math.round(efficiency)));


    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full space-y-3"
      >
        {/* Main Header Card */}
        <div 
          className="rounded-2xl p-5 border-2"
          style={{ 
            background: `linear-gradient(135deg, ${destinationColor}20, ${destinationColor}05)`,
            borderColor: `${destinationColor}40`
          }}
        >
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiGlobe className="text-primary-400" />
                <h2 className="text-2xl font-bold gradient-text">{plan.destination}</h2>
                {plan.travelScore && (
                  <div className="ml-2 px-2 py-1 bg-green-500/20 rounded-full text-xs">
                    Score: {plan.travelScore}/100
                  </div>
                )}
              </div>
              <div className="flex gap-3 text-sm text-gray-300 flex-wrap">
                <span className="flex items-center gap-1"><FiMapPin /> {plan.source || 'Your City'} → {plan.destination}</span>
                <span className="flex items-center gap-1"><FiCalendar /> {plan.days} Days / {plan.days - 1} Nights</span>
                <span className="flex items-center gap-1"><FiUsers /> {plan.travelers} {plan.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                <span className="flex items-center gap-1"><FiDollarSign /> {plan.currency === 'INR' ? '₹' : '$'}{plan.budget?.toLocaleString()} {plan.currency !== 'INR' ? plan.currency : ''}</span>
              </div>
            </div>
            <div className="glass px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-gray-400">Budget Efficiency</div>
              <div className="text-xl font-bold" style={{ color: efficiencyScore >= 70 ? '#10b981' : '#f59e0b' }}>
                {efficiencyScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Destination Overview */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="glass p-3 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">📖 About</div>
            <p className="text-sm text-gray-300">{plan.description}</p>
          </div>
          <div className="glass p-3 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">⏰ Best Time to Visit</div>
            <p className="text-sm font-semibold" style={{ color: destinationColor }}>{plan.bestTimeToVisit}</p>
            <div className="text-xs text-gray-400 mt-1">🌤️ {plan.weather}</div>
          </div>
        </div>

        {/* How to Reach */}
        {plan.howToReach && (
          <div className="glass p-4 rounded-xl">
            <h4 className="font-semibold mb-2 flex items-center gap-2">🚗 How to Reach from {plan.source || 'your city'}</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <ReactMarkdown>{plan.howToReach}</ReactMarkdown>
            </div>
            {plan.estimatedFlightPrice && (
              <div className="mt-2 text-xs text-primary-400">
                ✈️ Estimated flight cost: {plan.currency === 'INR' ? '₹' : '$'}{plan.estimatedFlightPrice.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Hotel Recommendation */}
        {plan.lodgingDetails && (
          <div className="glass p-4 rounded-xl border-l-4" style={{ borderLeftColor: destinationColor }}>
            <h4 className="font-semibold mb-2 flex items-center gap-2">🏨 Recommended Stay</h4>
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex-1">
                <p className="font-medium text-base">{plan.lodgingDetails.name}</p>
                <p className="text-xs text-gray-400 mt-1">{plan.lodgingDetails.description}</p>
                <p className="text-xs text-gray-500 mt-2">💡 {plan.lodgingDetails.justification}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg" style={{ color: destinationColor }}>
                  {plan.currency === 'INR' ? '₹' : '$'}{plan.lodgingDetails.nightlyCostEstimate}/night
                </p>
                <p className="text-xs text-gray-500 capitalize">{plan.lodgingDetails.category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary - Interactive */}
        {plan.itinerary && plan.itinerary.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">📅 {plan.days}-Day Itinerary</h4>
            <div className="space-y-2">
              {plan.itinerary.map((day, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                    className="w-full p-3 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold">{day.day}</span>
                      </div>
                      <div>
                        <h5 className="font-semibold">{day.title}</h5>
                        <p className="text-xs text-gray-400">{day.accommodation}</p>
                      </div>
                    </div>
                    <FiCompass className={`transform transition-transform ${expandedDay === idx ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedDay === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="p-3 pt-0 border-t border-white/10"
                    >
                      <div className="space-y-2 pl-11">
                        {/* Activities */}
                        <div>
                          <div className="text-xs text-primary-400 mb-1 flex items-center gap-1">🎯 Activities</div>
                          <ul className="space-y-1">
                            {day.activities?.map((act, i) => (
                              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-primary-400 mt-1">•</span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Meals */}
                        {day.meals && (
                          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                            <div className="bg-dark-800 p-2 rounded">
                              <span className="text-gray-500">🍳 Breakfast</span>
                              <p className="text-gray-300 mt-1">{day.meals.breakfast}</p>
                            </div>
                            <div className="bg-dark-800 p-2 rounded">
                              <span className="text-gray-500">🍱 Lunch</span>
                              <p className="text-gray-300 mt-1">{day.meals.lunch}</p>
                            </div>
                            <div className="bg-dark-800 p-2 rounded">
                              <span className="text-gray-500">🍽️ Dinner</span>
                              <p className="text-gray-300 mt-1">{day.meals.dinner}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Travel Details */}
                        {day.travelDetails && (
                          <div className="text-xs text-gray-400 flex items-start gap-1 mt-2">
                            <FiMapPin className="mt-0.5" /> {day.travelDetails}
                          </div>
                        )}
                        
                        {/* Tips */}
                        {day.tips && (
                          <div className="text-xs bg-primary-500/10 p-2 rounded-lg mt-2">
                            <FiInfo className="inline mr-1" /> {day.tips}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Chart */}
        {costData.length > 0 && (
          <div className="glass p-4 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><FiTrendingUp /> Budget Breakdown</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={costData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={60} 
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {costData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${plan.currency === 'INR' ? '₹' : '$'}${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{ background: '#1a1a24', border: '1px solid rgba(79,115,242,0.3)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {costData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span style={{ color: item.color }}>{item.name}</span>
                    <span>{plan.currency === 'INR' ? '₹' : '$'}{item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Budget</span>
                  <span className="text-primary-400">{plan.currency === 'INR' ? '₹' : '$'}{plan.costBreakdown.total.toLocaleString()}</span>
                </div>
                {plan.budgetEfficiency && (
                  <div className="text-xs text-green-400 mt-2">{plan.efficiencyMessage}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Must Visit Places */}
        {plan.mustVisitPlaces && plan.mustVisitPlaces.length > 0 && (
          <div className="glass p-4 rounded-xl">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><FiHeart /> Must Visit Places</h4>
            <div className="flex flex-wrap gap-2">
              {plan.mustVisitPlaces.map((place, i) => (
                <span key={i} className="px-3 py-1 bg-primary-500/20 rounded-full text-sm hover:scale-105 transition-transform cursor-pointer">
                  {place}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Local Cuisines */}
        {plan.localCuisines && plan.localCuisines.length > 0 && (
          <div className="glass p-4 rounded-xl">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><FiCoffee /> Must Try Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {plan.localCuisines.map((cuisine, i) => (
                <span key={i} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {plan.recommendations && plan.recommendations.length > 0 && (
          <div className="glass p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <h4 className="font-semibold mb-2 text-green-400 flex items-center gap-2">💡 Pro Tips</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {plan.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Tips */}
        {plan.travelTips && (
          <div className="glass p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <h4 className="font-semibold mb-2 text-blue-400 flex items-center gap-2">✈️ Travel Tips</h4>
            <p className="text-sm text-gray-300">{plan.travelTips}</p>
          </div>
        )}

        {/* Emergency Contacts */}
        {plan.emergencyContacts && (
          <div className="glass p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h4 className="font-semibold mb-2 text-red-400 flex items-center gap-2">🚨 Emergency Contacts</h4>
            <div className="text-sm space-y-1">
              <ReactMarkdown>{plan.emergencyContacts}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Quick Info Footer */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="glass p-2 rounded">
            <FiClock className="inline mr-1" /> {plan.timezone || 'Local Time'}
          </div>
          <div className="glass p-2 rounded">
            <FiFlag className="inline mr-1" /> {plan.language || 'Multiple Languages'}
          </div>
          <div className="glass p-2 rounded">
            <FiAward className="inline mr-1" /> {plan.currency || 'Local Currency'}
          </div>
        </div>
      </motion.div>
    );
  };

  // Greeting Card
  const GreetingCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md glass rounded-2xl p-6 text-center"
    >
      <div className="text-6xl mb-4 animate-bounce">✈️</div>
      <h3 className="text-xl font-bold gradient-text mb-2">Welcome to TravelMind AI!</h3>
      <p className="text-gray-300 text-sm mb-4">
        Your intelligent travel planning companion powered by Google's Gemini AI.
      </p>
      <div className="bg-primary-500/10 rounded-xl p-3 text-left">
        <p className="text-xs text-gray-400 mb-2">📝 Example:</p>
        <code className="text-sm text-primary-400 block">
          "I want a 5 day Goa trip from Varanasi under ₹25000 for 2 travelers"
        </code>
        <code className="text-sm text-primary-400 block mt-2">
          "Plan a 7 day trip to Bali from Mumbai under ₹60,000 for 4 people"
        </code>
      </div>
    </motion.div>
  );

  // Non-Travel Response Card
  const NonTravelCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md glass rounded-2xl p-6 text-center"
    >
      <div className="text-6xl mb-4">🌏</div>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">Travel Only Assistant</h3>
      <p className="text-gray-300 text-sm mb-4">
        I specialize in travel planning! Ask me about:
      </p>
      <div className="text-left space-y-2 text-sm text-gray-400">
        <div>✓ Destination itineraries</div>
        <div>✓ Budget planning</div>
        <div>✓ Hotel recommendations</div>
        <div>✓ Local activities & food</div>
        <div>✓ Transport options</div>
      </div>
    </motion.div>
  );

  // Loading/Processing Card
  const ProcessingCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-100" />
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-200" />
        <span className="text-sm text-gray-400 ml-2">AI is planning your trip...</span>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-gradient-to-r from-primary-500 to-purple-600' : 'glass'
        }`}>
          {isUser ? <FiUser size={18} /> : <FiCpu size={18} />}
        </div>
        
        <div className={`rounded-2xl p-4 ${
          isUser ? 'bg-gradient-to-r from-primary-500 to-purple-600' : 'glass'
        }`}>
          {message.tripPlan ? (
            <EnhancedTripCard plan={message.tripPlan} />
          ) : message.isGreeting ? (
            <GreetingCard />
          ) : message.isTravelRelated === false ? (
            <NonTravelCard />
          ) : message.isProcessing ? (
            <ProcessingCard />
          ) : (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                  h2: ({...props}) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                  p: ({...props}) => <p className="text-gray-300 mb-2" {...props} />,
                  code: ({...props}) => <code className="bg-dark-800 px-1 py-0.5 rounded text-primary-400" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;