import { useState } from 'react';

export default function ClockPicker({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('hours'); // 'hours' or 'minutes'

  const [hours, minutes] = value.split(':').map(Number);

  const handleSelectNumber = (num) => {
    if (view === 'hours') {
      const formattedHour = String(num).padStart(2, '0');
      const formattedMin = String(minutes).padStart(2, '0');
      onChange(`${formattedHour}:${formattedMin}`);
      setView('minutes');
    } else {
      const formattedHour = String(hours).padStart(2, '0');
      const formattedMin = String(num).padStart(2, '0');
      onChange(`${formattedHour}:${formattedMin}`);
      setIsOpen(false);
      setView('hours');
    }
  };

  const getPositionStyles = (index, total) => {
    const angle = (index * 360) / total - 90;
    const radius = 76;
    return {
      transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
    };
  };

  const hoursArray = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesArray = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    // Changed from side-by-side flex to stacked layout (matching your NumberInput style)
    <div className="flex flex-col w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      
      {/* Time Display Button - full width with clean height matching inputs */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full h-11 border border-slate-200 rounded-xl px-3 bg-slate-50 font-mono text-slate-800 text-sm shadow-sm hover:bg-white hover:border-blue-500 transition-colors text-left flex items-center justify-between cursor-pointer"
      >
        <span>{value}</span>
        <span className="text-xs text-slate-400 font-sans">Select time</span>
      </button>

      {/* Centered Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative z-50 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl flex flex-col items-center w-72 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Display Selector */}
            <div className="flex gap-2 items-center text-3xl font-bold mb-5 font-mono">
              <button 
                type="button"
                onClick={() => setView('hours')} 
                className={`transition-colors ${view === 'hours' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {String(hours).padStart(2, '0')}
              </button>
              <span className="text-slate-500">:</span>
              <button 
                type="button"
                onClick={() => setView('minutes')} 
                className={`transition-colors ${view === 'minutes' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {String(minutes).padStart(2, '0')}
              </button>
            </div>

            {/* Circular Clock Face Canvas */}
            <div className="relative w-52 h-52 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center select-none">
              
              <div className="absolute w-2 h-2 rounded-full bg-blue-500 z-10" />
              <div 
                className="absolute origin-bottom bottom-1/2 left-[calc(50%-1px)] w-0.5 bg-blue-500/60 transition-transform duration-200"
                style={{ 
                  height: '78px',
                  transform: `rotate(${view === 'hours' ? (hours % 12) * 30 : minutes * 6}deg)` 
                }} 
              />

              {view === 'hours' ? (
                hoursArray.map((num, i) => {
                  const isSelected = hours === num || (num === 12 && hours === 0);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectNumber(num === 12 ? 0 : num)}
                      style={getPositionStyles(i, 12)}
                      className={`absolute w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-150 cursor-pointer ${
                        isSelected ? 'bg-blue-500 text-white shadow-lg scale-110 z-20' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })
              ) : (
                minutesArray.map((num, i) => {
                  const isSelected = minutes === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectNumber(num)}
                      style={getPositionStyles(i, 12)}
                      className={`absolute w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-150 cursor-pointer ${
                        isSelected ? 'bg-blue-500 text-white shadow-lg scale-110 z-20' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {String(num).padStart(2, '0')}
                    </button>
                  );
                })
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between w-full text-xs text-slate-400">
              <span>Selecting <strong className="text-blue-400 capitalize">{view}</strong></span>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}