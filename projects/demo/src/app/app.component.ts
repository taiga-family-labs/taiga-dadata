import {AsyncPipe, JsonPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {type TuiStringHandler} from '@taiga-ui/cdk';
import {TuiInput, TuiLoader, TuiRoot} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper} from '@taiga-ui/kit';
import {
    TuiDaDataService,
    type TuiDaDataAddressSuggestion,
    type TuiDaDataBankSuggestion,
    type TuiDaDataEmailSuggestion,
    type TuiDaDataFioSuggestion,
    type TuiDaDataPartySuggestion,
} from '@taiga-ui-labs/dadata';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    filter,
    finalize,
    map,
    type Observable,
    of,
    shareReplay,
    Subject,
    switchMap,
    tap,
    timer,
} from 'rxjs';

import {DADATA_TOKEN} from './dadata-token';

const DADATA_TOKEN_STORAGE_KEY = 'taiga-dadata-token';
const SUGGESTION_TYPES = [
    {id: 'address', label: 'Адрес', placeholder: 'Москва, Тверская, 1'},
    {id: 'fio', label: 'ФИО', placeholder: 'Иванов Иван Иванович'},
    {id: 'party', label: 'Организация', placeholder: 'Сбербанк'},
    {id: 'bank', label: 'Банк', placeholder: 'Сбербанк'},
    {id: 'email', label: 'Email', placeholder: 'example@yand'},
] as const;

type SuggestionType = (typeof SUGGESTION_TYPES)[number]['id'];
type Suggestion =
    | TuiDaDataAddressSuggestion
    | TuiDaDataBankSuggestion
    | TuiDaDataEmailSuggestion
    | TuiDaDataFioSuggestion
    | TuiDaDataPartySuggestion;

