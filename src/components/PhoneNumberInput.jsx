import React, { useState, useContext } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from '../notifications/firebase';
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

  // Função para obter o token do FCM
  const getFcmToken = async () => {
    try {
      const messaging = getMessaging(app);
      const currentToken = await getToken(messaging, { vapidKey: 'BPEFrQ83XPvmUsz0GwQn6CCkQH24xEEn9t0uiuAUrqaiRJyjqOwSf-S-pruArYkCNTmqJv2qpDQbbZjzAe4kx4I' });

      if (currentToken) {
        return currentToken;
      } else {
        console.log('Nenhum token de registro disponível. Solicite permissão para gerar um token.');
      }
    } catch (error) {
      console.error('Erro ao obter o token FCM', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await getFcmToken();  // Obtenha o token de FCM
  
      if (token) {
        for (let i = 0; i < phoneNumbers.length; i++) {
          const option = `Pessoa${i + 1}`;  // Associa cada número a uma alternativa
          await addDoc(collection(db, 'phoneNumbers'), {
            phoneNumber: phoneNumbers[i],  // Usa cada número de telefone do estado
            option: option,  // Armazena a alternativa junto com o número
            fcmToken: token  // Armazena o token de FCM
          });
        }
      
        alert('Números de telefone enviados com sucesso!');
        dispatch({ type: "SEND_NOTIFICATIONS", payload: { phoneNumbers: phoneNumbers } });
      } else {
        alert('Falha ao obter o token de notificação.');
      }
    } catch (error) {
      console.error("Erro ao salvar números: ", error);
      alert('Erro ao enviar os números.');
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
