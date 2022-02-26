const FADE_DURATION = 500;

/**
 * 
 * @param {Object} data 
 * @throws {Error} - The data is not valid
 */
function errorOnInvalidData(data) {
    for (const id in data) {
        for (const button of data[id]["buttons"]) {
            if (!(button.id in data))
                throw new Error(`Data is not valid - "${button.id}" is not a room (referenced in room "${id}")`);
        }
    }
}

// TODO: make async
function showContent(text, delay, speaker) {
    const storyArea = document.getElementById("story-area");
    const content = document.createElement("div");
    if (speaker.toLowerCase() === "narrator") {
        content.innerHTML = text;
    } else {
        content.innerHTML = speaker + "> " + text;
    }
    content.className = "story-element";
    content.style.display = "none";

    $(content).delay(delay * 1000).fadeIn(FADE_DURATION);

    storyArea.appendChild(content);
}

// returns a div full of buttons
function showChoices(buttons, roomId, data, delay) {
    const choiceList = document.createElement("div");
    const roomName = `choice-${roomId}`;
    choiceList.id = roomName;
    choiceList.className = "choice-list"

    for (const button of buttons) {
        const buttonEle = document.createElement("button");
        const linkName = `choice-${roomId}-to-${button.id}`;

        buttonEle.textContent = button.text;
        buttonEle.onclick = function () { makeChoice(button.id, data, this) };

        buttonEle.id = linkName;
        buttonEle.style.display = "none";

        $(buttonEle).delay(delay * 1000).fadeIn(FADE_DURATION);

        choiceList.appendChild(buttonEle);
    }

    const storyArea = document.getElementById("story-area");
    console.log("ran");
    storyArea.appendChild(choiceList);
}

function makeChoice(roomId, data, buttonObj) {
    // hide all other choices
    for (const ele of buttonObj.parentElement.children) {
        ele.disabled = "disabled"; // we can't click anything in the past

        if (ele == buttonObj) {
            ele.className = "chosen";
        } else {
            ele.className = "not-chosen";
        }
    }

    playThroughRoom(roomId, data);
}

function playThroughRoom(roomId, data) {
    let runningDelay = 0;
    for (const { text, delay, speaker } of data[roomId].content) {
        runningDelay += delay;
        showContent(text, runningDelay, speaker);
    }
    runningDelay += 1;
    showChoices(data[roomId].buttons, roomId, data, runningDelay);
}

function startGame(script) {
    playThroughRoom("start", script);
}

fetch("./script.json")
    .then(mockResponses => {
        return mockResponses.json();
    })
    .then(data => {
        errorOnInvalidData(data);
        console.log("starting game...")
        startGame(data);
    }).catch(err => console.error(err));