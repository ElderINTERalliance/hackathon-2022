
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
function showContent(text, delay) {
    const storyArea = document.getElementById("story-area");
    const content = document.createElement("div");
    content.textContent = text;
    content.className = "story-element fade-in";

    content.style.animationDelay = `${delay}s`;

    storyArea.appendChild(content);
}

// returns a div full of buttons
function showChoices(buttons, roomId, data) {
    const choiceList = document.createElement("div");
    const roomName = `choice-${roomId}`;
    choiceList.id = roomName;

    for (const button of buttons) {
        const buttonEle = document.createElement("button");
        const linkName = `choice-${roomId}-to-${button.id}`;

        buttonEle.textContent = button.text;
        buttonEle.onclick = function () { makeChoice(button.id, data, this) };
        buttonEle.id = linkName;
        choiceList.appendChild(buttonEle);
    }

    const storyArea = document.getElementById("story-area");
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
    for (const { text, delay } of data[roomId].content) {
        runningDelay += delay;
        console.log(delay, runningDelay);
        showContent(text, runningDelay);
    }
    showChoices(data[roomId].buttons, roomId, data);
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
