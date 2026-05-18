/**
 * Retro-horror mode for the embedded The Final Fate engine.
 * The original loop, collision, score, lives, bullets, enemies, and level
 * loading model stay in use; this file narrows the experience into a stable
 * browser arcade mode with a new presentation layer.
 */

var themePalette = {
    black: "#02030a",
    deep: "#07111d",
    red: "#ff2b25",
    amber: "#ffb04f",
    blue: "#44d6ff",
    purple: "#8e4dff",
    white: "#fff1e8",
    green: "#78ff9a"
};

var nightLevelNames = [
    "Small Town",
    "Power Lab",
    "Signal Forest",
    "Mirror Realm",
    "Red Moon"
];

masterVolume = 58;

function safelyPlay(soundObject, restart) {
    if (!soundObject) {
        return;
    }
    soundObject.pause();
    soundObject.volume = masterVolume / 100;
    if (restart) {
        soundObject.currentTime = 0;
    }
    var playResult = soundObject.play();
    if (playResult && playResult.catch) {
        playResult.catch(function () {});
    }
}

simplyPlaySound = function (soundObject) {
    safelyPlay(soundObject, true);
};

function addNightBurst(x, y, color, life, size) {
    if (!displayList) {
        return;
    }

    var burst = new GameObject();
    burst.middleX = x;
    burst.middleY = y;
    burst.color = color || themePalette.red;
    burst.life = life || 12;
    burst.size = size || 1;
    burst.updateState = function () {
        this.frameCounter++;
        if (this.frameCounter > this.life) {
            this.invalid = true;
        }
    };
    burst.renderState = function () {
        var progress = this.frameCounter / this.life;
        var radius = (2 + progress * 7) * this.size;
        var alpha = Math.max(0, 1 - progress);
        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = this.color;
        context.fillRect((this.middleX - radius) * 10, this.middleY * 10, radius * 20, 10);
        context.fillRect(this.middleX * 10, (this.middleY - radius) * 10, 10, radius * 20);
        context.fillStyle = themePalette.amber;
        context.fillRect((this.middleX - radius / 2) * 10, (this.middleY - radius / 2) * 10, radius * 10, radius * 10);
        context.restore();
    };
    displayList.addElement(burst, false);
}

function themeGrid() {
    context.fillStyle = themePalette.black;
    context.fillRect(0, 0, oldestWidth, oldestHeight);

    var pulse = Math.sin(aniCount / 24) * 0.08;
    context.globalAlpha = 0.22 + pulse;
    context.fillStyle = "#101c2b";
    for (var y = 0; y < oldestHeight; y += 24) {
        context.fillRect(0, y, oldestWidth, 1);
    }

    context.globalAlpha = 0.16;
    context.fillStyle = themePalette.red;
    for (var x = 0; x < oldestWidth; x += 80) {
        context.fillRect(x, 0, 1, oldestHeight);
    }

    context.globalAlpha = 1;
}

clearScreen = themeGrid;

function nightBackgroundRender() {
    themeGrid();

    context.fillStyle = "#0a1424";
    context.fillRect(0, 370, 800, 180);
    context.fillStyle = "#111b2d";
    for (var i = 0; i < 10; i++) {
        var houseX = i * 86 - 30;
        var houseH = 68 + (i % 3) * 18;
        context.fillRect(houseX, 370 - houseH, 52, houseH);
        context.fillStyle = i % 2 ? themePalette.amber : "#152944";
        context.fillRect(houseX + 12, 356 - houseH, 8, 8);
        context.fillRect(houseX + 30, 380 - houseH, 8, 8);
        context.fillStyle = "#111b2d";
    }

    context.fillStyle = "#0d0f19";
    context.fillRect(0, 470, 800, 80);
    context.fillStyle = themePalette.red;
    context.fillRect(0, 469, 800, 3);
    context.globalAlpha = 0.44;
    context.fillStyle = themePalette.amber;
    context.fillRect(64, 432, 660, 1);
    context.globalAlpha = 1;
}

function makeNightBackground() {
    var bg = new GameObject();
    bg.updateState = func_noOp;
    bg.renderState = nightBackgroundRender;
    return bg;
}

function nightMonsterDimension() {
    var x = [];
    var y = [];
    for (var dx = -2; dx <= 2; dx++) {
        for (var dy = -2; dy <= 2; dy++) {
            if (Math.abs(dx) + Math.abs(dy) < 4) {
                x.push(this.middleX + dx);
                y.push(this.middleY + dy);
            }
        }
    }
    return [x, y];
}

function nightMonsterUpdate() {
    this.frameCounter++;
    this.middleY += this.speed || 1;
    if (this.wobble) {
        this.middleX += Math.sin(this.frameCounter / 12) * this.wobble;
    }
    if (this.middleY > 68) {
        this.invalid = true;
    }
}

