/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useState } from "react";
import { parseCookies } from 'nookies';
import { destroyCookie } from 'nookies';

interface QuestionOption {
  answerByUser: null | string[];
}

export default function Home({ questions }: any) {
  const [currentQuestion = 0, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [percentageScore, setPercentageScore] = useState(0);
  const [answerResults, setAnswerResults] = useState(Array(questions.length).fill(null));
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleLogout = () => {
    // Borrar la cookie de sesión
    destroyCookie(null, 'token');
  
    // Redireccionar al usuario al login
    window.location.href = '/login';
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
    let updatedAnswerByUser: any = selectedOptions[currentQuestion]?.answerByUser;
  
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
    const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
    updatedAnswerResults[currentQuestion] = isCorrect;
    setAnswerResults(updatedAnswerResults);
    setSelectedAnswer(updatedAnswerByUser);
  };  
  
  const handleSubmitButton = () => {
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      const correctAnswers = questions[i].answerOptions
        .filter((answer: any) => answer.isCorrect)
        .map((answer: any) => answer.answer)
        .sort();
      const userAnswers: any = Array.isArray(selectedOptions[i]?.answerByUser)
        ? selectedOptions[i]?.answerByUser
        : [selectedOptions[i]?.answerByUser];
  
      const isCorrect =
        JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(correctAnswers.sort());
  
      if (isCorrect) {
        newScore += 1;
      }
    }
    setScore(newScore);
    setPercentageScore((newScore / questions.length) * 100);
    setShowScore(true);
  };
  


  return (
    <div className="todo">
      <div className="container">
        <Head>
          <title>Quiz App</title>
        </Head>
        {showScore ? (
          <>
            <h1 className="h1">
              Tu puntaje es {percentageScore}%
            </h1>
            <h1 className="h1">
              {score} de {questions.length} correctas.
            </h1>
            <div className="button-wrapper">
              <button className="restart-button" onClick={() => window.location.reload()}>
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
                  <img src={questions[currentQuestion].imagen} className="img_width" alt="..." />
                </div>
              )}
            </div>
            <div className="answer-options">
            {questions[currentQuestion]?.answerOptions.map((answer: any, index: any) => {
              const multipleSelection = questions[currentQuestion].opcionMultiple;
              const isSelected = multipleSelection
                ? selectedOptions[currentQuestion]?.answerByUser?.includes(answer.answer)
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
                    <p className="answer-text">{answer.answer}</p>
                  </label>
                </div>
              );
            })}
            </div>
            <div className="button-wrapper">
              <button
                onClick={handlePrevious}
                className="previous-button"
              >
                Anterior
              </button>
              <button
                onClick={
                  currentQuestion + 1 === questions.length
                    ? handleSubmitButton
                    : handleNext
                }
                className={currentQuestion + 1 === questions.length ? "submit-button" : "next-button"}
                disabled={!selectedOptions[currentQuestion]}
              >
                {currentQuestion + 1 === questions.length ? "Resultado" : "Siguiente"}
              </button>
              <button className="logoutbtn" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}  

export async function getServerSideProps(context: any) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  // Si no hay token, redirige al usuario a la página de inicio de sesión
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Si el token es válido, obtén las preguntas y devuélvelas al componente
    const res = await fetch('https://strapi-production-5785.up.railway.app/api/preguntas?populate=*', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await res.json();
    const questions = response.data.map((question: any) => {
      return {
        question: question.attributes.pregunta,
        opcionMultiple: question.attributes.opcionMultiple,
        imagen: question.attributes.imagen?.data?.attributes?.url || null,
        answerOptions: question.attributes.respuestaOpcion.map((option: any) => {
          return {
            isCorrect: option.isCorrect,
            answer: option.respuesta,
          };
        }),
      };
    });

    return {
      props: {
        questions
      },
    };
  } catch {
    // Si el token no es válido, redirige al usuario a la página de inicio de sesión
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}