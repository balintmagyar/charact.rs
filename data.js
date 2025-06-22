const REVISION = 2;

const TAGS = {
    NONPRINTING: "tagNonPrinting",
}

const TOHEX = i => i.toString(16).toUpperCase();
const DISPLAYFORMATTERS = {}

DISPLAYFORMATTERS.raw =                 i => String.fromCodePoint(i);
DISPLAYFORMATTERS.codePoint =           i => `U+${TOHEX(i).padStart(4, "0")}`;
DISPLAYFORMATTERS.htmlEntityHex =       i => `&#x${TOHEX(i)};`;
DISPLAYFORMATTERS.htmlEntityDec =       i => `&#${i};`;
DISPLAYFORMATTERS.url =                 i => {
    const out = encodeURIComponent(DISPLAYFORMATTERS.raw(i));
    return out.length > 1 ? out : `%${TOHEX(i)}`
};
DISPLAYFORMATTERS.urld =                i => encodeURIComponent(DISPLAYFORMATTERS.url(i));

// Use locally stored data if the version matches
let localData = localStorage.getItem("data");

const DATA = (() => {
    if (localData?.REVISION == REVISION) return localData;
    else return {};
})();

// Otherwise prepare for generating data anew
DATA.REVISION = REVISION;
DATA.CHARS = [];
DATA.STRINGS = {
    DISPLAYFORMATS: {
        codePoint: "U+002F",
        htmlEntityHex: "&#x2F;",
        htmlEntityDec: "&#47;",
        url: "%2F",
        urld: "%252F",
    }
}

// Generate all ASCII characters
for (let i = 0; i < 128; i++) {
    DATA.CHARS[i] = {
        displayFormats: {},
        tags: {},
    };

    for (const displayFormatter in DISPLAYFORMATTERS) DATA.CHARS[i].displayFormats[displayFormatter] = DISPLAYFORMATTERS[displayFormatter](i);

    // Tag non-printing characters
    if (i < 32 || i == 127) DATA.CHARS[i].tags[TAGS.NONPRINTING] = true;
};

// Store the data locally
localStorage.setItem("data", JSON.stringify(DATA));
