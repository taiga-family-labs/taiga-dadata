import {AsyncPipe, JsonPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {type TuiStringHandler} from '@taiga-ui/cdk';
import {TuiInput, TuiLoader, TuiRoot} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper} from '@taiga-ui/kit';
import {
    TuiDaDataService,
    type TuiDaDataAddressSuggestion,
} from '@taiga-ui-labs/dadata';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    filter,
    finalize,
    map,
    of,
    shareReplay,
    Subject,
    switchMap,
    tap,
    timer,
} from 'rxjs';

import {DADATA_TOKEN} from './dadata-token';

const DADATA_TOKEN_STORAGE_KEY = 'taiga-dadata-token';

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

    protected readonly token = DADATA_TOKEN;
    protected readonly tokenValid = signal(false);
    protected readonly tokenChecking = signal(false);
    protected readonly tokenError = signal('');
    protected readonly loading = signal(false);
    protected readonly error = signal('');
    protected readonly search$ = new Subject<string>();

    protected value: TuiDaDataAddressSuggestion | string | null = null;

    protected readonly stringify: TuiStringHandler<TuiDaDataAddressSuggestion> =
        ({value}) => value;

    protected readonly suggestions$ = this.search$.pipe(
        debounceTime(0),
        filter(() => !this.isSuggestion(this.value)),
        map((query) => query.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
            if (query.length < 2 || !this.tokenValid()) {
                this.error.set('');

                return of([]);
            }

            this.loading.set(true);
            this.error.set('');

            return this.dadata.suggestAddress({query, count: 10}).pipe(
                map(({suggestions}) => suggestions),
                catchError((error: HttpErrorResponse) => {
                    this.error.set(this.getErrorMessage(error));

                    return of([]);
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

    protected isSuggestion(
        value: TuiDaDataAddressSuggestion | string | null,
    ): value is TuiDaDataAddressSuggestion {
        return Boolean(value && typeof value !== 'string');
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
