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


STRINGS = {
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
};

function getData(ucdRaw) {
    // Parse Unicode Data
    const ucdLines = ucdRaw.split("\n");
    const ucdLinesSplit = [];
    for (const ucdLine of ucdLines) {
        const ucdLineSplit = ucdLine.split(";");
        const ucdLineCodePoint = ucdLineSplit[0];
        ucdLinesSplit[parseInt(ucdLineCodePoint, 16)] = ucdLineSplit;
    }
    // Generate characters
    const d = [];
    for (let i = 0; i < 11263; i++) {
        d[i] = {
            codePointDec: i,
            codePointHex: i.toString(16).padStart(4, "0"),
            displayFormats: {},
            tags: {},
            ucd: ucdLinesSplit[i]
        };

        for (const displayFormatter in DISPLAYFORMATTERS) d[i].displayFormats[displayFormatter] = DISPLAYFORMATTERS[displayFormatter](i);

        // Tag non-printing characters so we can apply styling
        if (d[i].ucd &&
            (
                d[i].ucd[2] === "Cc" ||
                d[i].ucd[2] === "Cf" ||
                d[i].ucd[2] === "Zl" ||
                d[i].ucd[2] === "Zp" ||
                d[i].ucd[2] === "Zs" ||

                d[i].ucd[4] === "WS"
            ) ||
            // Also tag if not defined by Unicode
            !d[i].ucd) d[i].tags[TAGS.NONPRINTING] = true;
    }

    return d;
}
