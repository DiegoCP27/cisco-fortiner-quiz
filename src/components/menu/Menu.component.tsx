import { MenuContentProps } from "@/models";
import styles from "@styles/menu.module.scss";

export const MenuContent = ({
  startQuestion,
  setStartQuestion,
  endQuestion,
  setEndQuestion,
  errorMessage,
  initialTime,
  setInitialTime,
  handleFullQuiz,
  handleRangeQuiz,
}: MenuContentProps) => {
  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <h1>Menú</h1>
        <button onClick={handleFullQuiz}>Quiz completo</button>
        <div>
          <label>
            <p>Rango de preguntas:</p>
            <div className={styles.range}>
              <input
                type="number"
                value={startQuestion}
                onChange={(e) => setStartQuestion(Number(e.target.value))}
              />
              <span className={styles.separator}>-</span>
              <input
                type="number"
                value={endQuestion}
                onChange={(e) => setEndQuestion(Number(e.target.value))}
              />
            </div>
          </label>
          <span className={styles.errorMessage}>{errorMessage}</span>
        </div>
        <button onClick={handleRangeQuiz}>Quiz con rango</button>
        <div className={styles.initialTime}>
          <p>Tiempo inicial:</p>
          <div className={styles.radio}>
            <label>
              <input
                type="radio"
                name="initialTime"
                value={3600}
                checked={initialTime === 3600}
                onChange={(e) => setInitialTime(Number(e.target.value))}
              />
              1 hora
            </label>
            <label>
              <input
                type="radio"
                name="initialTime"
                value={7200}
                checked={initialTime === 7200}
                onChange={(e) => setInitialTime(Number(e.target.value))}
              />
              2 horas
            </label>
            <label>
              <input
                type="radio"
                name="initialTime"
                value={10800}
                checked={initialTime === 10800}
                onChange={(e) => setInitialTime(Number(e.target.value))}
              />
              3 horas
            </label>
            <label>
              <input
                type="radio"
                name="initialTime"
                value={999999}
                checked={initialTime === 999999}
                onChange={(e) => setInitialTime(Number(e.target.value))}
              />
              Ilimitado
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
