const REVISION = 4;

const TAGS = {
    NONPRINTING: "tagNonPrinting",
}

const TOHEX = i => i.toString(16);
const DISPLAYFORMATTERS = {}

DISPLAYFORMATTERS.raw =                     i => String.fromCodePoint(i);
DISPLAYFORMATTERS.codePoint =               i => `U+${TOHEX(i).toUpperCase().padStart(4, "0")}`;
DISPLAYFORMATTERS.javaScriptHex =           i => `\\x${TOHEX(i).padStart(2, "0")}`;
DISPLAYFORMATTERS.javaScriptUnicode =       i => `\\u${TOHEX(i).padStart(4, "0")}`;
DISPLAYFORMATTERS.ES6Unicode =              i => `\\u{${TOHEX(i).padStart(6, "0")}}`;
DISPLAYFORMATTERS.htmlEntityHex =           i => `&#x${TOHEX(i).toUpperCase()};`;
DISPLAYFORMATTERS.htmlEntityDec =           i => `&#${i};`;
DISPLAYFORMATTERS.url =                     i => {
                                                const out = encodeURIComponent(DISPLAYFORMATTERS.raw(i));
                                                return out.length > 1 ? out : `%${TOHEX(i).toUpperCase()}`
                                            };
DISPLAYFORMATTERS.urld =                    i => encodeURIComponent(DISPLAYFORMATTERS.url(i));

async function getData() {
    let localData = localStorage.getItem("data");

    // Use locally stored data if the version matches
    if (localData?.REVISION == REVISION) return localData;
    // Otherwise prepare for generating data anew
    else {
        localStorage.removeItem("data");
        return fetch("/UnicodeData.txt")
            .then(r => r.text())
            .then(r => {
                const ucdRaw = r;

                // Parse Unicode Data
                const ucdLines = ucdRaw.split("\n");
                const ucdLinesSplit = [];

                for (const ucdLine of ucdLines) {
                    const ucdLineSplit = ucdLine.split(";");
                    const ucdLineCodePoint = ucdLineSplit[0];
                    ucdLinesSplit[parseInt(ucdLineCodePoint, 16)] = ucdLineSplit;
                }

                const d = {};
                d.REVISION = REVISION;
                d.CHARS = [];
                d.STRINGS = {
                    UNDEFINED: "(undefined character)",
                    DISPLAYFORMATS: {
                        codePoint: "U+",
                        javaScriptHex: "\\x",
                        javaScriptUnicode: "\\u",
                        ES6Unicode: "\\u{",
                        htmlEntityHex: "&#x",
                        htmlEntityDec: "&#",
                        url: "%",
                        urld: "%25",
                    },
                    DISPLAYFORMATS_FRIENDLY: {
                        codePoint: "Unicode code points",
                        javaScriptHex: "Hexadecimal JavaScript encoding",
                        javaScriptUnicode: "Hexadecimal Unicode JavaScript encoding",
                        ES6Unicode: "ES6 Unicode encoding",
                        htmlEntityHex: "Hexadecimal HTML encoding",
                        htmlEntityDec: "Decimal HTML encoding",
                        url: "URL encoding",
                        urld: "Double URL encoding",
                    }
                }

                // Generate characters
                for (let i = 0; i < 11263; i++) {
                    d.CHARS[i] = {
                        displayFormats: {},
                        tags: {},
                        ucd: ucdLinesSplit[i]
                    };

                    for (const displayFormatter in DISPLAYFORMATTERS) d.CHARS[i].displayFormats[displayFormatter] = DISPLAYFORMATTERS[displayFormatter](i);

                    // Tag non-printing characters so we can apply styling
                    if (
                        d.CHARS[i].ucd &&
                        (
                            d.CHARS[i].ucd[2] === "Cc" ||
                            d.CHARS[i].ucd[2] === "Cf" ||
                            d.CHARS[i].ucd[2] === "Zl" ||
                            d.CHARS[i].ucd[2] === "Zp" ||
                            d.CHARS[i].ucd[2] === "Zs" ||

                            d.CHARS[i].ucd[4] === "WS"
                        ) ||
                        // Also tag if not defined by Unicode
                        !d.CHARS[i].ucd
                    ) d.CHARS[i].tags[TAGS.NONPRINTING] = true;
                }

                // Store the data locally
                localStorage.setItem("data", JSON.stringify(d));

                return d;
        });
    };
}
