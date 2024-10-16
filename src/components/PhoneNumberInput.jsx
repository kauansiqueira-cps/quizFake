import React, { useState, useContext } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from '../notifications/firebase'; // Certifique-se de ter a inicialização do Firebase
import { QuizContext } from '../context/quiz';
import "./PhoneNumberInput.css";

const db = getFirestore(app);

const PhoneNumberInput = () => {
  const [phoneNumbers, setPhoneNumbers] = useState(['', '', '', '']);
  const [quizState, dispatch] = useContext(QuizContext);

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };
  

  const handleSubmit = async () => {
    try {
      // Salvando cada número no Firestore
      for (let number of phoneNumbers) {
        if (number !== '') {
          await addDoc(collection(db, 'phoneNumbers'), {
            phoneNumber: number,
          });
        }
      }
      alert('Números de telefone enviados com sucesso!');
      dispatch({ type: "COLLECT_PHONE_NUMBERS", payload: phoneNumbers });

      // Chamar o backend (Firebase Functions ou outro) para enviar as alternativas
      await enviarMensagens(phoneNumbers);
    } catch (error) {
      console.error("Erro ao salvar números: ", error);
      alert('Erro ao enviar os números.');
    }
  };

  const enviarMensagens = async (phoneNumbers) => {
    dispatch({ type: "REORDER_QUESTIONS" });
    // Verifica se quizState e suas propriedades estão definidos
    if (!quizState || !quizState.questions || !quizState.questions.length) {
      console.error('O estado do quiz não está definido corretamente.');
      return;
    }
  
    // Verifica se currentQuestion é um índice válido
    if (quizState.currentQuestion < 0 || quizState.currentQuestion >= quizState.questions.length) {
      console.error('currentQuestion é um índice inválido.');
      return;
    }
    
   const currentQuestionIndex = quizState.currentQuestion;
   const currentQuestion = quizState.questions[currentQuestionIndex]; // Aqui você acessa a pergunta
    console.log('Pergunta atual:', currentQuestion); // Agora deve mostrar a pergunta específica
    console.log('Opções:', currentQuestion.options);  // Verifique as opções
    // Verifica se a pergunta atual possui opções
    console.log('currentQuestion', currentQuestion)
    console.log('currentQuestionQuestions', currentQuestion.questions)
    console.log('currentQuestionQuestionsOptions', currentQuestion.questions[currentQuestionIndex])
    console.log('currentQuestionQuestionsOptionsOptions', currentQuestion.questions[currentQuestionIndex].options)
    if (!currentQuestion.questions[currentQuestionIndex].options || currentQuestion.questions[currentQuestionIndex].options < 5) {
      console.error('A pergunta atual não possui opções suficientes.');
      return;
    }

    // Pegue as 4 primeiras alternativas
    const alternatives = currentQuestion.questions[currentQuestionIndex].options.slice(); 
  
    // Associa cada número a uma alternativa e uma pessoa (Pessoa 1, Pessoa 2, etc.)
    const messages = phoneNumbers.map((number, index) => ({
      phoneNumber: number,
      alternative: alternatives[index],
      person: `Pessoa ${index + 1}`
    }));

    console.log(messages);
  
    try {
      const response = await fetch('https://quizfake.glitch.me/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      console.log('Mensagens enviadas:', data);
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
    }
  };
  
  
  

  return (
    <div id="numero">
      <h1>Digite 4 números de telefone</h1>
      {phoneNumbers.map((phone, index) => (
        <input
          key={index}
          type="text"
          className='numero_input'
          placeholder="Digite o número de telefone"
          value={phone}
          onChange={(e) => handlePhoneChange(index, e.target.value)}
        />
      ))}
      <button onClick={handleSubmit}>Enviar Números</button>
    </div>
  );
};

export default PhoneNumberInput;
