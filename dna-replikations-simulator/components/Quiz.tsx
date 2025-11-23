import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS, COLORS } from '../constants';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
    if (optionId === question.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">Quiz Ergebnis</h2>
        <div className="text-6xl font-bold mb-4" style={{ color: score > 7 ? COLORS.success : COLORS.helicase }}>
          {score} / {QUIZ_QUESTIONS.length}
        </div>
        <p className="text-xl mb-8">
          {score === 10 ? "🎉 Perfekt! Du bist ein DNA-Experte!" :
           score >= 7 ? "👍 Gut gemacht! Das meiste hast du verstanden." :
           "📚 Übung macht den Meister. Schau dir die Simulation nochmal an."}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw /> Quiz wiederholen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-gray-500">
        <span>Frage {currentQuestionIndex + 1} von {QUIZ_QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-[#16A085] h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-[#2C3E50] mb-6">{question.question}</h3>
        
        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === question.correctAnswer;
            
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (isAnswered) {
              if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-800";
              else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-50 text-red-800";
              else btnClass += "border-gray-100 opacity-50";
            } else {
              btnClass += "border-gray-200 hover:border-[#16A085] hover:bg-gray-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="font-bold mr-2">{option.id})</span> {option.text}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className={`p-4 rounded-lg mb-6 flex gap-4 ${selectedOption === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="mt-1">
            {selectedOption === question.correctAnswer ? <CheckCircle /> : <XCircle />}
          </div>
          <div>
            <div className="font-bold mb-1">
              {selectedOption === question.correctAnswer ? "Richtig!" : "Falsch!"}
            </div>
            <p>{selectedOption === question.correctAnswer ? question.feedbackCorrect : question.feedbackWrong}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`px-8 py-3 rounded-lg font-bold transition-colors ${
            isAnswered 
              ? 'bg-[#2C3E50] text-white hover:bg-[#34495E]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? "Ergebnis anzeigen" : "Nächste Frage"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;