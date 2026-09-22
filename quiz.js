const quizData = [
    {
        question: "1. Which type of task do you enjoy most?",
        options: [
            { text: "Creating visual layouts, interfaces, and brand designs", category: "Design" },
            { text: "Writing code and building software applications", category: "Software Development" },
            { text: "Managing systems, networks, and digital security", category: "Cybersecurity" },
            { text: "Creating content and managing online campaigns", category: "Digital Marketing" }
        ]
    },
    {
        question: "2. Which tool would you most like to learn?",
        options: [
            { text: "A programming language such as Python or JavaScript", category: "Software Development" },
            { text: "A design tool such as Figma or Adobe Illustrator", category: "Design" },
            { text: "A data tool such as Excel, SQL, or Power BI", category: "Data & Infrastructure" },
            { text: "Hardware setup, troubleshooting, and networking tools", category: "IT Support" }
        ]
    },
    {
        question: "3. How do you prefer to contribute to a project?",
        options: [
            { text: "I prefer building features and writing code", category: "Software Development" },
            { text: "I prefer improving the look and user experience", category: "Design" },
            { text: "I prefer analyzing information and organizing data", category: "Data & Infrastructure" },
            { text: "I prefer identifying risks and protecting systems", category: "Cybersecurity" }
        ]
    }
];

let currentQuestionIndex = 0;
let scores = {};

function openQuiz() {
    document.getElementById('quizModal').style.display = 'flex';
    startQuiz();
}

function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
}

function startQuiz() {
    currentQuestionIndex = 0;
    scores = {
        "Software Development": 0,
        "Design": 0,
        "Data & Infrastructure": 0,
        "Cybersecurity": 0,
        "IT Support": 0,
        "Digital Marketing": 0
    };
    
    document.getElementById('quizHeader').style.display = 'block';
    document.getElementById('quizQuestionContainer').style.display = 'block';
    document.getElementById('quizResultContainer').style.display = 'none';
    
    showQuestion();
}

function showQuestion() {
    const q = quizData[currentQuestionIndex];
    document.getElementById('quizQuestionText').textContent = q.question;
    
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progress}%`;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = option.text;
        btn.onclick = () => selectOption(option.category);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(category) {
    scores[category]++;
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quizHeader').style.display = 'none';
    document.getElementById('quizQuestionContainer').style.display = 'none';
    document.getElementById('quizResultContainer').style.display = 'block';

    let topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const descriptions = {
        "Software Development": "You have a logical mind! You'd thrive writing code, building apps, and creating software solutions.",
        "Design": "You have a creative eye! UI/UX or Graphics Design is perfect for your visual skills.",
        "Data & Infrastructure": "You love organizing information! Database Management or Cloud Infrastructure is your calling.",
        "Cybersecurity": "You are a protector! You'd be great at finding vulnerabilities and securing government networks.",
        "IT Support": "You are a problem solver! Keeping hardware and networks running smoothly fits you perfectly.",
        "Digital Marketing": "You are a communicator! You'd excel at managing social media and digital content."
    };

    document.getElementById('quizResultTitle').textContent = topCategory;
    document.getElementById('quizResultDesc').textContent = descriptions[topCategory] || "We have great roles for you!";

    document.getElementById('btnViewQuizJobs').onclick = () => {
        window.location.href = `index.html?category=${encodeURIComponent(topCategory)}`;
    };
}