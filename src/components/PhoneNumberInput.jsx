import React, { useState, useContext } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
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

  const handleSubmit = async () => {
    try {
      const validPhoneNumbers = phoneNumbers.filter(number => number !== '');
    
      for (let i = 0; i < validPhoneNumbers.length; i++) {
        const option = `Pessoa${i + 1}`;  // Associa cada número a uma alternativa
        await addDoc(collection(db, 'phoneNumbers'), {
          phoneNumber: validPhoneNumbers[i],
          option: option,  // Armazena a alternativa junto com o número
          fcmToken: token
        });
      }
  
      alert('Números de telefone enviados com sucesso!');
    
      dispatch({ type: "SEND_NOTIFICATIONS", payload: { phoneNumbers: validPhoneNumbers } });
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
