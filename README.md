# Stranger Things

Одностраничная React-обертка для браузерной ретро-аркады: пользователь видит темную комнату из референс-фото, нажимает `START` на CRT-компьютере и запускает wave-based shooter внутри экрана.

## Запуск

```bash
npm install --legacy-peer-deps
npm start
```

Локальный адрес по умолчанию: `http://localhost:3000`.

## Сборка и проверки

```bash
npm test -- --watchAll=false
npm run build
```

## Игра

Готовая игра лежит в `public/game/final-fate/` и подключается через iframe:

```txt
/game/final-fate/index.html
```

Основа файлов и лицензии: `The Final Fate / finalfate`  
Автор: Manuel Engel / MengelCode  
Лицензия: MIT

Лицензия и attribution сохранены в:

```txt
public/game/final-fate/LICENSE.txt
public/game/final-fate/NOTICE.md
```

`public/game/final-fate/theme.js` содержит стабильный canvas-loop с 10 циклами, мелкими монстрами, боссом, очками, жизнями, взрывами и SFX.

Сайт использует одну зацикленную дорожку:

```txt
public/audio/stranger-think.m4a
```

## Референс-фото

Стартовая сцена ожидает исходное изображение в:

```txt
public/images/room-reference/stranger-room-reference.png
```

React не рисует комнату CSS-элементами: фотография используется как единственная сцена, поверх нее накладывается только интерактивная область экрана ПК.
