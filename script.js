const answersField = (() => {
  let fieldArray = [];

  const getCell = (index) => fieldArray[index];
  const setCell = (value) => fieldArray.push(value);
  const freeCell = () => fieldArray.pop();
  const checkArray = (value) => fieldArray.includes(value);
  const shuffle = () => {
    for (let i = fieldArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [fieldArray[i], fieldArray[j]] = [fieldArray[j], fieldArray[i]];
    }
  };
  const clearArray = () => (fieldArray = []);

  return {
    getCell,
    setCell,
    checkArray,
    shuffle,
    freeCell,
    clearArray,
  };
})();

const gameMaster = (() => {
  let answer;
  let score = 0;
  let hearts = "♥ ♥ ♥";
  let combo = 0;
  const getAnswer = () => answer;
  const setAnswer = (value) => (answer = value);
  const generator = (max) => Math.floor(Math.random() * max) + 1;
  const getScore = () => score;
  const incScore = () => score++;
  const incCombo = () => {
    if (combo == 3) {
      combo = 0;
      incHearts();
    } else combo++;
  };
  const getHearts = () => hearts;
  const decHearts = () => (hearts = hearts.slice(2));
  const incHearts = () => {
    if (hearts.length != 3) hearts += " ♥";
  };
  const generateTask = () => {
    answersField.clearArray();
    let task;
    let num1 = generator(9);
    let num2 = generator(9);
    let curAnsw = num1 * num2;
    if (generator(2) == 1) {
      [curAnsw, num1] = [num1, curAnsw];
      task = `${num1} ÷ ${num2}`;
    } else {
      task = `${num1} × ${num2}`;
    }
    setAnswer(curAnsw);
    answersField.setCell(getAnswer());
    return task;
  };
  const generateVariants = () => {
    for (let i = 1; i < 12; i++) {
      let value = generator(getAnswer() + 10);
      do {
        value = generator(getAnswer() + 15);
      } while (answersField.checkArray(value));
      answersField.setCell(value);
    }
  };
  const checkAnswer = (variant) => {
    if (getAnswer() == variant.textContent) {
      incScore();
      incCombo();
      console.log(combo);
      visualMaster.showTask();
    } else {
      combo = 0;
      decHearts();
      getHearts() ? visualMaster.mistake(variant) : restartGame();
    }
  };
  const restartGame = () => {
    score = 0;
    hearts = "♥ ♥ ♥";
    visualMaster.showTask();
  };
  return {
    getAnswer,
    setAnswer,
    generator,
    generateTask,
    generateVariants,
    checkAnswer,
    getScore,
    incScore,
    getHearts,
    incHearts,
    decHearts,
    restartGame,
    incCombo,
  };
})();

const visualMaster = (() => {
  const buttons = document.querySelectorAll(".button");
  const screen = document.querySelector("#screen");
  const hearts = document.querySelector("#hearts");
  const score = document.querySelector("#score");

  buttons.forEach((element) => {
    element.addEventListener("click", () => gameMaster.checkAnswer(element));
  });
  const showTask = () => {
    render();
    resetField();
    showVariants();
  };
  const showVariants = () => {
    gameMaster.generateVariants();
    answersField.shuffle();
    buttons.forEach((element, index) => {
      element.textContent = answersField.getCell(index);
    });
  };
  const mistake = (element) => {
    console.log(gameMaster.getHearts());
    element.classList.add("wrong");
    hearts.textContent = gameMaster.getHearts();
  };

  const render = () => {
    score.textContent = `Score: ${gameMaster.getScore()}`;
    screen.textContent = gameMaster.generateTask();
    hearts.textContent = gameMaster.getHearts();
  };

  const resetField = () => {
    buttons.forEach((element) => {
      element.classList.remove("wrong");
    });
  };

  return {
    showTask,
    mistake,
    render,
    resetField,
  };
})();

visualMaster.showTask();
