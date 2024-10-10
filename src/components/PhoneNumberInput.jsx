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
      // Salvando cada número no Firestore
      for (let number of phoneNumbers) {
        if (number !== '') {
          await addDoc(collection(db, 'phoneNumbers'), {
            phoneNumber: number,
          });
        }
      }
      alert('Números de telefone enviados com sucesso!');
      
      dispatch({ type: "COLLECT_PHONE_NUMBERS" });
      console.log("Novo estado após coleta:", quizState); // Verifique o estágio atual

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
