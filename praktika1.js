const { isAfter, isBefore, isEqual, format, parse } = require("date-fns");
const commandLineArgs = require("command-line-args");
const fs = require("fs");
const readline = require("readline");

// Определение параметров командной строки
const optionDefinitions = [
  { name: "startDate", type: String },
  { name: "endDate", type: String },
];

const options = commandLineArgs(optionDefinitions);

async function processLogFile(filePath, startDate, endDate) {
  try {
    if (!filePath.endsWith("input.txt")) {
      return;
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
    });

    rl.on("line", (entry) => {
      const [dateStr, message] = entry.split(" ", 2);
      const entryDate = parse(dateStr, "yyyy-MM-dd", new Date());

      if (
        (startDate &&
          isAfter(entryDate, parse(startDate, "yyyy-MM-dd", new Date()))) ||
        (endDate &&
          isBefore(entryDate, parse(endDate, "yyyy-MM-dd", new Date()))) ||
        (startDate &&
          endDate &&
          isEqual(entryDate, parse(startDate, "yyyy-MM-dd", new Date())))
      ) {
        console.log(`${format(entryDate, "yyyy-MM-dd")} ${message}`);
      } else if (!startDate && !endDate) {
        console.log(`${format(entryDate, "yyyy-MM-dd")} ${message}`);
      }
    });

    rl.on("close", () => {
      console.log("File reading completed.");
    });
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
}

const inputFilePath = "input.txt";
processLogFile(inputFilePath, options.startDate, options.endDate);
