
let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];

let questions = [];

let currentQuizTheme = '';

function loadQuizData(fileName) {
    currentQuizTheme = fileName;
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            questions = data;
            setQuizTitle(fileName); // Setzt den Titel basierend auf der ausgewählten Kategorie
            startQuiz();
        })
        .catch(error => console.error('Fehler beim Laden der Quiz-Daten:', error));
}


function setQuizTitle() {
    let title;
    switch (currentQuizTheme) {
        case 'news-quiz.json':
            title = "News-Quiz allgemeines";
            break;
        case 'nachhaltigkeit-quiz.json':
            title = "News-Quiz Nachhaltigkeit";
            break;
        case 'schweizer-politik-quiz.json':
            title = "News-Quiz schweizer Politik";
            break;
        default:
            title = "Teste dein Wissen";
    }
    document.getElementById("quiz-title").innerText = title;
}



let timer;
let countdownValue = 20; // Alle Let-Variablen speichern den aktuellen Zustand des Quiz.

function startQuiz() {
    document.getElementById("quiz-title").classList.remove("hidden");
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("theme-selection").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    showQuestion();
    startTimer();
}


document.getElementById("start-quiz-button").addEventListener("click", showThemeSelection);


function showThemeSelection() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("theme-selection").classList.remove("hidden");
}


function showQuestion() {
    document.getElementById("questionTitle").innerText = `${currentQuestion + 1}. Frage`;
    document.getElementById("questionTitle").classList.remove("hidden");
    document.getElementById("question").innerText = questions[currentQuestion].question;
    updateProgress();

    // Entferne die Markierung der ausgewählten Antwort
    const trueButton = document.querySelector("button[onclick='selectAnswer(true)']");
    const falseButton = document.querySelector("button[onclick='selectAnswer(false)']");
    trueButton.classList.remove("selected");
    falseButton.classList.remove("selected");
}




function selectAnswer(answer) {
    selectedAnswers[currentQuestion] = answer;

    const trueButton = document.querySelector("button[onclick='selectAnswer(true)']");
    const falseButton = document.querySelector("button[onclick='selectAnswer(false)']");
    if (answer) {
        trueButton.classList.add("selected");
    } else {
        falseButton.classList.add("selected");
    }

    clearInterval(timer);

    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
            startTimer();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function startTimer() {
    countdownValue = 20;
    document.getElementById("countdown").innerText = countdownValue;
    document.getElementById("timer-bar").style.width = "100%";

    timer = setInterval(() => {
        countdownValue--;
        document.getElementById("countdown").innerText = countdownValue;
        const percentage = (countdownValue / 20) * 100;
        document.getElementById("timer-bar").style.width = `${percentage}%`;

        if (countdownValue <= 0) {
            clearInterval(timer);
            selectAnswer(null); // Wenn die Zeit abgelaufen ist und keine Antwort ausgewählt wurde
        }
    }, 1000);
}

// Aktualisiert die Fortschrittsanzeige.
function updateProgress() {
    let progress = "";
    for (let i = 0; i < questions.length; i++) {
        progress += `<span class="${i === currentQuestion ? 'active' : ''}">${i + 1}</span>`;
    }
    document.getElementById("progress").innerHTML = progress;
}

// Beendet das Quiz und zeigt die Ergebnisse an.
function finishQuiz() {
    for (let i = 0; i < questions.length; i++) {
        if (selectedAnswers[i] === questions[i].answer) {
            score++;
        }
    }
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("questionTitle").classList.add("hidden");
    document.getElementById("score").innerText = `${score} / ${questions.length} Punkte`;
    document.getElementById("result").classList.remove("hidden");

}

// Setzt das Quiz zurück und zeigt den Startbildschirm an
function resetQuiz() {
    setQuizTitle();
    document.getElementById("quiz-title").classList.remove("hidden"); // Zeigt die h1 "News-Quiz" wieder an
    document.getElementById("result").classList.add("hidden");
    document.getElementById("answers").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");
    currentQuestion = 0;
    score = 0;
    selectedAnswers = [];
}


function showAnswers() {
    // Verbergen Sie die Hauptüberschrift und andere nicht benötigte Elemente
    document.getElementById("quiz-title").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("quiz").classList.add("hidden");

    // Zeigen Sie den Antworten-Bereich an
    document.getElementById("answers").classList.remove("hidden");

    // Setzen Sie den Titel für die Antworten-Seite
    let answersTitle = document.getElementById("answers").querySelector("h1");
    switch (currentQuizTheme) {
        case 'news-quiz.json':
            answersTitle.innerText = "Antworten News-Quiz Allgemeines";
            break;
        case 'nachhaltigkeit-quiz.json':
            answersTitle.innerText = "Antworten News-Quiz Nachhaltigkeit";
            break;
        case 'schweizer-politik-quiz.json':
            answersTitle.innerText = "Antworten News-Quiz schweizer Politik";
            break;
        default:
            answersTitle.innerText = "Antworten";
    }

    // Erstellen Sie die Liste der Antworten
    let answerList = "";
    for (let i = 0; i < questions.length; i++) {
        answerList += `
            <p><strong class="question-title">Frage ${i + 1}</strong></p>
            <p>${questions[i].question}</p>
            <p class="detailed-answer">${questions[i].detailedAnswer}</p>
        `;
    }
    document.getElementById("answerList").innerHTML = answerList;
}



document.addEventListener('DOMContentLoaded', loadQuizData); // sorgt dafür, dass loadQuizData() aufgerufen wird, sobald das DOM der Seite vollständig geladen und bereit ist.

