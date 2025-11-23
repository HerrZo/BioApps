import React, { useState } from 'react';
import { Book, Dna, FlaskConical, GitCompare, HelpCircle, ArrowLeft } from 'lucide-react';
import { ViewState } from './types';
import { COLORS } from './constants';
import Glossary from './components/Glossary';
import MeselsonStahl from './components/MeselsonStahl';
import ReplicationSimulator from './components/ReplicationSimulator';
import StrandComparison from './components/StrandComparison';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isGlossaryOpen, setGlossaryOpen] = useState(false);

  // Helper for rendering the content based on view
  const renderContent = () => {
    switch (currentView) {
      case ViewState.MESELSON:
        return <MeselsonStahl />;
      case ViewState.SIMULATOR:
        return <ReplicationSimulator />;
      case ViewState.COMPARISON:
        return <StrandComparison />;
      case ViewState.QUIZ:
        return <Quiz />;
      default:
        return <HomeMenu />;
    }
  };

  const HomeMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <MenuCard 
        title="Meselson-Stahl" 
        desc="Der historische Beweis für die semikonservative Replikation."
        icon={<FlaskConical size={48} color={COLORS.secondary} />}
        onClick={() => setCurrentView(ViewState.MESELSON)}
      />
      <MenuCard 
        title="Simulator" 
        desc="Interaktive Simulation des Replikationsprozesses Schritt für Schritt."
        icon={<Dna size={48} color={COLORS.secondary} />}
        onClick={() => setCurrentView(ViewState.SIMULATOR)}
      />
      <MenuCard 
        title="Leit- vs. Folgestrang" 
        desc="Warum ist die Synthese unterschiedlich? Der direkte Vergleich."
        icon={<GitCompare size={48} color={COLORS.secondary} />}
        onClick={() => setCurrentView(ViewState.COMPARISON)}
      />
      <MenuCard 
        title="Abschluss-Quiz" 
        desc="Teste dein Wissen zur DNA-Replikation."
        icon={<HelpCircle size={48} color={COLORS.secondary} />}
        onClick={() => setCurrentView(ViewState.QUIZ)}
      />
    </div>
  );

  const MenuCard = ({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-left border-l-4 group"
      style={{ borderLeftColor: COLORS.secondary }}
    >
      <div className="flex justify-between items-start mb-4">
        {icon}
        <div className="bg-gray-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
          <ArrowLeft className="rotate-180" size={20} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{title}</h3>
      <p className="text-[#34495E]">{desc}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#ECF0F1] font-sans text-[#34495E]">
      {/* Header */}
      <header className="bg-[#2C3E50] text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {currentView !== ViewState.HOME && (
                <button 
                  onClick={() => setCurrentView(ViewState.HOME)}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  aria-label="Zurück zur Übersicht"
                >
                    <ArrowLeft size={24} />
                </button>
             )}
             <div className="flex flex-col">
               <h1 className="text-lg md:text-xl font-bold leading-tight">DNA-Replikations-Simulator</h1>
               {currentView === ViewState.HOME && <span className="text-xs text-gray-400 font-normal hidden md:inline">Biologie Gymnasium Q11/12</span>}
             </div>
          </div>
          
          <button 
            onClick={() => setGlossaryOpen(true)}
            className="flex items-center gap-2 bg-[#16A085] hover:bg-[#1ABC9C] px-4 py-2 rounded-md transition-colors text-sm font-semibold shadow-md"
          >
            <Book size={18} /> <span className="hidden sm:inline">Glossar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        {currentView === ViewState.HOME && (
          <div className="text-center mb-10 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Willkommen!</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Entdecke, wie die genetische Information bei der Zellteilung verdoppelt wird. 
              Starte mit dem historischen Experiment oder tauche direkt in die Simulation ein.
            </p>
          </div>
        )}
        
        <div className="animate-fade-in-up">
           {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} BioLearn - DNA Replikation Educational Tool</p>
      </footer>

      {/* Glossary Overlay */}
      <Glossary isOpen={isGlossaryOpen} onClose={() => setGlossaryOpen(false)} />
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default App;