import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    type Observable,
    of,
    type OperatorFunction,
    pipe,
    startWith,
    switchMap,
} from 'rxjs';

import {
    type TuiDaDataResponse,
    type TuiDaDataSuggestion,
} from './dadata.types';

export interface TuiDaDataSearchOptions {
    readonly debounce?: number;
    readonly minLength?: number;
}

interface TuiDaDataSearchStateBase<T> {
    readonly query: string;
    readonly suggestions: readonly TuiDaDataSuggestion<T>[];
}

export type TuiDaDataSearchState<T> =
    | (TuiDaDataSearchStateBase<T> & {readonly status: 'idle'})
    | (TuiDaDataSearchStateBase<T> & {readonly status: 'loading'})
    | (TuiDaDataSearchStateBase<T> & {readonly status: 'success'})
    | (TuiDaDataSearchStateBase<T> & {
          readonly error: unknown;
          readonly status: 'error';
      });

export function tuiDaDataSearch<T>(
    request: (query: string) => Observable<TuiDaDataResponse<T>>,
    options: TuiDaDataSearchOptions = {},
): OperatorFunction<string, TuiDaDataSearchState<T>> {
    const debounce = Math.max(0, options.debounce ?? 300);
    const minLength = Math.max(0, options.minLength ?? 2);

    return pipe(
        map((query) => query.trim()),
        debounceTime(debounce),
        distinctUntilChanged(),
        switchMap((query) => {
            const suggestions = [] as const;

            if (query.length < minLength) {
                return of<TuiDaDataSearchState<T>>({
                    query,
                    status: 'idle',
                    suggestions,
                });
            }

            const loading: TuiDaDataSearchState<T> = {
                query,
                status: 'loading',
                suggestions,
            };

            return request(query).pipe(
                map(
                    (response): TuiDaDataSearchState<T> => ({
                        query,
                        status: 'success',
                        suggestions: response.suggestions,
                    }),
                ),
                startWith(loading),
                catchError((error: unknown) =>
                    of<TuiDaDataSearchState<T>>({
                        error,
                        query,
                        status: 'error',
                        suggestions,
                    }),
                ),
            );
        }),
    );
}
