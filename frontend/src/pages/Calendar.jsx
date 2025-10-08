import React, { useState } from 'react';

const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const islamicEvents2025 = {
    'January': [
      { date: 12, event: 'Laylat al-Qadr', type: 'special' }
    ],
    'February': [
      { date: 28, event: 'Ramadan Begins', type: 'major' }
    ],
    'March': [
      { date: 15, event: 'Laylat al-Qadr', type: 'special' },
      { date: 30, event: 'Eid al-Fitr', type: 'major' }
    ],
    'May': [
      { date: 8, event: 'Hajj Begins', type: 'major' }
    ],
    'June': [
      { date: 6, event: 'Eid al-Adha', type: 'major' }
    ],
    'July': [
      { date: 19, event: 'Islamic New Year 1447', type: 'major' }
    ],
    'August': [
      { date: 30, event: 'Ashura', type: 'special' }
    ],
    'September': [
      { date: 18, event: 'Mawlid al-Nabi', type: 'special' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        <div className="w-16 h-16 bg-gray-700 border-2 border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <i className="fas fa-calendar-alt text-gold-400 text-2xl"></i>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
          Islamic Calendar
        </h1>
        <p className="text-lg text-gray-300">
          Important Islamic dates for 2025 / 1446-1447 AH
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setSelectedMonth(prev => prev > 0 ? prev - 1 : 11)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-gold-400">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <p className="text-gray-400">1446-1447 Hijri</p>
          </div>
          <button 
            onClick={() => setSelectedMonth(prev => prev < 11 ? prev + 1 : 0)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        {islamicEvents2025[months[selectedMonth]] && (
          <div className="mt-4">
            <h3 className="text-lg font-heading font-semibold text-gold-400 mb-3">Events This Month:</h3>
            <div className="space-y-2">
              {islamicEvents2025[months[selectedMonth]].map((event, index) => (
                <div key={index} className="p-3 bg-gray-750 rounded-md border border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">{event.event}</span>
                    <span className="text-gold-400">{months[selectedMonth]} {event.date}</span>
                  </div>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      event.type === 'major' 
                        ? 'bg-gold-900 text-gold-400' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {event.type === 'major' ? 'Major Event' : 'Special Day'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!islamicEvents2025[months[selectedMonth]] && (
          <div className="text-center py-8 text-gray-400">
            No Islamic events in {months[selectedMonth]}.
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-heading font-semibold text-gold-400 mb-6">
          Major Islamic Events 2025
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-750 rounded-lg border border-gold-600 shadow">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3 mx-auto">
              <i className="fas fa-moon text-gold-400"></i>
            </div>
            <h3 className="font-semibold text-gold-400 text-center">Ramadan</h3>
            <p className="text-sm text-gray-400 text-center">February 28 - March 30, 2025</p>
          </div>
          
          <div className="p-4 bg-gray-750 rounded-lg border border-gold-600 shadow">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3 mx-auto">
              <i className="fas fa-star text-gold-400"></i>
            </div>
            <h3 className="font-semibold text-gold-400 text-center">Eid al-Fitr</h3>
            <p className="text-sm text-gray-400 text-center">March 30, 2025</p>
          </div>
          
          <div className="p-4 bg-gray-750 rounded-lg border border-gold-600 shadow">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-3 mx-auto">
              <i className="fas fa-kaaba text-gold-400"></i>
            </div>
            <h3 className="font-semibold text-gold-400 text-center">Eid al-Adha</h3>
            <p className="text-sm text-gray-400 text-center">June 6, 2025</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-heading font-semibold text-gold-400 mb-4">
            All Events in 2025
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Islamic New Year 1447</span>
                <span className="text-gold-400">July 19, 2025</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ramadan Begins</span>
                <span className="text-gold-400">February 28, 2025</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Laylat al-Qadr</span>
                <span className="text-gold-400">March 15, 2025</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mawlid al-Nabi</span>
                <span className="text-gold-400">September 18, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
