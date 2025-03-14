// Her kan du skrive testene dine
const { JSDOM } = require("jsdom");

// Simulerer en enkel DOM-struktur for testing
const dom = new JSDOM(`
    <html>
        <body>
            <input id="character-name" />
            <input id="character-hp" />
            <input id="attack-damage" />
            <div id="battle-area"></div>
            <div id="battle-result"></div>
            <button id="create-character"></button>
            <button id="generate-enemy"></button>
            <button id="start-fight"></button>
        </body>
    </html>
`);
global.document = dom.window.document;
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};

// Importer funksjoner fra app.js
const { saveCharacter, generateRandomEnemy, startFight } = require('../app');

// 🟢 Test 1: Lagring og henting av karakter
test("Lagrer og henter karakter fra localStorage", () => {
    document.getElementById("character-name").value = "Tobi";
    document.getElementById("character-hp").value = "100";
    document.getElementById("attack-damage").value = "20";

    saveCharacter();

    expect(localStorage.setItem).toHaveBeenCalledWith(
        "character",
        JSON.stringify({
            name: "Tobi",
            hp: 100,
            attack: 20,
            profileImage: ""
        })
    );
});

// 🟢 Test 2: Genererer en fiende og lagrer i localStorage
test("Genererer en fiende og oppdaterer localStorage", () => {
    generateRandomEnemy();

    expect(localStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining("enemy"),
        expect.stringMatching(/"name":".+","image":".+","hp":[0-9]+,"attack":[0-9]+/)
    );
});

// 🟢 Test 3: Kampfunksjon oppdaterer HP riktig
test("Start kamp: Oppdaterer HP på karakter og fiende", () => {
    localStorage.getItem.mockImplementation((key) => {
        if (key === "character") {
            return JSON.stringify({ name: "Tobi", hp: 100, attack: 20 });
        }
        if (key === "enemy") {
            return JSON.stringify({ name: "Goblin", hp: 50, attack: 10 });
        }
        return null;
    });

    startFight();

    // Sjekker at kampen starter og oppdaterer UI
    const battleResult = document.getElementById("battle-result").innerHTML;
    expect(battleResult).toContain("⚔️ Kampen starter!");
    expect(battleResult).toContain("Tobi angriper Goblin!");
});
