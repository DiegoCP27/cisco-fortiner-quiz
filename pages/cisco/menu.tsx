import { MenuContent } from "@/components/menu/Menu.component";
import { useRouter } from "next/router";
import { useState } from "react";

const MenuPage = () => {
  const router = useRouter();
  const [startQuestion, setStartQuestion] = useState(1);
  const [endQuestion, setEndQuestion] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialTime, setInitialTime] = useState(3600);

  const handleFullQuiz = () => {
    router.push(`/cisco/quiz?initialTime=${initialTime}`);
  };

  const handleRangeQuiz = () => {
    if (startQuestion >= endQuestion) {
      setErrorMessage("El valor inicial debe ser menor que el valor final");
    } else if (startQuestion <= 0 || endQuestion <= 0) {
      setErrorMessage("Ambos valores deben ser mayores que cero");
    } else {
      router.push(
        `/cisco/quiz?start=${startQuestion}&end=${endQuestion}&initialTime=${initialTime}`
      );
    }
  };

  return (
    <MenuContent
      startQuestion={startQuestion}
      setStartQuestion={setStartQuestion}
      endQuestion={endQuestion}
      setEndQuestion={setEndQuestion}
      errorMessage={errorMessage}
      initialTime={initialTime}
      setInitialTime={setInitialTime}
      handleFullQuiz={handleFullQuiz}
      handleRangeQuiz={handleRangeQuiz}
    />
  );
};

export default MenuPage;
