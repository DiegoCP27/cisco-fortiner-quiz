export type MenuContentProps = {
  startQuestion: number;
  setStartQuestion: (value: number) => void;
  endQuestion: number;
  setEndQuestion: (value: number) => void;
  errorMessage: string;
  initialTime: number;
  setInitialTime: (value: number) => void;
  handleFullQuiz: () => void;
  handleRangeQuiz: () => void;
};