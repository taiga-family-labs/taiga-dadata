import {AsyncPipe, JsonPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {type TuiStringHandler} from '@taiga-ui/cdk';
import {TuiInput, TuiLoader, TuiRoot} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper} from '@taiga-ui/kit';
import {
    TuiDaDataService,
    type TuiDaDataAddressSuggestion,
} from '@taiga-ui/dadata';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    of,
    shareReplay,
    Subject,
    switchMap,
} from 'rxjs';

import {DADATA_TOKEN} from './dadata-token';

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

    protected readonly token = DADATA_TOKEN;
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
            if (query.length < 2 || !this.token()) {
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

    protected isSuggestion(
        value: TuiDaDataAddressSuggestion | string | null,
    ): value is TuiDaDataAddressSuggestion {
        return Boolean(value && typeof value !== 'string');
    }

    protected emptyContent(query: string): string {
        if (!this.token()) {
            return 'Enter a DaData API token first';
        }

        return query.length < 2 ? 'Enter at least 2 characters' : 'Nothing found';
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 401 || error.status === 403) {
            return 'DaData rejected the API token. Check the token and account limits.';
        }

        if (error.status === 429) {
            return 'Too many requests. Try again in a moment.';
        }

        return 'DaData request failed. Check the network and try again.';
    }
}
