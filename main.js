function addCharTagClasses (element, tags) {
    for (const tag in tags) if (Object.prototype.hasOwnProperty.call(tags, tag)) element.classList.add(tag);
}

const appContainer = document.getElementById("app");

const charsContainer = document.createElement("div");
charsContainer.classList.add("charsContainer");
charsContainer.classList.add("grid");

DATA.CHARS.forEach(currentChar => {
    // Create elements
    const charContainer = document.createElement("div");
    charContainer.classList.add("charContainer");

    const charDisplay   = document.createElement("div");
    charDisplay.insertAdjacentText("beforeend", currentChar.raw);
    charDisplay.classList.add("char");
    addCharTagClasses(charDisplay, currentChar.tags);

    const charCodePoint = document.createElement("div");
    charCodePoint.insertAdjacentText("beforeend", currentChar.codePoint);
    charCodePoint.classList.add("codePoint");

    const charActionCopy = document.createElement("button");
    charActionCopy.insertAdjacentText("beforeend", "copy");

    charContainer.insertAdjacentElement("beforeend", charDisplay);
    charContainer.insertAdjacentElement("beforeend", charCodePoint);
    charContainer.insertAdjacentElement("beforeend", charActionCopy);

    // Add click to copy behavior
    charActionCopy.setAttribute("data-success", "copied");
    charActionCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(currentChar.raw);
    });

    // Add everything to the container
    charsContainer.insertAdjacentElement("beforeend", charContainer);
});
appContainer.insertAdjacentElement("afterbegin", charsContainer);
