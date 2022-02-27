const FADE_DURATION = 100;
const startRoom = localStorage.getItem("savedRoom");
const storyArea = document.getElementById("story-area");

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
    const content = document.createElement("div");
    if (speaker.toLowerCase() === "narrator") {
        content.innerHTML = text;
    } else {
        content.innerHTML = speaker + "> " + text;
    }
    content.className = "story-element";
    content.style.display = "none";

    scrollFade(content, delay)

    storyArea.appendChild(content);
}

function scrollFade(element, delay) {
    $(element).delay(delay * 1000).fadeIn(FADE_DURATION).queue(function (nxt) {
        $('body')[0].scrollIntoView(false);
        nxt();
    });
};

function spacerCreate(parentEle, delay) {
    const spacer = document.createElement("div");
    spacer.id = "spacer";
    spacer.style.display = "none";
    scrollFade(spacer, delay);
    parentEle.appendChild(spacer);
};


// returns a div full of buttons
function showChoices(buttons, roomId, data, delay) {
    const choiceList = document.createElement("div");
    const roomName = `choice-${roomId}`;
    choiceList.id = roomName;
    choiceList.className = "choice-list"
    if (buttons.length > 0)
        spacerCreate(choiceList, delay);

    for (const button of buttons) {
        const buttonEle = document.createElement("button");
        const linkName = `choice-${roomId}-to-${button.id}`;

        buttonEle.textContent = button.text;
        buttonEle.onclick = function () { makeChoice(button.id, data, this) };

        buttonEle.id = linkName;
        buttonEle.style.display = "none";
        buttonEle.className = "choice"

        scrollFade(buttonEle, delay);

        choiceList.appendChild(buttonEle);
    }

    if (buttons.length > 0)
        spacerCreate(choiceList, delay);
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
    if (roomId == "load") {
        if (!startRoom) {
            playThroughRoom("start", data);
        }
        else { playThroughRoom(startRoom, data); };
    } else {
        playThroughRoom(roomId, data);
    }
};

function playThroughRoom(roomId, data) {
    localStorage.setItem("savedRoom", roomId);
    let runningDelay = 0;
    for (const { text, delay, speaker } of data[roomId].content) {
        runningDelay += delay;
        showContent(text, runningDelay, speaker);
    }
    runningDelay += 1;
    showChoices(data[roomId].buttons, roomId, data, runningDelay);
}

function loadingAnim() {
    i = 0;
    setInterval(function () {

        if (i == 3) {
            return
        }
        else {
            $("#loading").append(".");
            i++;
        }

    }, 500);
};

loadingAnim();

function startGame(script) {
    playThroughRoom("startup", script);
}

function startupAnim() {

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