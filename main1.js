const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();

// Опис параметрів командного рядка
program
  .requiredOption('-i, --input <file>', 'Path to input file')
  .option('-o, --output <file>', 'Path to output file')
  .option('-d, --display', 'Display output in console');

// Парсинг аргументів
program.parse(process.argv);

// Отримання значень опцій
const options = program.opts();

// Перевірка наявності вхідного файлу
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// Перевірка чи існує файл
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання файлу та парсинг JSON
let inputData;
try {
  const fileContent = fs.readFileSync(options.input, 'utf8');
  inputData = JSON.parse(fileContent);
} catch (error) {
  console.error("Error reading or parsing the input file:", error.message);
  process.exit(1);
}

// Функція для вибору потрібних категорій
function extractData(dataArray) {
  const result = {};
  dataArray.forEach(item => {
    if (item.txt === "Доходи, усього") {
      result["Доходи, усього"] = item.value;
    }
    if (item.txt === "Витрати, усього") {
      result["Витрати, усього"] = item.value;
    }
  });
  return result;
}

// Отримання даних
const extractedData = extractData(inputData);

// Форматування даних для виводу
let outputString = '';
for (const [key, value] of Object.entries(extractedData)) {
  outputString += `${key}:${value}\n`;
}

// Виведення в консоль, якщо задано параметр --display
if (options.display) {
  console.log(outputString);
}

// Запис у файл, якщо задано параметр --output
if (options.output) {
  fs.writeFileSync(options.output, outputString, 'utf8');
  console.log(`Data has been written to ${options.output}`);
}

// Якщо не задано ні -d, ні -o, програма нічого не виводить
if (!options.display && !options.output) {
  process.exit(0);
}