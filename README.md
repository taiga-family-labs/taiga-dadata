# Taiga DaData

Интеграция API DaData для Angular и Taiga UI.

## Демо

GitHub Pages: https://taiga-family-labs.github.io/taiga-dadata/

Для работы демо нужно указать API-токен DaData. После успешной проверки токен сохраняется в `localStorage` браузера и автоматически восстанавливается после перезагрузки страницы. Токен не попадает в сборку приложения.

<img width="718" height="683" alt="image" src="https://github.com/user-attachments/assets/fb49198d-20a6-4c88-9bfa-c37f298ad446" />

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

Получить подсказки можно через `TuiDaDataService`:

```ts
import {inject} from '@angular/core';
import {
    TuiDaDataService,
    type TuiDaDataAddressSuggestion,
} from '@taiga-ui-labs/dadata';

const dadata = inject(TuiDaDataService);

protected value: TuiDaDataAddressSuggestion | string | null = null;

protected readonly stringify = ({value}: TuiDaDataAddressSuggestion): string => value;

protected readonly suggestions$ = dadata.suggestAddress({
    query: 'Москва, Тверская',
    count: 10,
});
```

### Использование в шаблоне

Результат `suggestAddress` можно передать в стандартный `tuiComboBox`:

```html
@let response = suggestions$ | async;

<tui-textfield
    tuiChevron
    [stringify]="stringify"
>
    <input
        tuiComboBox
        [(ngModel)]="value"
        [strict]="false"
    />

    <tui-data-list-wrapper
        *tuiDropdown
        [itemContent]="item"
        [items]="response?.suggestions ?? []"
    />
</tui-textfield>

<ng-template
    #item
    let-suggestion
>
    <div>
        <strong>{{ suggestion.value }}</strong>

        @if (suggestion.data.postal_code) {
            <small>{{ suggestion.data.postal_code }}</small>
        }
    </div>
</ng-template>
```

### ФИО, организации и банки

Для основных видов подсказок есть отдельные типизированные методы:

```ts
const fio$ = dadata.suggestFio({
    query: 'Иванов Ив',
    gender: 'MALE',
    parts: ['SURNAME', 'NAME'],
});

const parties$ = dadata.suggestParty({
    query: 'Сбербанк',
    status: ['ACTIVE'],
});

const banks$ = dadata.suggestBank({
    query: 'Сбербанк',
    type: ['BANK'],
    status: ['ACTIVE'],
});
```

Ответы типизированы через `TuiDaDataFioData`, `TuiDaDataPartyData` и `TuiDaDataBankData`. Для нестандартных endpoints остается универсальный метод `suggest<T, R>(type, request)`.

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

## Возможности

Библиотека предоставляет типизированные подсказки адресов, ФИО, организаций и банков. Для остальных API подсказок DaData можно использовать универсальный метод `suggest<T, R>(type, request)` без создания отдельных UI-компонентов.
