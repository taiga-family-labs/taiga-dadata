import {
    type EnvironmentProviders,
    InjectionToken,
    makeEnvironmentProviders,
    type Provider,
} from '@angular/core';

export const TUI_DADATA_BASE_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';

export type TuiDaDataToken = string | (() => string);

export interface TuiDaDataOptions {
    readonly token: TuiDaDataToken;
    readonly baseUrl?: string;
}

export const TUI_DADATA_OPTIONS = new InjectionToken<TuiDaDataOptions>('TUI_DADATA_OPTIONS');

export function provideTuiDaData(options: TuiDaDataOptions): EnvironmentProviders {
    const providers: Provider[] = [{provide: TUI_DADATA_OPTIONS, useValue: options}];

    return makeEnvironmentProviders(providers);
}
