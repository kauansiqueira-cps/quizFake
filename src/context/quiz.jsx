// quiz.jsx ou no seu arquivo de contexto
import React, { createContext, useReducer } from "react";
import questions from "../data/questions_complete"; // Ajuste o caminho conforme necessário

const initialState = {
  questions: questions, // Carrega as perguntas na inicialização
  currentQuestion: 0,
  answerSelected: false,
  help: false,
  score: 0,
  optionToHide: null,
  gameStage: "Start",
};


const QuizContext = createContext();

const STAGES = ["Start", "Category", "PhoneNumber", "Playing", "End"];

const quizReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_STAGE":
      // Verifica se o array de perguntas tem elementos antes de embaralhar
      if (!state.questions || state.questions.length === 0) {
        console.error("Nenhuma pergunta disponível.");
        return state;
      }

      const shuffledQuestions = state.questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      return {
        ...state,
        questions: shuffledQuestions,
        gameStage: STAGES[2], // Vai para a fase de coleta de números
      };

    case "REORDER_QUESTIONS":
      const reorderedQuestions = state.questions.sort(() => {
        return Math.random() - 0.5;
      });

      return {
        ...state,
        questions: reorderedQuestions,
      };

    case "START_GAME":
      // Mudando para a fase de "PhoneNumber"
      return {
        ...state,
        gameStage: STAGES[2], // Vai para a fase de coleta de números
      };

    case "COLLECT_PHONE_NUMBERS":
      // Quando os números forem coletados, inicia o jogo
      return {
        ...state,
        gameStage: STAGES[3], // Vai para a fase de "Playing"
      };
    case "NEW_GAME": {
      console.log(questions);
      console.log(initialState);
      return initialState;
    }
    case "CHANGE_QUESTION": {
      const nextQuestion = state.currentQuestion + 1;

      // Verifica se ainda existem perguntas
      if (nextQuestion >= state.questions.length) {
        return {
          ...state,
          gameStage: STAGES[4], // Finaliza o jogo se não houver mais perguntas
        };
      }

      return {
        ...state,
        currentQuestion: nextQuestion,
        answerSelected: false,
        help: false,
      };
    }


    case "CHECK_ANSWER": {
      if (state.answerSelected) return state;

      const answer = action.payload.answer;
      const option = action.payload.option;
      let correctAnswer = 0;

      if (answer === option) correctAnswer = 1;

      return {
        ...state,
        score: state.score + correctAnswer,
        answerSelected: option,
      };
    }

    case "SHOW_TIP": {
      return {
        ...state,
        help: "tip",
      };
    }

    case "REMOVE_OPTION": {
      const question = state.questions[state.currentQuestion];
      const options = question.options.filter(opt => opt !== question.answer);
      const optionToHide = options[Math.floor(Math.random() * options.length)];

      return {
        ...state,
        optionToHide,
        help: true,
      };
    }

    default:
      return state;
  }
};


export const QuizProvider = ({ children }) => {
  const [quizState, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={[quizState, dispatch]}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };
