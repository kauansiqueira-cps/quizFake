import { useContext } from "react";
import { QuizContext } from "./context/quiz";

import Welcome from "./components/Welcome";
import PickCategory from "./components/PickCategory";
import PhoneNumberInput from "./components/PhoneNumberInput";
import Question from "./components/Question";
import GameOver from "./components/GameOver";

import "./App.css";

function App() {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <div className="App">
      <h1>Só faltam as asas ?</h1>
      {quizState.gameStage === "Start" && <Welcome />}
      {quizState.gameStage === "Category" && <PickCategory />}
      {quizState.gameStage === "PhoneNumber" && <PhoneNumberInput />}
      {quizState.gameStage === "Playing" && <Question />}
      {quizState.gameStage === "End" && <GameOver />}
      {!["Start", "Category", "PhoneNumber", "Playing", "End"].includes(quizState.gameStage) && (
        <p>Erro: Etapa desconhecida do jogo.</p>
      )}
    </div>
  );
}

export default App;
