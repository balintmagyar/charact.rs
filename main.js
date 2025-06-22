const STATE = {
    currentDisplay: null
}

function addCharTagClasses (element, tags) {
    for (const tag in tags) if (Object.prototype.hasOwnProperty.call(tags, tag)) element.classList.add(tag);
}

function setDisplay () {
    const ELEMENTS_CHARCONTAINER = document.querySelectorAll(".charContainer");
    const DISPLAY_SELECTED = document.querySelector("#displayRadioFieldSet input:checked").value;

    ELEMENTS_CHARCONTAINER.forEach(currentCharContainer => {
        let displayLabel = DATA.CHARS[currentCharContainer.dataset.index].displayFormats[DISPLAY_SELECTED];
        currentCharContainer.querySelector(".displaylabel").textContent = displayLabel;
    });

    STATE.currentDisplay = DISPLAY_SELECTED;
}

const appContainer = document.getElementById("app");

const charsContainer = document.createElement("div");
charsContainer.classList.add("charsContainer");
charsContainer.classList.add("grid");

DATA.CHARS.forEach((currentCharData, index) => {
    // Create elements
    const charContainer = document.createElement("div");
    charContainer.classList.add("charContainer");
    charContainer.dataset.index = index;

    const charDisplay   = document.createElement("div");
    charDisplay.insertAdjacentText("beforeend", currentCharData.displayFormats.raw);
    charDisplay.classList.add("char");
    addCharTagClasses(charDisplay, currentCharData.tags);

    const charDisplayLabel = document.createElement("div");
    charDisplayLabel.classList.add("displaylabel");

    const charActionCopy = document.createElement("button");
    charActionCopy.insertAdjacentText("beforeend", "copy");

    charContainer.insertAdjacentElement("beforeend", charDisplay);
    charContainer.insertAdjacentElement("beforeend", charDisplayLabel);
    charContainer.insertAdjacentElement("beforeend", charActionCopy);

    // Add click to copy behavior
    charActionCopy.setAttribute("data-success", "copied");
    charActionCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(currentCharData.displayFormats[STATE.currentDisplay]);
    });

    // Add everything to the container
    charsContainer.insertAdjacentElement("beforeend", charContainer);
});
appContainer.insertAdjacentElement("beforeend", charsContainer);

const ELEMENT_DISPLAYRADIOFIELDSET = document.getElementById("displayRadioFieldSet");
const TEMPLATE_DISPLAYRADIOINPUT = document.getElementById("displayRadioInputTemplate");

for (const displayFormat in DATA.CHARS[0].displayFormats) {
    if (displayFormat == "raw") continue;

    const ELEMENT_NEWDISPLAYRADIOINPUT = TEMPLATE_DISPLAYRADIOINPUT.cloneNode(true).content;

    const ELEMENT_NEWDISPLAYRADIOINPUT_INPUT = ELEMENT_NEWDISPLAYRADIOINPUT.children[0]
    const ELEMENT_NEWDISPLAYRADIOINPUT_LABEL = ELEMENT_NEWDISPLAYRADIOINPUT.children[1]

    ELEMENT_NEWDISPLAYRADIOINPUT_INPUT.setAttribute("id", `${displayFormat}RadioInput`);
    ELEMENT_NEWDISPLAYRADIOINPUT_INPUT.value = displayFormat;

    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("for", `${displayFormat}RadioInput`);
    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("aria-label", `${DATA.STRINGS.DISPLAYFORMATS_FRIENDLY[displayFormat]}`);
    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("title", `${DATA.STRINGS.DISPLAYFORMATS_FRIENDLY[displayFormat]}`);
    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.textContent = DATA.STRINGS.DISPLAYFORMATS[displayFormat];

    ELEMENT_DISPLAYRADIOFIELDSET.append(ELEMENT_NEWDISPLAYRADIOINPUT);
}

const ELEMENT_DISPLAYRADIOINPUT_CHECKED = document.querySelector("#displayRadioFieldSet input:first-child");
ELEMENT_DISPLAYRADIOINPUT_CHECKED.setAttribute("checked", true);

setDisplay();
