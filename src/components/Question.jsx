import { useContext } from "react";
import { QuizContext } from "../context/quiz";
import Option from "./Option";
import "./Question.css";

const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  // Se o jogo terminou, exibir o placar final
  if (quizState.gameStage === "End") {
    return (
      <div id="end-screen">
        <h2>Fim do Quiz!</h2>
        <p>Você acertou {quizState.score} de {quizState.questions.length} perguntas!</p>
        <button onClick={() => window.location.reload()} className="next-question-btn">
          Jogar Novamente
        </button>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const pessoas = ["Pessoa 1", "Pessoa 2", "Pessoa 3", "Pessoa 4"];

  const selectOption = (selectedOption) => {
    const correctAnswerIndex = currentQuestion.options.indexOf(currentQuestion.answer);
    const isCorrect = selectedOption === `Pessoa ${correctAnswerIndex + 1}`;

    // Atualiza o estado do quiz
    dispatch({
      type: "CHECK_ANSWER",
      payload: { option: selectedOption, answer: currentQuestion.answer }
    });
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      dispatch({ type: "CHANGE_QUESTION" });
    } else {
      dispatch({ type: "END_GAME" });
    }
  };

  console.log(currentQuestion)
  return (
    <div id="question">
      {/* <p>Pergunta {quizState.currentQuestion + 1} de {quizState.questions.length}</p> */}
      <h2>{currentQuestion.question}</h2>
      <div id="options-container">
        {pessoas.map((pessoa, index) => (
          <Option
            option={pessoa}
            key={index}
            answer={currentQuestion.answer}
            selectOption={() => selectOption(currentQuestion.options[index])}
          />
        ))}
      </div>

      {quizState.answerSelected && (
        <div className={`result ${quizState.isCorrect ? "correct" : "wrong"}`}>
          {quizState.isCorrect ? "Você acertou!" : "Você errou!"}
        </div>
      )}
      

      {/* <button onClick={nextQuestion} className="next-question-btn">Próxima Pergunta</button> */}
    </div>
  );
};

export default Question;
