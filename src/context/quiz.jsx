import { createContext, useReducer } from "react";
import questions from "../data/questions_complete";

const STAGES = ["Start", "Category", "PhoneNumber", "Playing", "End"];

const initialState = {
  gameStage: STAGES[0],
  questions,
  currentQuestion: 0,
  answerSelected: false,
  score: 0,
  help: false,
  optionToHide: null,
};

console.log(initialState);

const quizReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_STAGE":
      return {
        ...state,
        gameStage: STAGES[1], // Vai para a escolha de categoria
      };

    case "START_GAME":
      return {
        ...state,
        gameStage: STAGES[2], // Vai para a tela de coleta de números
      };

    case "COLLECT_PHONE_NUMBERS": 
      let quizQuestions = null;

      // Encontra as perguntas da categoria
      state.questions.forEach((question) => {
        if (question.category === action.payload) {
          quizQuestions = question.questions;
        }
      });

      if (!quizQuestions) {
        return {
          ...state,
          gameStage: STAGES[0], // Volta para o início se não encontrar perguntas
        };
      }

      // Embaralha as perguntas e limita a 5
      const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

      return {
        ...state,
        questions: shuffledQuestions,
        gameStage: STAGES[3], // Agora começa o jogo
      };

    case "REORDER_QUESTIONS":
      const reorderedQuestions = state.questions.sort(() => {
        return Math.random() - 0.5;
      });

      return {
        ...state,
        questions: reorderedQuestions,
      };

    case "CHANGE_QUESTION": {
      const nextQuestion = state.currentQuestion + 1;
      let endGame = false;

      if (!state.questions[nextQuestion]) {
        endGame = true;
      }

      return {
        ...state,
        currentQuestion: nextQuestion,
        gameStage: endGame ? STAGES[4] : state.gameStage,
        answerSelected: false,
        help: false,
      };
    }

    case "NEW_GAME": {
      return initialState;
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
      const questionWithoutOption = state.questions[state.currentQuestion];

      let repeat = true;
      let optionToHide;

      questionWithoutOption.options.forEach((option) => {
        if (option !== questionWithoutOption.answer && repeat) {
          optionToHide = option;
          repeat = false;
        }
      });

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


export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(quizReducer, initialState);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
