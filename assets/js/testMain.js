
// Clean, robust quiz logic (MCQ + short answers, navigation, results + restart)



const questions = [
  // ---------------- Beginner ----------------
  { type: "mcq", question: "Choose the correct sentence:", options: ["He go to school.", "He goes to school.", "He going to school.", "He gone to school."], correct: 1 },
  { type: "mcq", question: "Select the synonym for 'happy':", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
  { type: "short", question: "What covers a house?", correct: "roof" },
  { type: "short", question: "Opposite of 'hot'?", correct: "cold" },
  { type: "short", question: "How are called the home animals?", correct: "pets" },

  // ---------------- Elementary ----------------
  { type: "mcq", question: "Choose the correct plural: One child, two ___", options: ["childs", "children", "childes", "childrens"], correct: 1 },
  { type: "short", question: "Fill in: She ___ (to be) my best friend.", correct: "is" },
  { type: "mcq", question: "Which is a fruit?", options: ["Carrot", "Potato", "Banana", "Lettuce"], correct: 2 },
  { type: "short", question: "Opposite of 'big'?", correct: "small" },
  { type: "mcq", question: "Pick the correct article: ___ apple a day keeps the doctor away.", options: ["A", "An", "The", "No article"], correct: 1 },

  // ---------------- Intermediate ----------------
  { type: "mcq", question: "Choose the correct sentence:", options: ["I have saw that movie.", "I saw that movie yesterday.", "I seen that movie yesterday.", "I have see that movie."], correct: 1 },
  { type: "short", question: "Write the past of 'go'", correct: "went" },
  { type: "mcq", question: "Which word is a synonym for 'quickly'?", options: ["Slowly", "Fast", "Lazy", "Late"], correct: 1 },
  { type: "short", question: "Complete: He has lived here ___ 2010.", correct: "since" },
  { type: "mcq", question: "Choose the correct question:", options: ["Where you are going?", "Where are you going?", "Where going you are?", "You are going where?"], correct: 1 },

  // ---------------- Upper-Intermediate ----------------
  { type: "short", question: "Write the comparative form of 'good'", correct: "better" },
  { type: "mcq", question: "Choose the correct conditional: If I ___ you, I would apologize.", options: ["was", "were", "am", "be"], correct: 1 },
  { type: "short", question: "Fill in: She said she ___ (finish) the project by Monday.", correct: "would finish" },
  { type: "mcq", question: "Which word is closest in meaning to 'reluctant'?", options: ["Willing", "Unwilling", "Excited", "Eager"], correct: 1 },

  // ---------------- Advanced ----------------
  { type: "short", question: "Write the passive voice: They built the house in 1990.", correct: "the house was built in 1990" }
];


let currentIndex = 0;
const userAnswers = [];

const container = document.getElementById("test-container");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const resultsBtn = document.getElementById("resultsBtn");

// Render the current question
function renderQuestion() {
  const q = questions[currentIndex];
  container.innerHTML = "";

  const qEl = document.createElement("h2");
  qEl.className = "test__question";
  qEl.textContent = `Q${currentIndex + 1}: ${q.question}`;
  container.appendChild(qEl);

  if (q.type === "mcq") {
    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "test__options";

    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${currentIndex}`;
      input.value = i;
      input.checked = userAnswers[currentIndex] === i;

      input.addEventListener("change", () => {
        userAnswers[currentIndex] = Number(input.value);
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      optionsWrapper.appendChild(label);
    });

    container.appendChild(optionsWrapper);
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your answer here";
    input.className = "short-answer";
    input.value = userAnswers[currentIndex] || "";
    input.addEventListener("input", (e) => {
      userAnswers[currentIndex] = e.target.value;
    });
    container.appendChild(input);
  }

  // Update controls
  prevBtn.disabled = currentIndex === 0;
  nextBtn.style.display =
    currentIndex === questions.length - 1 ? "none" : "inline-block";
  resultsBtn.style.display =
    currentIndex === questions.length - 1 ? "inline-block" : "none";
}

// Save current answer (useful when navigating)
function saveAnswer() {
  const selected = container.querySelector("input[type='radio']:checked");
  if (selected) userAnswers[currentIndex] = Number(selected.value);

  const shortInput = container.querySelector(".short-answer");
  if (shortInput) userAnswers[currentIndex] = shortInput.value.trim();
}

// Calculate score, percent and level
function calculateResults() {
  let score = 0;
  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    if (q.type === "mcq" && userAnswer === q.correct) score++;
    if (
      q.type === "short" &&
      typeof userAnswer === "string" &&
      userAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim()
    )
      score++;
  });

  const percent = Math.round((score / questions.length) * 100);

  let level = "Beginner";
  if (percent >= 90) level = "Advanced";
  else if (percent >= 70) level = "Intermediate";

  return { score, percent, level };
}

// Show results and add "Start Again" + "Contact Teacher"
function showResults() {
  const totalQuestions = questions.length;
  let score = 0;

  // ✅ Calculate score
  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    if (q.type === "mcq" && userAnswer === q.correct) score++;
    if (q.type === "short" && userAnswer?.toLowerCase() === q.correct) score++;
  });

  const percentage = Math.round((score / totalQuestions) * 100);
  let level = "";

  if (percentage >= 90) level = "Advanced 🌟";
  else if (percentage >= 70) level = "Upper-Intermediate 💪";
  else if (percentage >= 50) level = "Intermediate 😊";
  else level = "Beginner 🌱";

  // ✅ Hide entire original controls
  document.querySelector(".test__controls").style.display = "none";

  // ✅ Display results with aligned buttons
  container.innerHTML = `
    <h2>🎉 Test Complete!</h2>
    <p>You scored <strong>${score}</strong> out of <strong>${totalQuestions}</strong>.</p>
    <p>Your estimated level: <strong>${level}</strong></p>
    <div class="test__controls" style="margin-top: 1.5rem;">
  <button id="restartBtn" class="btn btn--secondary">
    <span style="margin-right: 6px;">🔄</span> Start Again
  </button>
  <a href="index.html#contact" 
     target="_blank" 
     rel="noopener noreferrer" 
     class="btn btn--primary no-underline">
     Contact Teacher
  </a>
</div>

  `;

  // ✅ Restart logic
  document.getElementById("restartBtn").addEventListener("click", () => {
    currentIndex = 0;
    userAnswers.length = 0;
    renderQuestion();

    // ✅ Show original controls again
    const controls = document.querySelector(".test__controls");
    controls.style.display = "flex";
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "inline-block";
  });
}

// Button handlers
nextBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

resultsBtn.addEventListener("click", () => {
  saveAnswer();
  showResults();
});

// initial render
renderQuestion();

// ✅ Allow pressing Enter to move forward
document.addEventListener("keydown", (e) => {
  // Only trigger on Enter (ignore if Shift or other modifier is pressed)
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    // If results are showing, ignore
    if (resultsBtn.style.display === "none" && nextBtn.style.display === "none") return;

    // If on the last question → show results
    if (currentIndex === questions.length - 1) {
      resultsBtn.click();
    } else {
      nextBtn.click();
    }
  }
});
