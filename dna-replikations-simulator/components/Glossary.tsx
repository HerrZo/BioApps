import React from 'react';
import { X, Book } from 'lucide-react';
import { GLOSSARY, COLORS } from '../constants';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-[#2C3E50] text-white">
          <div className="flex items-center gap-2">
            <Book size={24} />
            <h2 className="text-xl font-bold">Glossar</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] bg-[#ECF0F1]">
          <div className="space-y-4">
            {GLOSSARY.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: COLORS.secondary }}>
                <h3 className="font-bold text-[#2C3E50] text-lg mb-1">{item.term}</h3>
                <p className="text-[#34495E] leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Glossary;