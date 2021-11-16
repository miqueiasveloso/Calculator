const numberButtons = document.querySelectorAll(".button.number");
const operatorButtons = document.querySelectorAll(".button.operator");
const pointButton = document.getElementById("btn-point");
const clearButton = document.getElementById("btn-clear");
const deleteButton = document.getElementById("btn-delete");
const equalsButton = document.getElementById("btn-equals");
const display = document.getElementById("display-content");
let input = "";
let operator = null;
let hasDecimal = false;

function operate(operator, firstNum, secondNum) {
  function add(a, b) {
    return a + b;
  }

  function subtract(a, b) {
    return a - b;
  }

  function multiply(a, b) {
    return a * b;
  }

  function divide(a, b) {
    return a / b;
  }

  function percent(a, b){
    return a % b;
  }

  const operations = {
    "+": add(firstNum, secondNum),
    "-": subtract(firstNum, secondNum),
    "*": multiply(firstNum, secondNum),
    "/": divide(firstNum, secondNum),
    "%": percent(firstNum, secondNum),
  };

  return Math.round(operations[operator] * 100) / 100;
}

function updateDisplay(content) {
  content ? (display.textContent = content) : (display.textContent = "0");
}

function appendNumber(number) {
  input += number;
}

function inputIsInvalid() {
  if (!input) {
    return true;
  }

  const lastChar = input[input.length - 1];

  if (lastChar === operator || lastChar === ".") {
    return true;
  }

  if (!parseFloat(input)) {
    return true;
  }

  return false;
}

function appendOperator(operatorType) {
  if (inputIsInvalid()) {
    return;
  }

  operator = operatorType;
  input += operator;
  hasDecimal = false;
}

function appendPoint() {
  if (hasDecimal) {
    return;
  }

  input += ".";
  hasDecimal = true;
}

function clearInput() {
  input = "";
  operator = null;
  hasDecimal = false;
}

function deleteLastChar() {
  const lastChar = input[input.length - 1];

  switch (lastChar) {
    case operator:
      operator = null;
      break;
    case ".":
      hasDecimal = false;
      break;
    default:
      break;
  }

  input = input.slice(0, input.length - 1);
}

function doOperation() {
  const firstOperand = parseFloat(input.split(operator)[0]);
  const secondOperand = parseFloat(input.split(operator)[1]);
  return operate(operator, firstOperand, secondOperand);
}

function resultIsInvalid(result) {
  if ((!result && result !== 0) || result === Infinity) {
    return true;
  }

  return false;
}

function isFloatingPoint(string) {
  return string.includes(".");
}

function displayOverflows() {
  const container = document.getElementById("display");

  function getElementContentWidth(element) {
    let styles = window.getComputedStyle(element);
    let padding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);

    return element.clientWidth - padding;
  }

  const widthAvailable =
    getElementContentWidth(container) - getElementContentWidth(display);

  return widthAvailable < 23;
}

function throwDisplayFullAlert() {
  alert("Display cannot hold more characters!");
}

numberButtons.forEach((numberBtn) =>
  numberBtn.addEventListener("click", () => {
    if (displayOverflows()) {
      throwDisplayFullAlert();
      return;
    }

    appendNumber(numberBtn.textContent);
    updateDisplay(input);
  })
);

operatorButtons.forEach((operatorBtn) =>
  operatorBtn.addEventListener("click", () => {
    if (operator && !inputIsInvalid()) {
      const result = doOperation();

      if (resultIsInvalid(result)) {
        clearInput();
        updateDisplay("Math ERROR");
        return;
      }

      input = result.toString();
    }

    if (displayOverflows()) {
      throwDisplayFullAlert();
      return;
    }

    appendOperator(operatorBtn.textContent);
    updateDisplay(input);
  })
);

pointButton.addEventListener("click", () => {
  if (displayOverflows()) {
    throwDisplayFullAlert();
    return;
  }

  appendPoint();
  updateDisplay(input);
});

clearButton.addEventListener("click", () => {
  clearInput();
  updateDisplay("0");
});

deleteButton.addEventListener("click", () => {
  deleteLastChar();
  updateDisplay(input);
});

equalsButton.addEventListener("click", () => {
  if (!operator) {
    return;
  }

  if (inputIsInvalid()) {
    return;
  }

  const result = doOperation();

  if (resultIsInvalid(result)) {
    clearInput();
    updateDisplay("Math ERROR");
    return;
  }

  operator = null;
  input = result.toString();
  hasDecimal = isFloatingPoint(input) ? true : false;
  updateDisplay(input);
});

