const consoleOutput = document.querySelector('.console-output');
const consoleInput = document.getElementById('console-input');

// Command history
const commandHistory = [];
let historyIndex = -1;

// Function to display output on the console
function displayOutput(output, className = '') {
  const outputElement = document.createElement('div');
  outputElement.textContent = output;
  outputElement.classList.add('output-line');
  if (className) {
    outputElement.classList.add(className);
  }
  consoleOutput.appendChild(outputElement);
  // Scroll to the bottom of the console output
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Function to handle user input
function handleConsoleInput() {
  const input = consoleInput.value.trim();
  if (input !== '') {
    addToCommandHistory(input);
    // Clear the input field
    consoleInput.value = '';
    // Display the user input
    displayOutput('> ' + input, 'input-line');
    executeCommand(input);
  }
}

// Function to execute commands
function executeCommand(input) {
  const args = input.split(' ');
  const command = args.shift().toLowerCase();
  switch (command) {
    case 'clear':
      clearConsole();
      break;
    case 'help':
      showHelp();
      break;
    case 'log':
      downloadConsoleLog();
      break;
    // Add your custom commands here
    default:
      displayOutput(`Error: Command "${command}" not found. Type "help" for available commands.`, 'error-line');
      break;
  }
}

// Function to initiate download of console log
function downloadConsoleLog() {
  const logContent = Array.from(consoleOutput.childNodes)
    .map(node => node.textContent.trim())
    .join('\n');
  
  const logTitle = `NOVA_LOG_${new Date().getTime()}`;
  const blob = new Blob([logContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${logTitle}.txt`);
  link.click();
}

// Event listener for handling user input
consoleInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent default Enter behavior (line break)
    handleConsoleInput();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault(); // Prevent default ArrowUp behavior (scrolling)
    navigateCommandHistory('up');
  } else if (event.key === 'ArrowDown') {
    event.preventDefault(); // Prevent default ArrowDown behavior (scrolling)
    navigateCommandHistory('down');
  }
});

// Function to navigate command history
function navigateCommandHistory(direction) {
  if (commandHistory.length === 0) return;
  if (direction === 'up') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
    }
  } else if (direction === 'down') {
    if (historyIndex > 0) {
      historyIndex--;
    } else if (historyIndex === 0) {
      historyIndex = -1;
    }
  }
  consoleInput.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
}

// Function to add commands to the command history (excluding empty inputs)
function addToCommandHistory(input) {
  if (input.trim() !== '') {
    commandHistory.unshift(input);
    historyIndex = -1;
  }
}

// Function to clear the console
function clearConsole() {
  consoleOutput.innerHTML = '';
}

// Function to show available commands
function showHelp() {
  displayOutput('Available commands:');
  displayOutput('- clear: Clear the console.');
  displayOutput('- help: Show this help message.');
  displayOutput('- log: Download console log as text file.');
  // Add descriptions for custom commands here
}

// Example of adding a custom command: "sayHello"
function sayHello() {
  displayOutput('Hello! Welcome to the advanced console.');
}

function overrideConsole() {
  // List of console methods to override
  const consoleMethods = ['log', 'error', 'warn', 'info', 'debug'];

  // Override each console method
  consoleMethods.forEach(method => {
    // Store the original console method
    const originalMethod = console[method];
    
    // Override the console method with a custom function
    console[method] = function(...args) {
      // Call the original console method
      originalMethod.apply(console, args);
      
      // Display the output in the custom console
      displayOutput(args.join(' '), `${method}-line`);
    };
  });
}

// Call the function to override console methods
overrideConsole();
