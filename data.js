const REVISION = 1;

const TAGS = {
    NONPRINTING: "tagNonPrinting",
}

// Use locally stored data if the version matches
let localData = localStorage.getItem("data");

const DATA = (() => {
    if (localData?.REVISION == REVISION) return localData;
    else return {};
})();

// Otherwise prepare for generating data anew
DATA.REVISION = REVISION;
DATA.CHARS = [];

// Generate all ASCII characters
for (let i = 0; i < 128; i++) {
    DATA.CHARS[i] = {
        codePoint: `U+${i.toString(16).padStart(4, "0")}`,
        raw: String.fromCodePoint(i),
        htmlEntityHex: `&amp;&num;x${i.toString(16)};`,
        htmlEntityDec: `&amp;&num;${i};`,
        tags: {},
    };

    // Tag non-printing characters
    if (i < 32 || i == 127) DATA.CHARS[i].tags[TAGS.NONPRINTING] = true;
};

// Store the data locally
localStorage.setItem("data", DATA);
