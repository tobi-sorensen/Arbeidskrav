const nameInput = document.getElementById("character-name");
const hpInput = document.getElementById("character-hp");
const attackInput = document.getElementById("attack-damage");
const profileImages = document.querySelectorAll(".profile-img");
const createButton = document.getElementById("create-character");

let selectedProfileImage = "";


profileImages.forEach(image => {
    image.addEventListener("click", () => {
        selectedProfileImage = image.src;
        profileImages.forEach(img => img.classList.remove("selected"));
        image.classList.add("selected");
    });
});


function saveCharacter() {
    if (!nameInput.value || !hpInput.value || !attackInput.value || !selectedProfileImage) {
        console.error("Fyll ut alle feltene og velg et profilbilde!");
        return;
    }

    const character = {
        name: nameInput.value,
        hp: parseInt(hpInput.value),
        attack: parseInt(attackInput.value),
        profileImage: selectedProfileImage
    };

    localStorage.setItem("character", JSON.stringify(character));
    console.log("Karakter lagret!");
}

createButton.addEventListener("click", saveCharacter);


document.addEventListener("DOMContentLoaded", () => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    if (savedCharacter) {
        nameInput.value = savedCharacter.name;
        hpInput.value = savedCharacter.hp;
        attackInput.value = savedCharacter.attack;
        selectedProfileImage = savedCharacter.profileImage;

        profileImages.forEach(img => {
            if (img.src === selectedProfileImage) {
                img.classList.add("selected");
            }
        });
    }
});


const generateEnemyButton = document.getElementById("generate-enemy");

const enemies = [
    { name: "Goblin", image: "assets/swamp-monster.jpg" },
    { name: "Ork", image: "assets/monster.jpg" },
    { name: "Drage", image: "assets/dragon.jpg" }
];

function generateRandomEnemy() {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    const randomHP = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
    const randomAttack = Math.floor(Math.random() * (40 - 10 + 1)) + 10;

    const enemy = {
        name: randomEnemy.name,
        image: randomEnemy.image,
        hp: randomHP,
        attack: randomAttack
    };

    localStorage.setItem("enemy", JSON.stringify(enemy));

    document.getElementById("enemy-img").src = enemy.image;
    document.getElementById("enemy-name").innerText = `Navn: ${enemy.name}`;
    document.getElementById("enemy-hp").innerText = `HP: ${enemy.hp}`;
    document.getElementById("enemy-attack").innerText = `Angrep: ${enemy.attack}`;

    console.log(`Fiende generert: ${enemy.name} med ${enemy.hp} HP og ${enemy.attack} angrep!`);
}

generateEnemyButton.addEventListener("click", generateRandomEnemy);


const battleArea = document.getElementById("battle-area");
const resultDisplay = document.getElementById("battle-result");

function displayBattleCharacters() {
    const savedHero = JSON.parse(localStorage.getItem("character"));
    const savedEnemy = JSON.parse(localStorage.getItem("enemy"));

    if (!savedHero || !savedEnemy) {
        console.error("Du må ha både en helt og en fiende for å starte kamp!");
        return;
    }

    battleArea.innerHTML = `
        <h1>Sloss!</h1>
        <div id="character-display" class="profile-card">
            <h2>Helten</h2>
            <img id="char-img" src="${savedHero.profileImage}" alt="Profilbilde" />
            <p id="char-name"><strong>Navn:</strong> ${savedHero.name}</p>
            <p id="char-hp"><strong>HP:</strong> ${savedHero.hp}</p>
            <p id="char-attack"><strong>Angrep:</strong> ${savedHero.attack}</p>
        </div>
        <div id="enemy-fight-display" class="profile-card">
            <h2>Fiende</h2>
            <img id="enemy-fight-img" src="${savedEnemy.image}" alt="Fiendens profilbilde" />
            <p id="enemy-fight-name"><strong>Navn:</strong> ${savedEnemy.name}</p>
            <p id="enemy-fight-hp"><strong>HP:</strong> ${savedEnemy.hp}</p>
            <p id="enemy-fight-attack"><strong>Angrep:</strong> ${savedEnemy.attack}</p>
        </div>
        <button id="start-fight">Start kamp</button>
        <p id="battle-result"></p>
    `;

    document.getElementById("start-fight").addEventListener("click", startFight);
}


function startFight() {
    displayBattleCharacters()
    const savedHero = JSON.parse(localStorage.getItem("character"));
    const savedEnemy = JSON.parse(localStorage.getItem("enemy"));

    if (!savedHero || !savedEnemy) {
        console.error("Du må ha både en helt og en fiende for å starte kamp!");
        return;
    }

    let heroHP = parseInt(savedHero.hp);
    let enemyHP = parseInt(savedEnemy.hp);
    const heroAttack = parseInt(savedHero.attack);
    const enemyAttack = parseInt(savedEnemy.attack);

    const resultDisplay = document.getElementById("battle-result");
    const charHpElement = document.getElementById("char-hp");
    const enemyHpElement = document.getElementById("enemy-fight-hp");

    resultDisplay.innerHTML = "Kampen starter!";

    function updateUI() {
        charHpElement.innerHTML = `<strong>HP:</strong> ${Math.max(heroHP, 0)}`;
        enemyHpElement.innerHTML = `<strong>HP:</strong> ${Math.max(enemyHP, 0)}`;
    }

    enemyHP -= heroAttack;
    resultDisplay.innerHTML += `<br>${savedHero.name} angriper ${savedEnemy.name}! ${savedEnemy.name} har ${Math.max(enemyHP, 0)} HP igjen.`;
    
    heroHP -= enemyAttack;
    resultDisplay.innerHTML += `<br>${savedEnemy.name} angriper ${savedHero.name}! ${savedHero.name} har ${Math.max(heroHP, 0)} HP igjen.`;

    updateUI();

    if (heroHP > enemyHP) {
        resultDisplay.innerHTML += `<br>${savedHero.name} vant kampen!`;
    } else if (enemyHP > heroHP) {
        resultDisplay.innerHTML += `<br>${savedEnemy.name} vant kampen!`;
    } else {
        resultDisplay.innerHTML += `<br>Det ble uavgjort!`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-fight")?.removeEventListener("click", startFight);
    document.getElementById("start-fight")?.addEventListener("click", startFight);
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = { saveCharacter, generateRandomEnemy, displayBattleCharacters}
}
