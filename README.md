# Taiga DaData

Интеграция API DaData для Angular и Taiga UI.

## Демо

GitHub Pages: https://taiga-family-labs.github.io/taiga-dadata/

Для работы демо нужно указать API-токен DaData. После успешной проверки токен сохраняется в `localStorage` браузера и автоматически восстанавливается после перезагрузки страницы. Токен не попадает в сборку приложения.

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

Первая версия предоставляет подсказки адресов. В сервисе также есть универсальный метод `suggest<T>(type, request)`, поэтому позже можно добавить типизированную поддержку ФИО, организаций, банков и других API подсказок DaData без создания отдельных UI-компонентов.
