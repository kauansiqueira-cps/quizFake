import { createContext, useReducer } from "react";
import questions from "../data/questions_complete";

const STAGES = ["Start", "PhoneNumber", "Category", "Playing", "End"];

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
    
    case "COLLECT_PHONE_NUMBERS":
      // Quando os números forem coletados, inicia o jogo
      return {
        ...state,
        gameStage: STAGES[2], // Vai para a fase de "Playing"
      };
      
    case "CHANGE_STAGE":
      return {
        ...state,
        gameStage: STAGES[1],
      };

      case "START_GAME":
        let quizQuestions = null;
      
        // Encontra as perguntas da categoria
        state.questions.forEach((question) => {
          if (question.category === action.payload) {
            quizQuestions = question.questions;
          }
        });
      
        // Embaralha as perguntas e limita a 5
        const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
      
        return {
          ...state,
          questions: shuffledQuestions,
          gameStage: STAGES[3],
        };

    case "REORDER_QUESTIONS":
      const reorderedQuestions = state.questions.sort(() => {
        return Math.random() - 0.5;
      });

      return {
        ...state,
        questions: reorderedQuestions,
      };

      case "CHECK_ANSWER": {
        const { option, answer } = action.payload;
  
        // Verifica se a resposta selecionada está correta
        console.log("Opção:", option )
        console.log("Resposta:", answer )
        const isCorrect = option === answer;
        const scoreIncrement = isCorrect ? 1 : 0;
  
        return {
          ...state,
          answerSelected: option,  // Marca a opção selecionada
          isCorrect,  // Armazena se a resposta está correta
          score: state.score + scoreIncrement,  // Incrementa o score se a resposta estiver correta
        };
      }
  
      case "CHANGE_QUESTION": {
        const nextQuestion = state.currentQuestion + 1;
        if(nextQuestion >= 5){
          return {gameStage: STAGES[4]}
        }
        return {
          ...state,
          currentQuestion: nextQuestion,  // Atualiza para a próxima pergunta
          answerSelected: false,  // Reseta a seleção de resposta
          isCorrect: null,  // Reseta o status de correção
          
        };
        
      }

    case "NEW_GAME": {
      console.log(questions);
      console.log(initialState);
      return initialState;
    }

    

    case "SHOW_TIP": {
      return {
        ...state,
        help: "tip",
      };
    }

    case "REMOVE_OPTION": {
      const questionWithoutOption = state.questions[state.currentQuestion];

      console.log(state.currentQuestion);

      console.log(questionWithoutOption);

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