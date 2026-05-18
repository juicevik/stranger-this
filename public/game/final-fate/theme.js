/**
 * Stranger Things arcade mode.
 *
 * The original The Final Fate files are still loaded for MIT attribution,
 * input helpers, canvas setup, and SFX assets. Combat is handled here so the
 * shooter behavior is deterministic across desktop and mobile.
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

var strangerArcadeStarted = false;
var strangerArcadeFrame = null;
var strangerArcadeState = null;
var strangerArcadeLastTick = 0;
var strangerArcadePaused = false;
var strangerArcadeMuted = false;

masterVolume = 100;

function safelyPlay(soundObject, restart) {
    if (!soundObject || strangerArcadeMuted) {
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

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function rectsCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function monsterCountForCycle(cycle) {
    if (cycle === 1) {
        return 5;
    }
    if (cycle === 2) {
        return 7;
    }
    return 10 + (cycle - 3) * 3;
}

function makeExplosion(x, y, color, size, life) {
    return {
        x: x,
        y: y,
        color: color,
        size: size || 1,
        life: life || 18,
        age: 0
    };
}

function resetArcadeGame() {
    strangerArcadeState = {
        cycle: 1,
        score: 0,
        lives: 3,
        phase: "monsters",
        player: { x: 400, y: 520, w: 34, h: 34, cooldown: 0, invuln: 0 },
        bullets: [],
        monsters: [],
        bossBullets: [],
        explosions: [],
        spawned: 0,
        spawnTimer: 28,
        boss: null,
        bossFireTimer: 90,
        gameOver: false,
        complete: false,
        pauseHeld: false,
        shootHeld: false
    };
    window.__strangerArcade = strangerArcadeState;
}

function playerRect() {
    var p = strangerArcadeState.player;
    return { x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h };
}

function monsterRect(monster) {
    return { x: monster.x - monster.w / 2, y: monster.y - monster.h / 2, w: monster.w, h: monster.h };
}

function bossRect() {
    var boss = strangerArcadeState.boss;
    return { x: boss.x - boss.w / 2, y: boss.y - boss.h / 2, w: boss.w, h: boss.h };
}

function bulletRect(bullet) {
    return { x: bullet.x - 3, y: bullet.y - 18, w: 6, h: 20 };
}

function bossBulletRect(bullet) {
    return { x: bullet.x - 5, y: bullet.y - 5, w: 10, h: 10 };
}

function damagePlayer() {
    var state = strangerArcadeState;
    if (state.player.invuln > 0 || state.gameOver || state.complete) {
        return;
    }
    state.lives -= 1;
    state.player.invuln = 34;
    state.explosions.push(makeExplosion(state.player.x, state.player.y, themePalette.red, 1.1, 16));
    simplyPlaySound(sfx3);
    if (state.lives <= 0) {
        state.gameOver = true;
        state.phase = "gameover";
    }
}

function spawnMonster() {
    var state = strangerArcadeState;
    var lane = state.spawned % 7;
    var x = 95 + ((state.spawned * 91 + state.cycle * 37) % 610);
    state.monsters.push({
        x: x,
        y: -26,
        w: 44,
        h: 26,
        speed: 1.45 + state.cycle * 0.16,
        wobble: lane % 2 ? 1.35 : -1.1,
        age: 0,
        variant: lane % 3
    });
    state.spawned += 1;
}

function spawnBoss() {
    var state = strangerArcadeState;
    state.phase = "boss";
    state.boss = {
        x: 400,
        y: -66,
        w: 132,
        h: 72,
        hp: 10,
        maxHp: 10,
        dir: state.cycle % 2 ? 1 : -1,
        hitFlash: 0,
        age: 0
    };
    state.bossFireTimer = 88;
    state.explosions.push(makeExplosion(400, 82, themePalette.amber, 1.6, 22));
    simplyPlaySound(sfx5);
}

function nextCycle() {
    var state = strangerArcadeState;
    if (state.cycle >= 10) {
        state.complete = true;
        state.phase = "complete";
        return;
    }
    state.cycle += 1;
    state.phase = "monsters";
    state.monsters = [];
    state.bossBullets = [];
    state.bullets = [];
    state.boss = null;
    state.spawned = 0;
    state.spawnTimer = 36;
    state.player.x = 400;
    state.player.y = 520;
}

function updateArcadeInput() {
    var state = strangerArcadeState;
    if (pause && !state.pauseHeld) {
        strangerArcadePaused = !strangerArcadePaused;
        state.pauseHeld = true;
    } else if (!pause) {
        state.pauseHeld = false;
    }

    if (state.gameOver || state.complete) {
        if (shoot && !state.shootHeld) {
            resetArcadeGame();
            strangerArcadePaused = false;
        }
        state.shootHeld = Boolean(shoot);
        return;
    }

    if (strangerArcadePaused) {
        return;
    }

    var player = state.player;
    if (left) {
        player.x -= 6;
    }
    if (right) {
        player.x += 6;
    }
    player.x = clamp(player.x, 28, 772);

    if (player.cooldown > 0) {
        player.cooldown -= 1;
    }
    if (player.invuln > 0) {
        player.invuln -= 1;
    }
    if (shoot && player.cooldown <= 0) {
        state.bullets.push({ x: player.x, y: player.y - 24, speed: 12 });
        player.cooldown = 8;
        simplyPlaySound(sfx0);
    }
}

function updateMonsters() {
    var state = strangerArcadeState;
    if (state.phase !== "monsters") {
        return;
    }

    var target = monsterCountForCycle(state.cycle);
    if (state.spawned < target) {
        state.spawnTimer -= 1;
        if (state.spawnTimer <= 0) {
            spawnMonster();
            state.spawnTimer = Math.max(18, 58 - state.cycle * 3);
        }
    }

    var pRect = playerRect();
    state.monsters.forEach(function (monster) {
        monster.age += 1;
        monster.y += monster.speed;
        monster.x += Math.sin(monster.age / 14) * monster.wobble;
        if (!monster.dead && rectsCollide(pRect, monsterRect(monster))) {
            monster.dead = true;
            state.explosions.push(makeExplosion(monster.x, monster.y, themePalette.red, 0.9, 14));
            damagePlayer();
        }
        if (monster.y > 650) {
            monster.dead = true;
        }
    });
    state.monsters = state.monsters.filter(function (monster) { return !monster.dead; });

    if (state.spawned >= target && state.monsters.length === 0) {
        spawnBoss();
    }
}

function fireBossVolley() {
    var state = strangerArcadeState;
    var boss = state.boss;
    var shots = state.cycle;
    var baseSpeed = 4.1 + state.cycle * 0.12;
    for (var i = 0; i < shots; i++) {
        var spread = shots === 1 ? 0 : (i - (shots - 1) / 2) * 0.12;
        var dx = state.player.x - boss.x;
        var dy = state.player.y - boss.y;
        var length = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        state.bossBullets.push({
            x: boss.x,
            y: boss.y + 36,
            vx: (dx / length + spread) * baseSpeed,
            vy: Math.max(2.8, dy / length * baseSpeed)
        });
    }
    simplyPlaySound(sfx5);
}

function updateBoss() {
    var state = strangerArcadeState;
    var boss = state.boss;
    if (state.phase !== "boss" || !boss) {
        return;
    }
    boss.age += 1;
    if (boss.y < 86) {
        boss.y += 2.2;
    } else {
        boss.x += boss.dir * (2.1 + state.cycle * 0.05);
        if (boss.x > 706 || boss.x < 94) {
            boss.dir *= -1;
        }
    }
    if (boss.hitFlash > 0) {
        boss.hitFlash -= 1;
    }
    state.bossFireTimer -= 1;
    if (state.bossFireTimer <= 0) {
        fireBossVolley();
        state.bossFireTimer = Math.max(58, 118 - state.cycle * 5);
    }
}

function updateBulletsArcade() {
    var state = strangerArcadeState;
    state.bullets.forEach(function (bullet) {
        bullet.y -= bullet.speed;
        if (bullet.y < -20) {
            bullet.dead = true;
        }
    });

    state.bullets.forEach(function (bullet) {
        if (bullet.dead) {
            return;
        }
        var bRect = bulletRect(bullet);
        state.monsters.forEach(function (monster) {
            if (!monster.dead && rectsCollide(bRect, monsterRect(monster))) {
                monster.dead = true;
                bullet.dead = true;
                state.score += 1;
                state.explosions.push(makeExplosion(monster.x, monster.y, monster.variant === 2 ? themePalette.green : themePalette.red, 1, 16));
                simplyPlaySound(sfx1);
            }
        });
        if (state.boss && !bullet.dead && rectsCollide(bRect, bossRect())) {
            bullet.dead = true;
            state.boss.hp -= 1;
            state.boss.hitFlash = 6;
            state.explosions.push(makeExplosion(bullet.x, bullet.y, themePalette.amber, 0.85, 12));
            simplyPlaySound(sfx1);
            if (state.boss.hp <= 0) {
                state.score += 10;
                state.explosions.push(makeExplosion(state.boss.x, state.boss.y, themePalette.amber, 2.8, 34));
                state.boss = null;
                state.bossBullets = [];
                nextCycle();
            }
        }
    });
    state.bullets = state.bullets.filter(function (bullet) { return !bullet.dead; });
    state.monsters = state.monsters.filter(function (monster) { return !monster.dead; });
}

function updateBossBullets() {
    var state = strangerArcadeState;
    var pRect = playerRect();
    state.bossBullets.forEach(function (bullet) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (rectsCollide(pRect, bossBulletRect(bullet))) {
            bullet.dead = true;
            damagePlayer();
        }
        if (bullet.y > 640 || bullet.x < -30 || bullet.x > 830) {
            bullet.dead = true;
        }
    });
    state.bossBullets = state.bossBullets.filter(function (bullet) { return !bullet.dead; });
}

function updateExplosions() {
    var state = strangerArcadeState;
    state.explosions.forEach(function (explosion) {
        explosion.age += 1;
        if (explosion.age > explosion.life) {
            explosion.dead = true;
        }
    });
    state.explosions = state.explosions.filter(function (explosion) { return !explosion.dead; });
}

function updateArcade() {
    updateArcadeInput();
    if (strangerArcadePaused || strangerArcadeState.gameOver || strangerArcadeState.complete) {
        updateExplosions();
        return;
    }
    updateBulletsArcade();
    updateMonsters();
    updateBoss();
    updateBossBullets();
    updateExplosions();
}

function drawBackground() {
    context.fillStyle = themePalette.black;
    context.fillRect(0, 0, 800, 600);
    context.globalAlpha = 0.22;
    context.fillStyle = "#101c2b";
    for (var y = 0; y < 600; y += 24) {
        context.fillRect(0, y, 800, 1);
    }
    context.globalAlpha = 0.16;
    context.fillStyle = themePalette.red;
    for (var x = 0; x < 800; x += 80) {
        context.fillRect(x, 0, 1, 600);
    }
    context.globalAlpha = 1;

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
    context.fillRect(0, 548, 800, 2);
}

function drawMonster(monster) {
    var bodyColor = monster.variant === 1 ? themePalette.purple : themePalette.red;
    var eyeColor = monster.variant === 2 ? themePalette.green : themePalette.white;
    context.fillStyle = bodyColor;
    context.fillRect(monster.x - 22, monster.y - 9, 44, 18);
    context.fillRect(monster.x - 13, monster.y - 18, 26, 9);
    context.fillRect(monster.x - 13, monster.y + 9, 8, 10);
    context.fillRect(monster.x + 5, monster.y + 9, 8, 10);
    context.fillStyle = "#050205";
    context.fillRect(monster.x - 10, monster.y - 5, 7, 7);
    context.fillRect(monster.x + 3, monster.y - 5, 7, 7);
    context.fillStyle = eyeColor;
    context.fillRect(monster.x - 8, monster.y - 3, 3, 3);
    context.fillRect(monster.x + 5, monster.y - 3, 3, 3);
}

function drawPlayer() {
    var player = strangerArcadeState.player;
    if (player.invuln > 0 && player.invuln % 6 < 3) {
        context.globalAlpha = 0.5;
    }
    context.fillStyle = "#b56b3f";
    context.fillRect(player.x - 12, player.y - 31, 28, 9);
    context.fillStyle = "#ffd2a6";
    context.fillRect(player.x - 2, player.y - 23, 9, 9);
    context.fillStyle = "#253a58";
    context.fillRect(player.x - 13, player.y - 14, 30, 20);
    context.fillStyle = "#b7c4d8";
    context.fillRect(player.x - 22, player.y - 5, 10, 9);
    context.fillRect(player.x + 18, player.y - 5, 10, 9);
    context.fillStyle = themePalette.red;
    context.fillRect(player.x - 2, player.y - 2, 10, 10);
    context.fillStyle = "#1a1d2c";
    context.fillRect(player.x - 12, player.y + 8, 9, 10);
    context.fillRect(player.x + 10, player.y + 8, 9, 10);
    context.fillStyle = "#ffec91";
    context.fillRect(player.x - 12, player.y - 40, 28, 4);
    context.globalAlpha = 1;
}

function drawBoss() {
    var boss = strangerArcadeState.boss;
    if (!boss) {
        return;
    }
    context.fillStyle = boss.hitFlash > 0 ? themePalette.white : (boss.age % 18 < 9 ? "#5a1028" : themePalette.purple);
    context.fillRect(boss.x - 66, boss.y - 24, 132, 50);
    context.fillRect(boss.x - 44, boss.y - 54, 88, 32);
    context.fillRect(boss.x - 86, boss.y - 4, 30, 20);
    context.fillRect(boss.x + 56, boss.y - 4, 30, 20);
    context.fillStyle = themePalette.red;
    context.fillRect(boss.x - 28, boss.y - 14, 18, 10);
    context.fillRect(boss.x + 10, boss.y - 14, 18, 10);
    context.fillStyle = themePalette.amber;
    context.fillRect(boss.x - 52, boss.y + 34, 104, 6);
    context.fillStyle = themePalette.white;
    context.font = "13px monospace";
    context.fillText("BOSS " + boss.hp + "/10", boss.x - 42, boss.y + 56);
}

function drawProjectiles() {
    var state = strangerArcadeState;
    context.fillStyle = "#fff1a8";
    state.bullets.forEach(function (bullet) {
        context.fillRect(bullet.x - 3, bullet.y - 18, 6, 22);
        context.fillStyle = themePalette.red;
        context.fillRect(bullet.x - 4, bullet.y - 24, 8, 8);
        context.fillStyle = "#fff1a8";
    });
    context.fillStyle = themePalette.blue;
    state.bossBullets.forEach(function (bullet) {
        context.fillRect(bullet.x - 5, bullet.y - 5, 10, 10);
        context.fillRect(bullet.x - 2, bullet.y - 12, 4, 24);
    });
}

function drawExplosions() {
    strangerArcadeState.explosions.forEach(function (explosion) {
        var progress = explosion.age / explosion.life;
        var radius = (10 + progress * 42) * explosion.size;
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = explosion.color;
        context.fillRect(explosion.x - radius, explosion.y - 4, radius * 2, 8);
        context.fillRect(explosion.x - 4, explosion.y - radius, 8, radius * 2);
        context.fillStyle = themePalette.amber;
        context.fillRect(explosion.x - radius / 3, explosion.y - radius / 3, radius * 0.66, radius * 0.66);
        context.globalAlpha = 1;
    });
}

function drawHud() {
    var state = strangerArcadeState;
    context.fillStyle = "#08101b";
    context.fillRect(0, 550, 800, 50);
    context.fillStyle = themePalette.white;
    context.font = "24px monospace";
    context.fillText(state.score, 0, 581);
    context.fillText(state.lives, 245, 581);
    context.fillText(state.cycle + "/10", 350, 581);
    context.fillText(monsterCountForCycle(state.cycle), 690, 581);
    context.font = "12px monospace";
    context.fillStyle = themePalette.amber;
    context.fillText("SCORE", 0, 595);
    context.fillText("LIVES", 245, 595);
    context.fillText("CYCLE", 350, 595);
    context.fillText("WAVE", 690, 595);
}

function drawOverlay(text, subtext) {
    context.globalAlpha = 0.78;
    context.fillStyle = "#050205";
    context.fillRect(0, 0, 800, 600);
    context.globalAlpha = 1;
    context.textAlign = "center";
    context.fillStyle = themePalette.red;
    context.font = "46px Georgia, serif";
    context.fillText(text, 400, 255);
    context.fillStyle = themePalette.white;
    context.font = "18px monospace";
    context.fillText(subtext, 400, 294);
    context.textAlign = "left";
}

function drawArcade() {
    var state = strangerArcadeState;
    drawBackground();
    state.monsters.forEach(drawMonster);
    drawBoss();
    drawProjectiles();
    drawExplosions();
    drawPlayer();
    drawHud();
    if (strangerArcadePaused) {
        drawOverlay("PAUSED", "ENTER TO RESUME");
    } else if (state.gameOver) {
        drawOverlay("GAME OVER", "SPACE / FIRE TO RESTART");
    } else if (state.complete) {
        drawOverlay("SURVIVED", "SPACE / FIRE TO RESTART");
    }
}

function strangerArcadeLoop(timestamp) {
    if (!strangerArcadeStarted) {
        return;
    }
    strangerArcadeFrame = window.requestAnimationFrame(strangerArcadeLoop);
    if (timestamp - strangerArcadeLastTick < 33) {
        return;
    }
    strangerArcadeLastTick = timestamp;
    updateArcade();
    drawArcade();
}

function startStrangerArcade() {
    if (strangerArcadeStarted) {
        return;
    }
    strangerArcadeStarted = true;
    strangerArcadePaused = false;
    if (renderTimer !== null) {
        clearInterval(renderTimer);
        renderTimer = null;
    }
    context.imageSmoothingEnabled = false;
    resetArcadeGame();
    strangerArcadeLastTick = 0;
    strangerArcadeFrame = window.requestAnimationFrame(strangerArcadeLoop);
}

boot = function () {
    startStrangerArcade();
};

window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.type !== "final-fate-muted") {
        return;
    }
    strangerArcadeMuted = Boolean(event.data.muted);
    masterVolume = strangerArcadeMuted ? 0 : 100;
    [sfx0, sfx1, sfx2, sfx3, sfx4, sfx5, game_over].forEach(function (media) {
        if (media) {
            media.muted = strangerArcadeMuted;
            media.volume = masterVolume / 100;
        }
    });
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        if (strangerArcadeFrame !== null) {
            window.cancelAnimationFrame(strangerArcadeFrame);
            strangerArcadeFrame = null;
        }
        return;
    }
    if (strangerArcadeStarted && strangerArcadeFrame === null) {
        strangerArcadeLastTick = 0;
        strangerArcadeFrame = window.requestAnimationFrame(strangerArcadeLoop);
    }
});
