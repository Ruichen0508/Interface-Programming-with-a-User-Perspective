const questions = [
    {
        question: "Which element is used to define the main body of an HTML document?",
        options: ["<head>", "<body>", "<html>", "<title>"],
        answer: "<body>",
        correctIndex: 1
    },
    {
        question: "Which CSS property is used to change the text color?",
        options: ["background-color", "text-color", "color", "font-style"],
        answer: "color",
        correctIndex: 2
    },
    {
        question: "What is the primary language for adding interactivity to a webpage?",
        options: ["Python", "C#", "SQL", "JavaScript"],
        answer: "JavaScript",
        correctIndex: 3
    }
    // ... More questions can be added here
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

const questionArea = document.querySelector('#question-area h1');
const optionButtons = document.querySelectorAll('.option');
const timerDisplay = document.getElementById('timer');
const questionNumberDisplay = document.getElementById('question-number');

function loadQuestion() {
    // Check if all questions have been answered
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    questionArea.textContent = currentQ.question;
    questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;

    // Update option text and reset buttons
    optionButtons.forEach((button, index) => {
        // Prepend geometric symbols (Kahoot! style)
        button.textContent = ['▲ ', '◆ ', '● ', '■ '][index] + currentQ.options[index];
        button.onclick = () => handleAnswer(index); // Bind click event
        button.disabled = false; // Re-enable buttons
        button.classList.remove('correct', 'incorrect'); // Clear previous colors
    });
    
    startTimer(10); // Start the timer for 10 seconds per question
}

function handleAnswer(selectedIndex) {
    clearInterval(timerInterval); // Stop the timer immediately
    const currentQ = questions[currentQuestionIndex];
    
    // Disable all buttons to prevent double-clicking
    optionButtons.forEach(button => button.disabled = true);
    
    // Mark correct and incorrect options
    optionButtons.forEach((button, index) => {
        if (index === currentQ.correctIndex) {
            button.classList.add('correct'); // Highlight the correct answer
        } else if (index === selectedIndex) {
            button.classList.add('incorrect'); // Highlight the user's incorrect choice
        }
    });

    // Check for score (if the user chose a valid option)
    if (selectedIndex === currentQ.correctIndex) {
        // Simple scoring: e.g., 1000 points per correct answer
        score += 1000; 
    }

    // Delay before moving to the next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000); // Display the result for 2 seconds
}

function startTimer(seconds) {
    let timeLeft = seconds;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Time's up! Automatically moves to the next question (as an incorrect answer)
            handleAnswer(-1); 
        }
    }, 1000);
}

function endQuiz() {
    questionArea.textContent = `Quiz Finished! Your total score is: ${score}`;
    document.getElementById('options-grid').innerHTML = ''; // Clear the options grid
    questionNumberDisplay.textContent = 'Game Over';
}

// Start the quiz when the script loads
loadQuestion();