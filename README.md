# The Final Fate Room

Одностраничная React-обертка для браузерной игры The Final Fate: пользователь видит темную ретро-комнату из референс-фото, нажимает `START` на CRT-компьютере и запускает игру внутри экрана.

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

Исходный проект: `The Final Fate / finalfate`  
Автор: Manuel Engel / MengelCode  
Лицензия: MIT

Лицензия и attribution сохранены в:

```txt
public/game/final-fate/LICENSE.txt
public/game/final-fate/NOTICE.md
```

`public/game/final-fate/theme.js` меняет только визуальную подачу игры: тексты, цвета, HUD, фон и рендер объектов. Базовая механика исходника остается внутри оригинального кода.

Музыкальные файлы `title-0.wav`, `title-1.wav`, `special.wav` заменены на оригинальные зацикленные 8-bit synth-horror дорожки. Это не каверы и не копии музыки сериала.

Сайт использует отдельную оригинальную ambient-дорожку:

```txt
public/audio/site-theme.wav
```

## Референс-фото

Стартовая сцена ожидает исходное изображение в:

```txt
public/images/room-reference/stranger-room-reference.png
```

React не рисует комнату CSS-элементами: фотография используется как единственная сцена, поверх нее накладывается только интерактивная область экрана ПК.
