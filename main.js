
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

// Читання файлу
const inputData = fs.readFileSync(options.input, 'utf8');

// Виведення в консоль, якщо задано параметр --display
if (options.display) {
  console.log("Output:\n", inputData);
}

// Запис у файл, якщо задано параметр --output
if (options.output) {
  fs.writeFileSync(options.output, inputData, 'utf8');
  console.log(`Data has been written to ${options.output}`);
}

// Якщо не задано ні -d, ні -o, програма нічого не виводить
if (!options.display && !options.output) {
  process.exit(0);
}


