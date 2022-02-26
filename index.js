
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
    console.log("this", buttonObj);
    for (const ele of buttonObj.parentElement.children) {
        ele.disabled = "disabled"; // we can't click anything in the past

        if (ele != buttonObj) { // if we didn't click the button 
            ele.style.display = "none";
        }
    }

    playThroughRoom(data[roomId], roomId, data);
}

function playThroughRoom(roomData, roomId, data) {
    for (const { text, delay } of roomData.content) {
        showContent(text, delay);
    }
    showChoices(roomData.buttons, roomId, data);
}

function startGame(script) {
    playThroughRoom(script.start, "start", script);
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