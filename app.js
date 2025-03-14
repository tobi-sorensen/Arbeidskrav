// Del 1: Lag karakter og lagre karakteren i localStorage
const nameInput = document.getElementById("character-name");
const hpInput = document.getElementById("character-hp");
const attackInput = document.getElementById("attack-damage");
const profileImages = document.querySelectorAll(".profile-img");
const createButton = document.getElementById("create-character");

let selectedProfileImage = "";

// Velg profilbilde
profileImages.forEach(image => {
    image.addEventListener("click", () => {
        selectedProfileImage = image.src;
        profileImages.forEach(img => img.classList.remove("selected"));
        image.classList.add("selected");
    });
});

// Lagre karakter
function saveCharacter() {
    if (!nameInput.value || !hpInput.value || !attackInput.value || !selectedProfileImage) {
        alert("Fyll ut alle feltene og velg et profilbilde!");
        return;
    }

    const character = {
        name: nameInput.value,
        hp: parseInt(hpInput.value),
        attack: parseInt(attackInput.value),
        profileImage: selectedProfileImage
    };

    localStorage.setItem("character", JSON.stringify(character));
    alert("Karakter lagret!");
}

createButton.addEventListener("click", saveCharacter);

// Last karakter ved oppstart
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

// Del 2: Generer fiende
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

    alert(`Fiende generert: ${enemy.name} med ${enemy.hp} HP og ${enemy.attack} angrep!`);
}

generateEnemyButton.addEventListener("click", generateRandomEnemy);

// Del 3: Vis helten og fienden i kampområdet
const battleArea = document.getElementById("battle-area");
const resultDisplay = document.getElementById("battle-result");

function displayBattleCharacters() {
    const savedHero = JSON.parse(localStorage.getItem("character"));
    const savedEnemy = JSON.parse(localStorage.getItem("enemy"));

    if (!savedHero || !savedEnemy) {
        alert("Du må ha både en helt og en fiende for å starte kamp!");
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

// Kampfunksjon
function startFight() {
    // Sørg for at kampområdet er lastet inn før kampen starter
    displayBattleCharacters(); 

    const savedHero = JSON.parse(localStorage.getItem("character"));
    const savedEnemy = JSON.parse(localStorage.getItem("enemy"));

    if (!savedHero || !savedEnemy) {
        alert("Du må ha både en helt og en fiende for å starte kamp!");
        return;
    }

    let heroHP = parseInt(savedHero.hp);
    let enemyHP = parseInt(savedEnemy.hp);
    const heroAttack = parseInt(savedHero.attack);
    const enemyAttack = parseInt(savedEnemy.attack);

    const resultDisplay = document.getElementById("battle-result");
    const charHpElement = document.getElementById("char-hp");
    const enemyHpElement = document.getElementById("enemy-fight-hp");

    // Sjekk om HTML-elementene finnes
    if (!resultDisplay || !charHpElement || !enemyHpElement) {
        alert("Feil: Kampområdet er ikke lastet inn riktig. Prøv å generere en fiende først.");
        return;
    }

    // Nullstill kampresultatet
    resultDisplay.innerHTML = "⚔️ Kampen starter!";

    function updateUI() {
        charHpElement.innerHTML = `<strong>HP:</strong> ${Math.max(heroHP, 0)}`;
        enemyHpElement.innerHTML = `<strong>HP:</strong> ${Math.max(enemyHP, 0)}`;
    }

    function fightRound() {
        if (heroHP > 0 && enemyHP > 0) {
            enemyHP -= heroAttack;
            resultDisplay.innerHTML += `<br>${savedHero.name} angriper ${savedEnemy.name}! ${savedEnemy.name} har ${Math.max(enemyHP, 0)} HP igjen.`;
            updateUI();

            if (enemyHP <= 0) {
                resultDisplay.innerHTML += `<br>🎉 ${savedHero.name} vant kampen!`;
                return;
            }

            setTimeout(() => {
                heroHP -= enemyAttack;
                resultDisplay.innerHTML += `<br>${savedEnemy.name} angriper ${savedHero.name}! ${savedHero.name} har ${Math.max(heroHP, 0)} HP igjen.`;
                updateUI();

                if (heroHP <= 0) {
                    resultDisplay.innerHTML += `<br>😢 ${savedEnemy.name} vant kampen!`;
                    return;
                }

                setTimeout(fightRound, 1000);
            }, 1000);
        }
    }

    updateUI(); // Oppdater HP-visning før første angrep
    setTimeout(fightRound, 1000);
}

// Koble riktig event listener til knappen, men sørg for at det ikke legges til flere ganger
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-fight")?.removeEventListener("click", startFight);
    document.getElementById("start-fight")?.addEventListener("click", startFight);
});

export default { saveCharacter, generateRandomEnemy, startFight };