const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
const { JSDOM } = require("jsdom");

describe("Test suite", ()=> {
    global.document = new JSDOM(html,toString()).window.document;
    global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
})

test("Lagrer og henter karakter fra localStorage", () => {
    const  { saveCharacter} = require('../app.js')

    document.getElementById("character-name").value = "Tobi";
    document.getElementById("character-hp").value = "100";
    document.getElementById("attack-damage").value = "20";
    document.getElementsByClassName("profile-img")[0].click();

    document.getElementById("create-character").addEventListener("click", ()=> (saveCharacter))
    document.getElementById("create-character").click()

    expect(localStorage.setItem).toHaveBeenCalledWith(
        "character",
        JSON.stringify({
            name: "Tobi",
            hp: 100,
            attack: 20,
            profileImage: "assets/death-knight.jpeg"
        })
    );
});

test("Genererer en fiende og oppdaterer localStorage", () => {
    const { generateRandomEnemy } = require('../app.js');
    
    document.getElementById("generate-enemy").addEventListener("click", ()=> {generateRandomEnemy});
    document.getElementById("generate-enemy").click()

    expect(localStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining("enemy"),
        expect.stringMatching(/"name":".+","image":".+","hp":[0-9]+,"attack":[0-9]+/)
    );
});

test("saveCharacter, generateRandomEnemy og displayBatlleCharacters er definert og er funksjoner", () => {
    const { saveCharacter, generateRandomEnemy, displayBattleCharacters } = require("../app.js");
    expect(saveCharacter).toBeDefined();
    expect(typeof saveCharacter).toBe("function");
    expect(generateRandomEnemy).toBeDefined();
    expect(typeof generateRandomEnemy).toBe("function");
    expect(displayBattleCharacters).toBeDefined();
    expect(typeof displayBattleCharacters).toBe("function");
});