@Component({
    selector: 'app-root',
    imports: [
        AsyncPipe,
        FormsModule,
        JsonPipe,
        TuiChevron,
        TuiComboBox,
        TuiDataListWrapper,
        TuiInput,
        TuiLoader,
        TuiRoot,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private readonly dadata = inject(TuiDaDataService);
    private readonly tokenChanges$ = new Subject<string>();

    protected readonly suggestionTypes = SUGGESTION_TYPES;
    protected readonly suggestionType = signal<SuggestionType>('address');
    protected readonly suggestionTypeConfig = computed(
        () =>
            SUGGESTION_TYPES.find(({id}) => id === this.suggestionType()) ??
            SUGGESTION_TYPES[0],
    );
    protected readonly token = DADATA_TOKEN;
    protected readonly tokenValid = signal(false);
    protected readonly tokenChecking = signal(false);
    protected readonly tokenError = signal('');
    protected readonly loading = signal(false);
    protected readonly error = signal('');
    protected readonly search$ = new Subject<string>();

    protected value: Suggestion | string | null = null;

    protected readonly stringify: TuiStringHandler<Suggestion> = ({value}) => value;

    protected readonly suggestions$ = this.search$.pipe(
        debounceTime(0),
        filter(() => !this.isSuggestion(this.value)),
        map((query) => query.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
            if (query.length < 2 || !this.tokenValid()) {
                this.error.set('');

                return of<readonly Suggestion[]>([]);
            }

            this.loading.set(true);
            this.error.set('');

            return this.getSuggestions(query).pipe(
                catchError((error: HttpErrorResponse) => {
                    this.error.set(this.getErrorMessage(error));

                    return of<readonly Suggestion[]>([]);
                }),
                finalize(() => this.loading.set(false)),
            );
        }),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    public constructor() {
        this.tokenChanges$
            .pipe(
                distinctUntilChanged(),
                switchMap((token) => {
                    if (!token) {
                        return EMPTY;
                    }

                    return timer(400).pipe(
                        tap(() => this.tokenChecking.set(true)),
                        switchMap(() =>
                            this.dadata.suggestAddress({query: 'Москва', count: 1}),
                        ),
                        tap(() => {
                            this.tokenValid.set(true);
                            this.tokenError.set('');
                            localStorage.setItem(DADATA_TOKEN_STORAGE_KEY, token);
                        }),
                        catchError((error: HttpErrorResponse) => {
                            this.tokenValid.set(false);
                            this.tokenError.set(this.getTokenErrorMessage(error));

                            if (error.status === 401 || error.status === 403) {
                                localStorage.removeItem(DADATA_TOKEN_STORAGE_KEY);
                            }

                            return EMPTY;
                        }),
                        finalize(() => this.tokenChecking.set(false)),
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe();

        const token = localStorage.getItem(DADATA_TOKEN_STORAGE_KEY) ?? '';

        if (token) {
            this.token.set(token);
            this.tokenValid.set(true);
            this.tokenChanges$.next(token);
        }
    }

    protected selectSuggestionType(type: SuggestionType): void {
        if (type === this.suggestionType()) {
            return;
        }

        this.suggestionType.set(type);
        this.value = null;
        this.error.set('');
        this.search$.next('');
    }

    protected onTokenChange(value: string): void {
        const token = value.trim();

        this.token.set(token);
        this.tokenValid.set(false);
        this.tokenError.set('');

        if (!token) {
            localStorage.removeItem(DADATA_TOKEN_STORAGE_KEY);
        }

        this.tokenChanges$.next(token);
    }

    protected isSuggestion(value: Suggestion | string | null): value is Suggestion {
        return Boolean(value && typeof value !== 'string');
    }

    protected suggestionMeta(suggestion: Suggestion): string {
        switch (this.suggestionType()) {
            case 'address': {
                const {city, postal_code, region, settlement} = (
                    suggestion as TuiDaDataAddressSuggestion
                ).data;

                return [postal_code, city ?? settlement ?? region].filter(Boolean).join(' · ');
            }
            case 'fio': {
                const {gender} = (suggestion as TuiDaDataFioSuggestion).data;

                if (gender === 'MALE') {
                    return 'Мужской пол';
                }

                if (gender === 'FEMALE') {
                    return 'Женский пол';
                }

                return '';
            }
            case 'party': {
                const {inn, kpp} = (suggestion as TuiDaDataPartySuggestion).data;

                return [inn && `ИНН ${inn}`, kpp && `КПП ${kpp}`]
                    .filter(Boolean)
                    .join(' · ');
            }
            case 'bank': {
                const {bic, inn} = (suggestion as TuiDaDataBankSuggestion).data;

                return [bic && `БИК ${bic}`, inn && `ИНН ${inn}`]
                    .filter(Boolean)
                    .join(' · ');
            }
            case 'email': {
                const {domain} = (suggestion as TuiDaDataEmailSuggestion).data;

                return domain ?? '';
            }
        }
    }

    protected emptyContent(query: string): string {
        if (!this.token()) {
            return 'Сначала укажите API-токен DaData';
        }

        if (!this.tokenValid()) {
            return this.tokenChecking()
                ? 'Проверяем API-токен DaData'
                : 'Укажите действительный API-токен DaData';
        }

        return query.length < 2 ? 'Введите минимум 2 символа' : 'Ничего не найдено';
    }

    private getSuggestions(query: string): Observable<readonly Suggestion[]> {
        switch (this.suggestionType()) {
            case 'address':
                return this.dadata
                    .suggestAddress({query, count: 10})
                    .pipe(map(({suggestions}) => suggestions));
            case 'fio':
                return this.dadata
                    .suggestFio({query, count: 10})
                    .pipe(map(({suggestions}) => suggestions));
            case 'party':
                return this.dadata
                    .suggestParty({query, count: 10, status: ['ACTIVE']})
                    .pipe(map(({suggestions}) => suggestions));
            case 'bank':
                return this.dadata
                    .suggestBank({query, count: 10, status: ['ACTIVE']})
                    .pipe(map(({suggestions}) => suggestions));
            case 'email':
                return this.dadata
                    .suggestEmail({query, count: 10})
                    .pipe(map(({suggestions}) => suggestions));
        }
    }

    private getTokenErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 401 || error.status === 403) {
            return 'DaData отклонила API-токен. Проверьте его и попробуйте снова.';
        }

        if (error.status === 429) {
            return 'Слишком много запросов к DaData. Проверим токен еще раз после следующего изменения.';
        }

        return 'Не удалось проверить API-токен. Проверьте соединение и попробуйте снова.';
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 401 || error.status === 403) {
            return 'DaData отклонила API-токен. Проверьте токен и ограничения аккаунта.';
        }

        if (error.status === 429) {
            return 'Слишком много запросов. Попробуйте еще раз через некоторое время.';
        }

        return 'Не удалось выполнить запрос к DaData. Проверьте соединение и попробуйте снова.';
    }
}
