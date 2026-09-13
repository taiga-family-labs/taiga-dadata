export type TuiDaDataLanguage = 'en' | 'ru';

export interface TuiDaDataSuggestRequest {
    readonly query: string;
    readonly count?: number;
    readonly language?: TuiDaDataLanguage;
}

export interface TuiDaDataSuggestion<T> {
    readonly value: string;
    readonly unrestricted_value: string;
    readonly data: T;
}

export interface TuiDaDataResponse<T> {
    readonly suggestions: readonly TuiDaDataSuggestion<T>[];
}

export interface TuiDaDataAddressData {
    readonly postal_code: string | null;
    readonly country: string | null;
    readonly country_iso_code: string | null;
    readonly federal_district: string | null;
    readonly region: string | null;
    readonly region_iso_code: string | null;
    readonly region_fias_id: string | null;
    readonly city: string | null;
    readonly city_fias_id: string | null;
    readonly settlement: string | null;
    readonly settlement_fias_id: string | null;
    readonly street: string | null;
    readonly street_fias_id: string | null;
    readonly house: string | null;
    readonly house_fias_id: string | null;
    readonly flat: string | null;
    readonly fias_id: string | null;
    readonly fias_level: string | null;
    readonly geo_lat: string | null;
    readonly geo_lon: string | null;
}

export type TuiDaDataAddressSuggestion = TuiDaDataSuggestion<TuiDaDataAddressData>;
