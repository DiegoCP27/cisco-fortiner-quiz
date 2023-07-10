import { QuestionOptionProps } from "@/models";

export const handleFinishQuiz = (
  questions: any[],
  selectedOptions: QuestionOptionProps[],
  setScore: (value: number) => void,
  setPercentageScore: (value: number) => void,
  setShowScore: (value: boolean) => void
): void => {
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

export const handlePrevious = (
  currentQuestion: number,
  setCurrentQuestion: (value: number) => void
) => {
  const prevQues = currentQuestion - 1;
  prevQues >= 0 && setCurrentQuestion(prevQues);
};

export const handleNext = (
  currentQuestion: number,
  setCurrentQuestion: (value: number) => void,
  selectedOptions: QuestionOptionProps[],
  setSelectedOptions: (value: QuestionOptionProps[]) => void,
  setShowAnswers: (value: boolean) => void,
  questions: any[],
  selectedAnswer: any,
  setSelectedAnswer: (value: any) => void
) => {
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

export const handleAnswerOption = (
  answer: any,
  multipleSelection: boolean,
  currentQuestion: number,
  selectedOptions: QuestionOptionProps[],
  setSelectedOptions: (value: QuestionOptionProps[]) => void,
  answerResults: boolean[],
  setAnswerResults: (value: boolean[]) => void,
  setSelectedAnswer: (value: any) => void,
  questions: any[]
) => {
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
  const isCorrect =
    JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
  updatedAnswerResults[currentQuestion] = isCorrect;
  setAnswerResults(updatedAnswerResults);
  setSelectedAnswer(updatedAnswerByUser);
};
