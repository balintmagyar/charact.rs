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

function copyClickHandler () {
    navigator.clipboard.writeText(document.querySelector(".charContainer:hover .displaylabel").textContent);
}

const ELEMENT_APPCONTAINER = document.getElementById("app");

const ELEMENT_CHARSCONTAINER = document.createElement("div");
ELEMENT_CHARSCONTAINER.classList.add("charsContainer");
ELEMENT_CHARSCONTAINER.classList.add("grid");

const TEMPLATE_CHARCONTAINER = document.getElementById("charContainerTemplate");

DATA.CHARS.forEach((charData, i) => {
    const ELEMENT_NEWCHARCONTAINER = TEMPLATE_CHARCONTAINER.cloneNode(true).content;

    const ELEMENT_NEWCHARCONTAINER_CHAR = ELEMENT_NEWCHARCONTAINER.querySelector(".char");
    const ELEMENT_NEWCHARCONTAINER_BUTTON = ELEMENT_NEWCHARCONTAINER.querySelector("button");
    
    ELEMENT_NEWCHARCONTAINER.querySelector(".charContainer").dataset.index = i;

    ELEMENT_NEWCHARCONTAINER_CHAR.textContent = charData.displayFormats.raw;
    addCharTagClasses(ELEMENT_NEWCHARCONTAINER_CHAR, charData.tags);

    ELEMENT_NEWCHARCONTAINER_BUTTON.textContent = "copy";

    ELEMENT_CHARSCONTAINER.append(ELEMENT_NEWCHARCONTAINER);
});
ELEMENT_APPCONTAINER.insertAdjacentElement("beforeend", ELEMENT_CHARSCONTAINER);

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