function nightMonsterRender() {
    var bodyColor = this.variant === 1 ? themePalette.purple : themePalette.red;
    var eyeColor = this.variant === 2 ? themePalette.green : themePalette.white;
    context.fillStyle = bodyColor;
    context.fillRect((this.middleX - 2) * 10, (this.middleY - 1) * 10, 50, 20);
    context.fillRect((this.middleX - 1) * 10, (this.middleY - 2) * 10, 30, 10);
    context.fillRect((this.middleX - 1) * 10, (this.middleY + 1) * 10, 10, 10);
    context.fillRect((this.middleX + 1) * 10, (this.middleY + 1) * 10, 10, 10);
    context.fillStyle = "#050205";
    context.fillRect((this.middleX - 1) * 10 + 2, (this.middleY - 1) * 10 + 3, 7, 7);
    context.fillRect((this.middleX + 1) * 10 + 1, (this.middleY - 1) * 10 + 3, 7, 7);
    context.fillStyle = eyeColor;
    context.fillRect((this.middleX - 1) * 10 + 4, (this.middleY - 1) * 10 + 5, 3, 3);
    context.fillRect((this.middleX + 1) * 10 + 3, (this.middleY - 1) * 10 + 5, 3, 3);
}

function nightBossDimension() {
    var x = [];
    var y = [];
    for (var dx = -6; dx <= 6; dx++) {
        for (var dy = -3; dy <= 4; dy++) {
            if (Math.abs(dx) < 6 || Math.abs(dy) < 3) {
                x.push(Math.round(this.middleX + dx));
                y.push(Math.round(this.middleY + dy));
            }
        }
    }
    return [x, y];
}

function nightBossUpdate() {
    this.frameCounter++;
    if (!this.spawnAnnounced) {
        this.spawnAnnounced = true;
        simplyPlaySound(sfx5 || sfx1);
        addNightBurst(this.middleX, this.middleY, themePalette.amber, 14, 1.25);
    }
    if (this.middleY < 14) {
        this.middleY += 0.25;
    }
    this.middleX += this.direction * 0.35;
    if (this.middleX > 69 || this.middleX < 11) {
        this.direction *= -1;
    }
}

function nightBossRender() {
    var flicker = aniCount % 18 < 9;
    context.fillStyle = flicker ? "#5a1028" : themePalette.purple;
    context.fillRect((this.middleX - 6) * 10, (this.middleY - 2) * 10, 130, 50);
    context.fillRect((this.middleX - 4) * 10, (this.middleY - 4) * 10, 90, 30);
    context.fillRect((this.middleX - 8) * 10, this.middleY * 10, 30, 20);
    context.fillRect((this.middleX + 6) * 10, this.middleY * 10, 30, 20);
    context.fillStyle = themePalette.red;
    context.fillRect((this.middleX - 3) * 10, (this.middleY - 2) * 10, 18, 10);
    context.fillRect((this.middleX + 2) * 10, (this.middleY - 2) * 10, 18, 10);
    context.fillStyle = themePalette.amber;
    context.fillRect((this.middleX - 5) * 10, (this.middleY + 3) * 10, 110, 6);
    context.fillStyle = themePalette.white;
    context.font = "11px monospace";
    context.fillText("BOSS", (this.middleX - 2) * 10, (this.middleY + 5) * 10);
}

function nightBossInvalidate() {
    if (this.invalid) {
        return;
    }
    this.hp -= 8;
    addNightBurst(this.middleX, this.middleY, themePalette.red, 8, 0.75);
    context.globalAlpha = 0.5;
    context.fillStyle = themePalette.red;
    context.fillRect(0, 0, oldestWidth, oldestHeight);
    context.globalAlpha = 1;
    if (this.hp <= 0) {
        addNightBurst(this.middleX, this.middleY, themePalette.amber, 20, 2.2);
        simplyPlaySound(sfx1);
        this.invalid = true;
    }
}

function nightMonsterInvalidate() {
    if (this.invalid) {
        return;
    }
    addNightBurst(this.middleX, this.middleY, this.variant === 2 ? themePalette.green : themePalette.red, 10, 0.72);
    this.invalid = true;
}

function createNightMonster(x, y, levelIndex, variant) {
    var monster = new Enemy(
        x,
        y,
        nightMonsterDimension,
        nightMonsterUpdate,
        nightMonsterRender,
        10 + levelIndex * 2,
        true,
        1,
        nightMonsterInvalidate
    );
    monster.speed = 0.55 + levelIndex * 0.08 + (variant % 2) * 0.18;
    monster.wobble = variant === 2 ? 0.22 : 0;
    monster.variant = variant;
    return monster;
}

function createNightBoss(levelIndex) {
    var boss = new Enemy(
        40,
        8,
        nightBossDimension,
        nightBossUpdate,
        nightBossRender,
        30,
        true,
        10,
        nightBossInvalidate,
        70 + levelIndex * 28
    );
    boss.direction = levelIndex % 2 ? -1 : 1;
    return boss;
}

