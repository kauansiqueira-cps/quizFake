// quiz.jsx ou no seu arquivo de contexto
import React, { createContext, useReducer } from "react";
import questions from "../data/questions_complete"; // Ajuste o caminho conforme necessário
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging"; // Importar o FCM
import { app } from '../notifications/firebase';

const db = getFirestore(app); // Inicializando o Firestore


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
    case "SEND_NOTIFICATIONS":
      const phoneNumbers = action.payload.phoneNumbers;
      const alternative = getRandomAlternative(state.questions); // Pega uma alternativa aleatória

      // Função fictícia para enviar notificação via Firebase
      sendNotifications(phoneNumbers, alternative);

      return {
        ...state,
        gameStage: STAGES[3], // Vai para a fase de Playing
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
    case "NEW_GAME":
      console.log(questions);
      console.log(initialState);
      return initialState;

    case "CHANGE_QUESTION":
      const nextQuestion = state.currentQuestion + 1;

      const correctPerson = state.questions[nextQuestion]?.correctPerson;

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
        correctPerson: correctPerson,  // Atualiza a pessoa correta
        answerSelected: false,
        help: false,
      };



    case "CHECK_ANSWER":
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


    case "SHOW_TIP":
      return {
        ...state,
        help: "tip",
      };


    case "REMOVE_OPTION":
      const question = state.questions[state.currentQuestion];
      const options = question.options.filter(opt => opt !== question.answer);
      const optionToHide = options[Math.floor(Math.random() * options.length)];

      return {
        ...state,
        optionToHide,
        help: true,
      };


    default:
      return state;
  }
};

function getRandomAlternative(questions) {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const randomAlternative = randomQuestion.options[Math.floor(Math.random() * randomQuestion.options.length)];
  return randomAlternative;
}

async function sendNotifications(phoneNumbers, alternatives) {
  const messaging = getMessaging();

  for (let i = 0; i < phoneNumbers.length; i++) {
    const number = phoneNumbers[i];
    const alternative = alternatives[i]; // Cada pessoa recebe uma alternativa diferente

    try {
      const token = await getUserTokenByPhoneNumber(number); // Obtém o token pelo número

      if (token) {
        // Configuração da notificação
        const message = {
          notification: {
            title: "Pergunta do Quiz",
            body: `Sua alternativa é: ${alternative}`
          },
          token: token,
        };

        // Envio da mensagem
        await messaging.send(message);
        console.log(`Notificação enviada com sucesso para: ${number}`);
      } else {
        console.error(`Token não encontrado para o número: ${number}`);
      }
    } catch (error) {
      console.error(`Erro ao enviar notificação para ${number}:`, error);
    }
  }
}

// Função fictícia para buscar o token FCM pelo número de telefone
async function getUserTokenByPhoneNumber(phoneNumber) {
  try {
    const q = query(
      collection(db, "phoneNumbers"),
      where("phoneNumber", "==", phoneNumber)
    );

    const querySnapshot = await getDocs(q);

    // Verificar se há algum documento retornado
    if (querySnapshot.empty) {
      console.error(`Nenhum token encontrado para o número: ${phoneNumber}`);
      return null; // Ou lidar com o erro de outra forma
    }

    // Assumindo que cada número tem um único token associado
    let token = null;
    querySnapshot.forEach((doc) => {
      token = doc.data().fcmToken;
    });

    return token;
  } catch (error) {
    console.error("Erro ao buscar o token FCM:", error);
    return null;
  }
}
async function savePhoneNumberWithToken(phoneNumber) {
  try {
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging, { vapidKey: "BPEFrQ83XPvmUsz0GwQn6CCkQH24xEEn9t0uiuAUrqaiRJyjqOwSf-S-pruArYkCNTmqJv2qpDQbbZjzAe4kx4I" });

    if (fcmToken) {
      await addDoc(collection(db, 'phoneNumbers'), {
        phoneNumber: phoneNumber,
        fcmToken: fcmToken
      });
      console.log("Número de telefone e token FCM salvos com sucesso.");
    } else {
      console.error("Não foi possível obter o token FCM.");
    }
  } catch (error) {
    console.error("Erro ao salvar número e token FCM:", error);
  }
}

export const QuizProvider = ({ children }) => {
  const [quizState, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={[quizState, dispatch]}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };
