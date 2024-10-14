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
    const response = await fetch('https://flawless-mountainous-orangutan.glitch.me/send-notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumbers, currentQuestion: quizState.questions[quizState.currentQuestion] }),
    });    
    const data = await response.json();
    console.log('Mensagens enviadas:', data);
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