function nightGateLoader(levelIndex) {
    background = makeNightBackground();
    level_names[levelIndex] = nightLevelNames[levelIndex] || nightLevelNames[0];

    var frame = 20;
    var waves = 18 + levelIndex * 5;
    for (var i = 0; i < waves; i++) {
        var x = 8 + ((i * 13 + levelIndex * 7) % 65);
        var variant = i % 3;
        Spawn.createAndAddSpawn(frame, createNightMonster(x, -4, levelIndex, variant));
        frame += Math.max(14, 30 - levelIndex * 3);
    }

    giant_boss = createNightBoss(levelIndex);
    Spawn.createAndAddSpawn(frame + 42, giant_boss);
}

earthLoader = function () {
    nightGateLoader(0);
};

solarSystemLoader = function () {
    nightGateLoader(1);
};

universeLoader = function () {
    nightGateLoader(2);
};

blinkyHomeworldLoader = function () {
    nightGateLoader(3);
};

metallicMoonLoader = function () {
    nightGateLoader(4);
};

checkLeaveLevel = function () {
    if (player.health <= 0) {
        loseLife();
    }
    if (giant_boss !== null && giant_boss.invalid) {
        player.level = (player.level + 1) % 5;
        loadLevel();
    }
};

boot = function () {
    initGame(0);
};

gamePause = function () {
    validateReleasedState();
    selectedOption = selectedOption > 1 ? 0 : selectedOption;

    if (pause && pauseReleased) {
        pauseReleased = false;
        safelyPlay(player.level < 4 ? bgm : bgm_special, false);
        exchangeRenderLoop(gamePlay, true);
        return;
    }

    if ((left || up) && axisXReleased) {
        selectedOption = 0;
        axisXReleased = false;
        simplyPlaySound(sfx4);
    } else if ((right || down) && axisXReleased) {
        selectedOption = 1;
        axisXReleased = false;
        simplyPlaySound(sfx4);
    }

    if (shoot && shootReleased) {
        shootReleased = false;
        simplyPlaySound(sfx4);
        if (selectedOption === 0) {
            safelyPlay(player.level < 4 ? bgm : bgm_special, false);
            exchangeRenderLoop(gamePlay, true);
        } else {
            window.parent.postMessage({ type: "final-fate-exit" }, window.location.origin);
        }
        return;
    }

    window.requestAnimationFrame(renderInGame);
};

pauseText = ["Continue", "Exit"];
youSure = ["No", "Yes"];
youSureQuestion = ["Exit game?"];

renderHUD = function () {
    var danger = player.health < 40 && aniCount % 40 < 20;
    context.fillStyle = danger ? "#5a0d16" : "#08101b";
    context.fillRect(0, 550, 800, 50);
    context.fillStyle = themePalette.red;
    context.fillRect(0, 550, 800, 2);
    context.fillStyle = themePalette.white;
    context.font = "25px monospace";
    context.fillText(player.score, 0, 581);
    context.fillText(player.health, 245, 581);
    context.fillText(player.lifes, 350, 581);
    context.fillText(player.level + 1, 700, 581);
    context.font = "12px monospace";
    context.fillStyle = themePalette.amber;
    context.fillText("SCORE", 0, 595);
    context.fillText("SIGNAL", 245, 595);
    context.fillText("LIVES", 350, 595);
    context.fillText("GATE", 700, 595);
};

title_and_copyright_render = function () {
    clearScreen();
    context.font = "58px Georgia, serif";
    context.fillStyle = themePalette.red;
    context.shadowColor = themePalette.red;
    context.shadowBlur = 18;
    context.fillText("NIGHT GATE", 190, 145);
    context.shadowBlur = 0;
    context.font = "20px monospace";
    context.fillStyle = themePalette.blue;
    context.fillText("ARCADE INCIDENT FILE 1986", 228, 185);
    context.font = "14px monospace";
    context.fillStyle = themePalette.white;
    context.fillText("Original engine: The Final Fate / MIT", 226, 580);
    context.fillText("Retro-horror reskin", 535, 580);
};

window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.type !== "final-fate-muted") {
        return;
    }
    masterVolume = event.data.muted ? 0 : 58;
    [bgm, bgm_special, bgm_sus, sfx0, sfx1, sfx2, sfx3, sfx4, sfx5, game_over].forEach(function (media) {
        if (media) {
            media.muted = Boolean(event.data.muted);
            media.volume = masterVolume / 100;
        }
    });
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        if (renderTimer !== null) {
            clearInterval(renderTimer);
            renderTimer = null;
        }
        [bgm, bgm_special, bgm_sus].forEach(function (media) {
            if (media) {
                media.pause();
            }
        });
        return;
    }

    if (renderTimer === null && renderFunction) {
        exchangeRenderLoop(renderFunction, true);
    }
    if (renderFunction === gamePlay && masterVolume > 0) {
        safelyPlay(player.level < 4 ? bgm : bgm_special, false);
    }
});
