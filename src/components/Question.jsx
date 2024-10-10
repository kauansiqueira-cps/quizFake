import { useContext } from "react";
import { QuizContext } from "../context/quiz";
import Option from "./Option";
import "./Question.css";

const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  // Verifique se as perguntas existem e se a pergunta atual está definida
  if (!quizState.questions || quizState.questions.length === 0) {
    return <p>Carregando perguntas...</p>;
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];

  // Verifique se a pergunta atual existe e tem opções
  if (!currentQuestion || !currentQuestion.options) {
    return <p>Carregando pergunta atual...</p>;
  }

  const onSelectOption = (option) => {
    dispatch({
      type: "CHECK_ANSWER",
      payload: { answer: currentQuestion.answer, option },
    });
  };

  console.log(quizState.optionToHide);

  return (
    <div id="question">
      <p>
        Pergunta {quizState.currentQuestion + 1} de {quizState.questions.length}
      </p>
      <h2>{currentQuestion.question}</h2>
      <div id="options-container">
        {currentQuestion.options.map((option, index) => (
          <Option
            option={option}
            key={index} // Usar o index como key é seguro aqui
            answer={currentQuestion.answer}
            selectOption={() => onSelectOption(option)}
            hide={quizState.optionToHide === option ? "hide" : null}
          />
        ))}
      </div>
      {!quizState.answerSelected && !quizState.help && (
        <>
          {currentQuestion.tip && (
            <button onClick={() => dispatch({ type: "SHOW_TIP" })}>Dica</button>
          )}
          <button onClick={() => dispatch({ type: "REMOVE_OPTION" })}>
            Excluir uma
          </button>
        </>
      )}
      {!quizState.answerSelected && quizState.help === "tip" && (
        <p>{currentQuestion.tip}</p>
      )}
      {quizState.answerSelected && (
        <button onClick={() => dispatch({ type: "CHANGE_QUESTION" })}>
          Continuar
        </button>
      )}
    </div>
  );
};

export default Question;
