const questions = [
    {
        question: "What is the capital city of Sweden?",
        options: ["Malmö", "Gothenburg", "Stockholm", "Uppsala"],
        answer: "Stockholm",
        correctIndex: 2
    },
    {
        question: "Which popular furniture retailer was founded in Sweden?",
        options: ["IKEA", "H&M", "Volvo", "Spotify"],
        answer: "IKEA",
        correctIndex: 0
    },
    {
        question: "Which Swedish band is famous for hits like 'Dancing Queen' and 'Mamma Mia'?",
        options: ["Roxette", "Ace of Base", "ABBA", "The Cardigans"],
        answer: "ABBA",
        correctIndex: 2
    },
    {
        question: "What traditional Swedish concept describes the comfortable, cozy, and contented feeling?",
        options: ["Hygee", "Lagom", "Fika", "Sisu"],
        answer: "Lagom",
        correctIndex: 1
    },
    {
        question: "The Nobel Prizes are awarded annually in Stockholm, but the Peace Prize is awarded in which other Nordic city?",
        options: ["Oslo", "Helsinki", "Copenhagen", "Reykjavik"],
        answer: "Oslo",
        correctIndex: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let playerName = ''; 

// Added: Static base scores for mock players (do not change during the game)
const mockPlayers = [
    { name: "Anton", score: 1000, date: "2025/11/30" },
    { name: "Saga", score: 1200, date: "2025/11/30" },
    { name: "Björn", score: 1500, date: "2025/11/30" },
    { name: "Astrid", score: 2000, date: "2025/11/30" },
];

const questionArea = document.querySelector('#question-area h1');
const optionsGrid = document.getElementById('options-grid'); 
const timerDisplay = document.getElementById('timer');
const questionNumberDisplay = document.getElementById('question-number');

// ----------------------------------------------------
// 1. Get Instant Leaderboard (Scores increase based on current question progress)
// ----------------------------------------------------
function getInstantLeaderboard() {
    // Simulate score growth for mock players as the game progresses
    const progressFactor = currentQuestionIndex / questions.length;
    const maxScoreAdjustment = 3000; // Assumed difference between max score and base score
    
    // Copy base data and add score adjustment based on progress
    return mockPlayers.map(player => ({
        ...player,
        // Adjust score based on progress to simulate gradual score growth
        score: player.score + Math.round(maxScoreAdjustment * progressFactor) 
    }));
}

// ----------------------------------------------------
// 2. Quiz Flow Functions
// ----------------------------------------------------

function initializeQuiz() {
    // Get current player name
    const name = prompt("Enter your name for the temporary ranking:");
    if (name && name.trim() !== "") {
        playerName = name.trim();
    } else {
        playerName = "Player One";
    }
    loadQuestion(); 
}


function loadQuestion() {
    // Recreate option buttons and add IDs (needed because showInstantRank clears the innerHTML)
    optionsGrid.innerHTML = `
        <button class="option" id="option-a">▲</button>
        <button class="option" id="option-b">◆</button>
        <button class="option" id="option-c">●</button>
        <button class="option" id="option-d">■</button>
    `;
    const optionButtons = document.querySelectorAll('.option');
    
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    questionArea.textContent = currentQ.question;
    
    questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`; 

    optionButtons.forEach((button, index) => {
        const prefix = ['▲ ', '◆ ', '● ', '■ '][index];
        button.textContent = prefix + currentQ.options[index];
        
        button.onclick = () => handleAnswer(index, optionButtons); 
        button.disabled = false; 
        
        button.classList.remove('correct', 'incorrect', 'dim'); 
        button.style.backgroundColor = ''; 
    });
    
    startTimer(10); 
}

function handleAnswer(selectedIndex, optionButtons) {
    clearInterval(timerInterval); 
    const currentQ = questions[currentQuestionIndex];
    
    optionButtons.forEach(button => button.disabled = true);
    
    optionButtons.forEach((button, index) => {
        if (index === currentQ.correctIndex) {
            button.classList.add('correct'); 
        } else if (index === selectedIndex) { 
            button.classList.add('incorrect'); // Player chose incorrectly (Red)
        } else {
            button.classList.add('dim'); // Unchosen incorrect answer (Dim)
        }
    });

    if (selectedIndex === currentQ.correctIndex) {
        // Check for score (Faster answer = Higher score)
        const timeLeft = parseInt(timerDisplay.textContent.split(': ')[1].replace('s', '')) || 0;
        score += 1000 + (timeLeft * 100); 
    }

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            showInstantRank(); 
        } else {
            // Last question, proceed to the podium after 2 seconds
            endQuiz();
        }
    }, 2000); 
}

function startTimer(seconds) {
    let timeLeft = seconds;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer(-1, document.querySelectorAll('.option')); // Time's up
        }
    }, 1000);
}


// ----------------------------------------------------
// 3. New: Show Instant Rank (Called after each question)
// ----------------------------------------------------

function showInstantRank() {
    clearInterval(timerInterval);
    optionsGrid.innerHTML = ''; // Clear option buttons
    timerDisplay.textContent = '';
    
    // Use getInstantLeaderboard to get progress-adjusted scores
    let leaderboard = getInstantLeaderboard();
    const currentPlayerEntry = { 
        name: playerName, 
        score: score, 
        date: new Date().toLocaleTimeString() 
    };
    leaderboard.push(currentPlayerEntry);
    leaderboard.sort((a, b) => b.score - a.score);

    questionArea.textContent = `Question ${currentQuestionIndex + 1}/${questions.length} Summary`;
    questionNumberDisplay.textContent = '📊 Instant Leaderboard 📊';
    
    // --- Instant Rank HTML structure ---
    let rankHTML = `
        <div class="rank-list-container">
            <h2 class="current-score-display">Your Score: ${score} points</h2>
            <div class="rank-list-header">
                <span class="rank-col">Rank</span>
                <span class="name-col">Player</span>
                <span class="score-col">Score</span>
            </div>
    `;

    leaderboard.forEach((entry, index) => { 
        const rank = index + 1;
        // Check if this is the current player
        const isCurrentPlayer = (entry.name === playerName && entry.score === score);
        const rowClass = isCurrentPlayer ? 'rank-item current-player-rank' : 'rank-item';
                         
        rankHTML += `
            <div class="${rowClass}">
                <span class="rank-col">${rank}</span>
                <span class="name-col">${entry.name}</span>
                <span class="score-col">${entry.score}</span>
            </div>
        `;
    });

    rankHTML += '</div>';
    
    optionsGrid.innerHTML = rankHTML; 
    
    // Delay 4 seconds before loading the next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(); 
    }, 4000); 
}


// ----------------------------------------------------
// 4. Final Podium (endQuiz)
// ----------------------------------------------------

function endQuiz() {
    clearInterval(timerInterval);
    optionsGrid.innerHTML = ''; 
    timerDisplay.textContent = '';
    
    // 1. Get final leaderboard (using mockPlayers base score + max adjustment for high, stable final scores)
    let finalLeaderboard = mockPlayers.map(player => ({
        ...player,
        score: player.score + 3000 // Final score gets a fixed high adjustment
    }));
    
    const currentPlayerEntry = { 
        name: playerName, 
        score: score, 
        date: new Date().toLocaleString() 
    };
    finalLeaderboard.push(currentPlayerEntry);
    
    // 2. Sort
    finalLeaderboard.sort((a, b) => b.score - a.score);

    // 3. Display results and title
    questionArea.textContent = `🎉 Quiz Finished! Your final score is: ${score} points!`;
    questionNumberDisplay.textContent = '🏆 Final Results - Top 3 🏆';
    
    // --- Podium HTML structure ---
    
    let podiumHTML = '<div class="podium-container">';

    const topThree = [
        finalLeaderboard[1], // Second Place
        finalLeaderboard[0], // First Place
        finalLeaderboard[2]  // Third Place
    ];

    topThree.forEach((entry, index) => {
        // Safety check: ensure entry exists
        if (!entry) return;
        
        // Find the actual rank (+1)
        const rank = finalLeaderboard.findIndex(e => e === entry) + 1;
        let positionClass = '';

        if (index === 0) {
            positionClass = 'podium-item second-place';
        } else if (index === 1) {
            positionClass = 'podium-item first-place';
        } else if (index === 2) {
            positionClass = 'podium-item third-place';
        }

        const isCurrentPlayer = (entry.name === playerName && entry.score === score);
        const playerClass = isCurrentPlayer ? 'player-highlight' : '';
        const nameDisplay = entry.name.length > 10 ? entry.name.substring(0, 8) + '...' : entry.name;
        
        podiumHTML += `
            <div class="${positionClass}">
                ${index === 1 ? '<div class="crown">👑</div>' : ''}
                <div class="podium-score ${playerClass}">${entry.score}</div>
                <div class="podium-name ${playerClass}">${nameDisplay}</div>
                <div class="podium-base">
                    <span class="podium-rank">${rank}</span>
                </div>
            </div>
        `;
    });

    podiumHTML += '</div>';
    
    optionsGrid.innerHTML = podiumHTML; 
}


// Start the quiz
initializeQuiz();