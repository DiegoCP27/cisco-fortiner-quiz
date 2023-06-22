/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useState } from "react";
import { parseCookies } from "nookies";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

interface QuestionOption {
  answerByUser: null | string[];
}

export default function Home({ questions }: any) {
  const [currentQuestion = 0, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [percentageScore, setPercentageScore] = useState(0);
  const [answerResults, setAnswerResults] = useState(
    Array(questions.length).fill(null)
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleFinishQuiz = (): void => {
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      const correctAnswers: string[] = questions[i].answerOptions
        .filter((answer: { isCorrect: boolean }) => answer.isCorrect)
        .map((answer: { answer: string }) => answer.answer)
        .sort();

      const userAnswers: any = Array.isArray(selectedOptions[i]?.answerByUser)
        ? selectedOptions[i]?.answerByUser
        : selectedOptions[i]?.answerByUser !== null
        ? [selectedOptions[i]?.answerByUser]
        : null;

      const isCorrect: boolean =
        userAnswers !== null &&
        JSON.stringify(userAnswers.sort()) ===
          JSON.stringify(correctAnswers.sort());

      if (isCorrect) {
        newScore += 1;
      }
    }
    setScore(newScore);
    const percentage = ((newScore / questions.length) * 100).toFixed(2);
    setPercentageScore(Number(percentage));
    setShowScore(true);
  };

  const handlePrevious = () => {
    const prevQues = currentQuestion - 1;
    prevQues >= 0 && setCurrentQuestion(prevQues);
  };

  const handleNext = () => {
    const nextQues = currentQuestion + 1;
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestion] = { answerByUser: selectedAnswer };
    setSelectedOptions(updatedOptions);
    setShowAnswers(true);
    nextQues < questions.length &&
      setTimeout(() => {
        setCurrentQuestion(nextQues);
        setShowAnswers(false);
        setSelectedAnswer(null);
      }, 1000);
  };

  const handleAnswerOption = (answer: any, multipleSelection: boolean) => {
    let updatedAnswerByUser: any =
      selectedOptions[currentQuestion]?.answerByUser;

    if (multipleSelection) {
      if (!updatedAnswerByUser) {
        updatedAnswerByUser = [answer];
      } else if (Array.isArray(updatedAnswerByUser)) {
        if (updatedAnswerByUser.includes(answer)) {
          updatedAnswerByUser = updatedAnswerByUser.filter(
            (item: any) => item !== answer
          );
        } else {
          updatedAnswerByUser = [...updatedAnswerByUser, answer];
        }
      }
    } else {
      updatedAnswerByUser = answer;
    }

    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestion] = { answerByUser: updatedAnswerByUser };
    setSelectedOptions(updatedOptions);

    const updatedAnswerResults = [...answerResults];
    const correctAnswers = questions[currentQuestion].answerOptions
      .filter((a: { isCorrect: any }) => a.isCorrect)
      .map((a: { answer: any }) => a.answer)
      .sort();
    const userAnswers = multipleSelection
      ? updatedAnswerByUser.sort()
      : [updatedAnswerByUser];
    const isCorrect =
      JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
    updatedAnswerResults[currentQuestion] = isCorrect;
    setAnswerResults(updatedAnswerResults);
    setSelectedAnswer(updatedAnswerByUser);
  };

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
                onClick={() => window.location.reload()}
              >
                Reiniciar Quiz
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="question">
              <h4 className="h4">
                Pregunta {currentQuestion + 1} de {questions.length}
              </h4>
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
                            handleAnswerOption(answer.answer, multipleSelection)
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
                <button onClick={handlePrevious} className="previous">
                  Anterior
                </button>
              )}
              {currentQuestion < questions.length - 1 && (
                <button onClick={handleNext} className="previous">
                  Siguiente
                </button>
              )}
                <button
                  onClick={handleFinishQuiz}
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

export async function getServerSideProps(context: any) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  // Si no hay token, redirige al usuario a la página de inicio de sesión
  if (!token) {
    return {
      redirect: {
        destination: "/fortinet/login",
        permanent: false,
      },
    };
  }

  try {
    // Si el token es válido, obtén las preguntas y devuélvelas al componente
    const res = await fetch(
      "https://strapi-production-d5a4.up.railway.app/api/preguntas?populate=*&sort[0]=id",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await res.json();
    const questions = response.data.map((question: any) => {
      return {
        question: question.attributes.pregunta,
        opcionMultiple: question.attributes.opcionMultiple,
        imagen: question.attributes.imagen?.data?.attributes?.url || null,
        answerOptions: question.attributes.respuestaOpcion.map(
          (option: any) => {
            return {
              isCorrect: option.isCorrect,
              answer: option.respuesta,
            };
          }
        ),
      };
    });

    return {
      props: {
        questions,
      },
    };
  } catch {
    // Si el token no es válido, redirige al usuario a la página de inicio de sesión
    return {
      redirect: {
        destination: "/fortinet/login",
        permanent: false,
      },
    };
  }
}
