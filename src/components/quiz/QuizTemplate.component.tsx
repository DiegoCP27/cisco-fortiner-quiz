/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import {
  handleFinishQuiz,
  handlePrevious,
  handleNext,
  handleAnswerOption,
} from "@/utils";
import { useState } from "react";
import { QuestionOptionProps } from "@/models";
import Router from "next/router";
import { CountdownTimer } from "@/components";

type QuizProps = {
  questions: any[];
  menuLink: string
};

export default function Quiz({ questions, menuLink }: QuizProps) {
  const [currentQuestion = 0, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOptionProps[]>(
    []
  );
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [percentageScore, setPercentageScore] = useState(0);
  const [answerResults, setAnswerResults] = useState(
    Array(questions.length).fill(null)
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const initialTime = Number(Router.query.initialTime);

  return (
    <div className="todo">
      <div className="container">
        <Head>
          <title>Quiz App</title>
        </Head>
        {showScore ? (
          <>
            <h1 className="h1">Tu puntaje es {percentageScore}%</h1>
            <h1 className="h1">
              {score} de {questions.length} correctas.
            </h1>
            <div className="button-wrapper">
              <button
                className="restart-button"
                onClick={() => Router.push(`/${menuLink}/menu`)}
              >
                Volver al Menú
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="question">
              <div className="question-timer">
                <h4 className="h4">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </h4>
                <CountdownTimer
                  initialTime={initialTime}
                  onFinish={() =>
                    handleFinishQuiz(
                      questions,
                      selectedOptions,
                      setScore,
                      setPercentageScore,
                      setShowScore
                    )
                  }
                />
              </div>
              <div className="question-text">
                {questions[currentQuestion]?.question}
              </div>
              {questions[currentQuestion]?.imagen && (
                <div className="imagenes">
                  <img
                    src={questions[currentQuestion].imagen}
                    className="img_width"
                    alt="..."
                  />
                </div>
              )}
            </div>
            <div className="answer-options">
              {questions[currentQuestion]?.answerOptions.map(
                (answer: any, index: any) => {
                  const multipleSelection =
                    questions[currentQuestion].opcionMultiple;
                  const isSelected = multipleSelection
                    ? selectedOptions[currentQuestion]?.answerByUser?.includes(
                        answer.answer
                      )
                    : answer.answer === selectedAnswer;
                  const isCorrect = answer.isCorrect;

                  return (
                    <div
                      key={index}
                      className={`answer-option ${
                        showAnswers
                          ? isCorrect
                            ? "correct"
                            : isSelected
                            ? "incorrect"
                            : ""
                          : ""
                      }`}
                    >
                      <label className="answer-label">
                        <input
                          type={multipleSelection ? "checkbox" : "radio"}
                          name={`answer${currentQuestion}`}
                          value={answer.answer}
                          checked={isSelected}
                          onChange={(e) =>
                            handleAnswerOption(
                              answer.answer,
                              multipleSelection,
                              currentQuestion,
                              selectedOptions,
                              setSelectedOptions,
                              answerResults,
                              setAnswerResults,
                              setSelectedAnswer,
                              questions
                            )
                          }
                          className="radio"
                        />
                        <ReactMarkdown
                          className="answer-text"
                          remarkPlugins={[remarkGfm]}
                          transformLinkUri={() => "#"}
                        >
                          {answer.answer}
                        </ReactMarkdown>
                      </label>
                    </div>
                  );
                }
              )}
            </div>
            <div className="button-wrapper">
              {currentQuestion > 0 && (
                <button
                  onClick={() =>
                    handlePrevious(currentQuestion, setCurrentQuestion)
                  }
                  className="previous"
                >
                  Anterior
                </button>
              )}
              {currentQuestion < questions.length - 1 && (
                <button
                  onClick={() =>
                    handleNext(
                      currentQuestion,
                      setCurrentQuestion,
                      selectedOptions,
                      setSelectedOptions,
                      setShowAnswers,
                      questions,
                      selectedAnswer,
                      setSelectedAnswer
                    )
                  }
                  className="previous"
                >
                  Siguiente
                </button>
              )}
              <button
                onClick={() =>
                  handleFinishQuiz(
                    questions,
                    selectedOptions,
                    setScore,
                    setPercentageScore,
                    setShowScore
                  )
                }
                className="logoutbtn"
              >
                Finalizar Quiz
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}