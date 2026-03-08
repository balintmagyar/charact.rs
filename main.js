const STATE = {
    currentDisplay: null
}

function addCharTagClasses (element, tags) {
    for (const tag in tags) if (Object.prototype.hasOwnProperty.call(tags, tag)) element.classList.add(tag);
}

function setDisplay(charContainer, displaySelected) {
    const charData = CHARS[charContainer.dataset.index];
    let displayLabel = charData.displayFormats[displaySelected];
    const ELEMENT_DISPLAYLABEL = charContainer.querySelector(".displaylabel");
    ELEMENT_DISPLAYLABEL.textContent = displayLabel;

    ELEMENT_DISPLAYLABEL.title = charData.displayFormats.codePoint;

    if (charData.ucd) {
        ELEMENT_DISPLAYLABEL.title += " " + (charData.ucd[1] !== "" ? charData.ucd[1] : "");
        ELEMENT_DISPLAYLABEL.title += charData.ucd[10] ? ` ${charData.ucd[10]}` : "";
    } else {
        ELEMENT_DISPLAYLABEL.title += " " + STRINGS.UNDEFINED;
    }
}

function setAllDisplay () {
    const ELEMENTS_CHARCONTAINER = document.querySelectorAll(".charContainer");
    const DISPLAY_SELECTED = document.querySelector("#displayRadioFieldSet input:checked").value;

    ELEMENTS_CHARCONTAINER.forEach(currentCharContainer => {
        setDisplay(currentCharContainer, DISPLAY_SELECTED);
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

const CHARS = [];

function init(ucdRaw) {
    const dbRequest = indexedDB.open("main", REVISION);

    dbRequest.onerror = (e) => console.error(`IndexedDB error: ${e.target.error?.message}`);

    dbRequest.onupgradeneeded = (e) => {
        const d = getData(ucdRaw);
        const db = e.target.result;

        if (localStorage.getItem("data")) localStorage.removeItem("data");
        if (db.objectStoreNames.contains("chars")) db.deleteObjectStore("chars");

        const createCharsObjectStore = db.createObjectStore("chars", { keyPath: "codePointHex" });

        createCharsObjectStore.createIndex("codePointHex", "codePointHex", { unique: true });

        createCharsObjectStore.transaction.oncomplete = (e) => {
            const charsObjectStore = db.transaction("chars", "readwrite").objectStore("chars");
            d.forEach((char) => charsObjectStore.add(char));
        };
    };

    dbRequest.onsuccess = (e) => {
        const objectStore = e.target.result.transaction("chars").objectStore("chars");

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;

            if (cursor) {
                CHARS[cursor.value.codePointDec] = cursor.value;
                cursor.continue();
            } else {
                const ELEMENT_DISPLAYRADIOFIELDSET = document.getElementById("displayRadioFieldSet");
                const TEMPLATE_DISPLAYRADIOINPUT = document.getElementById("displayRadioInputTemplate");

                for (const displayFormat in CHARS[0].displayFormats) {
                    if (displayFormat == "raw") continue;

                    const ELEMENT_NEWDISPLAYRADIOINPUT = TEMPLATE_DISPLAYRADIOINPUT.cloneNode(true).content;

                    const ELEMENT_NEWDISPLAYRADIOINPUT_INPUT = ELEMENT_NEWDISPLAYRADIOINPUT.children[0]
                    const ELEMENT_NEWDISPLAYRADIOINPUT_LABEL = ELEMENT_NEWDISPLAYRADIOINPUT.children[1]

                    ELEMENT_NEWDISPLAYRADIOINPUT_INPUT.setAttribute("id", `${displayFormat}RadioInput`);
                    ELEMENT_NEWDISPLAYRADIOINPUT_INPUT.value = displayFormat;

                    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("for", `${displayFormat}RadioInput`);
                    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("aria-label", `${STRINGS.DISPLAYFORMATS_FRIENDLY[displayFormat]}`);
                    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.setAttribute("title", `${STRINGS.DISPLAYFORMATS_FRIENDLY[displayFormat]}`);
                    ELEMENT_NEWDISPLAYRADIOINPUT_LABEL.textContent = STRINGS.DISPLAYFORMATS[displayFormat];

                    ELEMENT_DISPLAYRADIOFIELDSET.append(ELEMENT_NEWDISPLAYRADIOINPUT);
                }

                const ELEMENT_DISPLAYRADIOINPUT_CHECKED = document.querySelector("#displayRadioFieldSet input:first-child");
                ELEMENT_DISPLAYRADIOINPUT_CHECKED.setAttribute("checked", true);

                CHARS.forEach((charData, i) => {
                    const ELEMENT_NEWCHARCONTAINER = TEMPLATE_CHARCONTAINER.cloneNode(true).content;

                    const ELEMENT_NEWCHARCONTAINER_CHAR = ELEMENT_NEWCHARCONTAINER.querySelector(".char");
                    const ELEMENT_NEWCHARCONTAINER_BUTTON = ELEMENT_NEWCHARCONTAINER.querySelector("button");
                    const ELEMENT_NEWCHARCONTAINER_CONTAINER = ELEMENT_NEWCHARCONTAINER.querySelector(".charContainer");
                    
                    ELEMENT_NEWCHARCONTAINER_CONTAINER.dataset.index = i;

                    ELEMENT_NEWCHARCONTAINER_CHAR.textContent = charData.displayFormats.raw;
                    addCharTagClasses(ELEMENT_NEWCHARCONTAINER_CHAR, charData.tags);

                    ELEMENT_NEWCHARCONTAINER_BUTTON.textContent = "copy";
                    setDisplay(ELEMENT_NEWCHARCONTAINER_CONTAINER, document.querySelector("#displayRadioFieldSet input:checked").value);

                    const el = ELEMENT_CHARSCONTAINER.appendChild(ELEMENT_NEWCHARCONTAINER);
                });
                ELEMENT_APPCONTAINER.insertAdjacentElement("beforeend", ELEMENT_CHARSCONTAINER);
            }
        };
    };
}

fetch("/UnicodeData.txt").then(r => r.text()).then(ucdRaw => init(ucdRaw));