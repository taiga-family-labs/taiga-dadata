# Taiga DaData

Интеграция API DaData для Angular и Taiga UI.

## Демо

GitHub Pages: https://taiga-family-labs.github.io/taiga-dadata/

Для работы демо нужно указать API-токен DaData. Токен хранится только в памяти текущей вкладки браузера, не сохраняется и не попадает в сборку приложения.

## Установка

```bash
npm i @taiga-ui-labs/dadata
```

## Использование

```ts
import {provideHttpClient} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTuiDaData} from '@taiga-ui-labs/dadata';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideTuiDaData({token: 'YOUR_DADATA_TOKEN'}),
    ],
});
```

```ts
import {inject} from '@angular/core';
import {TuiDaDataService} from '@taiga-ui-labs/dadata';

const dadata = inject(TuiDaDataService);

const suggestions$ = dadata.suggestAddress({
    query: 'Москва, Тверская',
    count: 10,
});
```

Если токен может меняться во время работы приложения, можно передать функцию:

```ts
provideTuiDaData({token: () => tokenSignal()});
```

## Разработка

```bash
npm ci
npm start
```

Сборка библиотеки и демо:

```bash
npm run build
```

## GitHub Pages

`.github/workflows/pages.yml` собирает демо с `/taiga-dadata/` в качестве `base href` и публикует `dist/demo` через GitHub Pages Actions.

Если GitHub Pages еще не включен для репозитория, один раз выберите **Settings → Pages → Build and deployment → Source → GitHub Actions**.

## Возможности

Первая версия предоставляет подсказки адресов. В сервисе также есть универсальный метод `suggest<T>(type, request)`, поэтому позже можно добавить типизированную поддержку ФИО, организаций, банков и других API подсказок DaData без создания отдельных UI-компонентов.
