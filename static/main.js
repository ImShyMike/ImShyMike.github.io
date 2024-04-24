var flashcards = [];
var answersHidden = true;
var presentingMode = false;
var oldRandomIndex = 0;
var randomIndex = Math.floor(Math.random() * flashcards.length);

function addFlashcard() {
    var questionInput = document.getElementById("questionInput");
    var answerInput = document.getElementById("answerInput");
    var question = questionInput.value.trim();
    var answer = answerInput.value.trim();

    if (question && answer) {
        flashcards.push({ q: question, a: answer });
        displayFlashcards();
        saveFlashcards();
        questionInput.value = "";
        answerInput.value = "";
    }
}

function createEditButton(index) {
    var editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = "edit-button";
    editButton.onclick = function() {
        editFlashcard(index);
    };
    return editButton;
}

function editFlashcard(index) {
    var newQuestion = prompt("Enter the new question:");
    var newAnswer = prompt("Enter the new answer:");

    if (!newQuestion | !newAnswer) { 
        alert("Please input all of the values.");
        return
    }

    if (newQuestion !== null && newAnswer !== null) {
        flashcards[index].q = newQuestion;
        flashcards[index].a = newAnswer;
        displayFlashcards();
        saveFlashcards();
    }
}

function deleteFlashcard(index) {
    flashcards.splice(index, 1);
    displayFlashcards();
    saveFlashcards();
}

function displayFlashcards() {
    var container = document.getElementById("flashcardContainer");
    container.innerHTML = "";
    
    flashcards.forEach(function(flashcard, index) {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add("flashcard");
        
        var questionNode = document.createElement("strong");
        questionNode.textContent = "Question:";
        cardDiv.appendChild(questionNode);
        cardDiv.appendChild(document.createTextNode(flashcard.q));
        
        var answerNode = document.createElement("strong");
        answerNode.textContent = "Answer:";
        cardDiv.appendChild(answerNode);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.className = "delete-button";
        deleteButton.onclick = function() {
            deleteFlashcard(index);
        };
        cardDiv.appendChild(deleteButton);

        var editButton = createEditButton(index);
        cardDiv.appendChild(editButton);
        
        var answerText = document.createElement("span");
        if (answersHidden) {
            answerText.className = "blurred-text";
        }
        answerText.classList.add("blurable-text");
        answerText.textContent = flashcard.a;
        answerText.addEventListener("click", function() {
            toggleBlur(answerText);
        });
        cardDiv.appendChild(answerText);
        
        container.appendChild(cardDiv);
    });
}

function toggleBlur(element) {
    element.classList.toggle("blurred-text");
}

function saveFlashcards() {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function loadFlashcards() {
    var storedFlashcards = localStorage.getItem("flashcards");
    if (storedFlashcards) {
        flashcards = JSON.parse(storedFlashcards);
        displayFlashcards();
    }
}

function toggleHiddenAnswers() {
    answersHidden = !answersHidden;
    var toggleButton = document.getElementById("toggleButton");
    toggleButton.innerHTML = answersHidden ? "<i class=\"fa-solid fa-eye\"></i> Show Answers" : "<i class=\"fa-solid fa-eye-slash\"></i> Hide Answers";

    var answerElements = document.querySelectorAll(".blurable-text");

    answerElements.forEach(function(element) {
        if (answersHidden) {
            element.classList.add("blurred-text");
        } else {
            element.classList.remove("blurred-text");
        }
    });
}

function deleteAllFlashcards() {
    if (!confirm("Are you sure you want to delete all flashcards?")) {
        return
    }
    flashcards = [];
    displayFlashcards();
    saveFlashcards();
}

function exportFlashcards() {
    var flashcardsString = JSON.stringify(flashcards);
    var base64String = btoa(flashcardsString);
    
    var exportTextArea = document.createElement("textarea");
    exportTextArea.value = base64String;
    exportTextArea.setAttribute("readonly", "");
    exportTextArea.style.position = "absolute";
    exportTextArea.style.left = "-9999px";
    document.body.appendChild(exportTextArea);
    
    exportTextArea.select();
    document.execCommand("copy");
    
    document.body.removeChild(exportTextArea);
    
    alert("Flashcards exported! You can now paste them to save or share.");
}        

function importFlashcards() {
    var importedData = prompt("Please paste your exported flashcards (Base64 encoded) here:");
    if (importedData) {
        try {
            var decodedData = atob(importedData);
            var parsedData = JSON.parse(decodedData);
            if (Array.isArray(parsedData)) {
                flashcards = parsedData;
                displayFlashcards();
                saveFlashcards();
                alert("Flashcards imported successfully!");
            } else {
                alert("Invalid format. Please ensure the input is in Base64 encoded format.");
            }
        } catch (error) {
            alert("Invalid data. Please ensure the input is in Base64 encoded format.");
        }
    }
}

function presentNewFlashcard() {
    if (flashcards.length === 0) {
        alert("There are no flashcards available.");
        return;
    }

    if (flashcards.length === 1) {
        alert("There is only one flashcard available.");
        return;
    } else {
        while (randomIndex === oldRandomIndex) {
            randomIndex = Math.floor(Math.random() * flashcards.length);
        }
    }
    oldRandomIndex = randomIndex;
    var randomFlashcard = flashcards[randomIndex];

    document.querySelector('.flashcard-editor').style.display = 'none';
    document.querySelector('.flashcard-presentation').style.display = 'block';
    document.getElementById('question').textContent = randomFlashcard.q;
    document.getElementById('answer').textContent = randomFlashcard.a;
    document.getElementById('answer').classList.add('blurred-text');
}

function revealAnswer() {
    document.getElementById('answer').classList.remove('blurred-text');
}

function toggleFlashcardEditor() {
    document.querySelector('.flashcard-editor').style.display = 'block';
    document.querySelector('.flashcard-presentation').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    loadFlashcards();

    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            if (document.querySelector('.flashcard-presentation').style.display === 'none') {
                var questionInput = document.getElementById("questionInput");
                var answerInput = document.getElementById("answerInput");
                var question = questionInput.value.trim();
                var answer = answerInput.value.trim();

                if (document.activeElement === questionInput) {
                    if (question) {
                        answerInput.focus();
                    }
                } else if (document.activeElement === answerInput) {
                    if (question && answer) {
                        questionInput.focus();
                        addFlashcard();
                    }
                } else {
                    questionInput.focus();
                }
            } else {
                presentNewFlashcard();
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === ' ' || event.code === 'Space') {
            revealAnswer();
        }
    });
});
