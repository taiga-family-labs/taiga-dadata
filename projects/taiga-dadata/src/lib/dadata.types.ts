export type TuiDaDataLanguage = 'en' | 'ru';

export interface TuiDaDataBaseSuggestRequest {
    readonly query: string;
    readonly count?: number;
}

export interface TuiDaDataSuggestRequest extends TuiDaDataBaseSuggestRequest {
    readonly language?: TuiDaDataLanguage;
}

export type TuiDaDataAddressSuggestRequest = TuiDaDataSuggestRequest;

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

export type TuiDaDataFioGender = 'FEMALE' | 'MALE' | 'UNKNOWN';
export type TuiDaDataFioPart = 'NAME' | 'PATRONYMIC' | 'SURNAME';

export interface TuiDaDataFioSuggestRequest extends TuiDaDataBaseSuggestRequest {
    readonly gender?: TuiDaDataFioGender;
    readonly parts?: readonly TuiDaDataFioPart[];
}

export interface TuiDaDataFioData {
    readonly surname: string | null;
    readonly name: string | null;
    readonly patronymic: string | null;
    readonly gender: TuiDaDataFioGender | null;
    readonly source: string | null;
    readonly qc: '0' | '1' | null;
}

export type TuiDaDataFioSuggestion = TuiDaDataSuggestion<TuiDaDataFioData>;

export type TuiDaDataPartyType = 'INDIVIDUAL' | 'LEGAL';
export type TuiDaDataPartyBranchType = 'BRANCH' | 'MAIN';
export type TuiDaDataPartyStatus =
    | 'ACTIVE'
    | 'BANKRUPT'
    | 'LIQUIDATED'
    | 'LIQUIDATING'
    | 'REORGANIZING';

export interface TuiDaDataPartySuggestRequest extends TuiDaDataBaseSuggestRequest {
    readonly type?: TuiDaDataPartyType;
    readonly status?: readonly TuiDaDataPartyStatus[];
    readonly okved?: readonly string[];
}

export interface TuiDaDataPartyName {
    readonly full_with_opf: string | null;
    readonly short_with_opf: string | null;
    readonly latin: string | null;
    readonly full: string | null;
    readonly short: string | null;
}

export interface TuiDaDataPartyOpf {
    readonly code: string | null;
    readonly full: string | null;
    readonly short: string | null;
    readonly type: string | null;
}

export interface TuiDaDataPartyManagement {
    readonly name: string | null;
    readonly post: string | null;
    readonly start_date: number | null;
}

export interface TuiDaDataPartyState {
    readonly actuality_date: number | null;
    readonly registration_date: number | null;
    readonly liquidation_date: number | null;
    readonly status: TuiDaDataPartyStatus | null;
    readonly code: string | null;
}

export interface TuiDaDataPartyData {
    readonly kpp: string | null;
    readonly inn: string | null;
    readonly ogrn: string | null;
    readonly ogrn_date: number | null;
    readonly hid: string | null;
    readonly type: TuiDaDataPartyType | null;
    readonly name: TuiDaDataPartyName | null;
    readonly fio: TuiDaDataFioData | null;
    readonly opf: TuiDaDataPartyOpf | null;
    readonly management: TuiDaDataPartyManagement | null;
    readonly branch_count: number | null;
    readonly branch_type: TuiDaDataPartyBranchType | null;
    readonly address: TuiDaDataAddressSuggestion | null;
    readonly state: TuiDaDataPartyState | null;
    readonly okato: string | null;
    readonly oktmo: string | null;
    readonly okpo: string | null;
    readonly okogu: string | null;
    readonly okfs: string | null;
    readonly okved: string | null;
    readonly okved_type: string | null;
}

export type TuiDaDataPartySuggestion = TuiDaDataSuggestion<TuiDaDataPartyData>;

export type TuiDaDataBankType =
    | 'BANK'
    | 'BANK_BRANCH'
    | 'CBR'
    | 'NKO'
    | 'NKO_BRANCH'
    | 'OTHER'
    | 'RKC'
    | 'TREASURY';
export type TuiDaDataBankStatus = 'ACTIVE' | 'LIQUIDATED' | 'LIQUIDATING';

export interface TuiDaDataBankSuggestRequest extends TuiDaDataBaseSuggestRequest {
    readonly status?: readonly TuiDaDataBankStatus[];
    readonly type?: readonly TuiDaDataBankType[];
}

export interface TuiDaDataBankOpf {
    readonly type: TuiDaDataBankType | null;
    readonly full: string | null;
    readonly short: string | null;
}

export interface TuiDaDataBankName {
    readonly payment: string | null;
    readonly full: string | null;
    readonly short: string | null;
}

export interface TuiDaDataBankState {
    readonly actuality_date: number | null;
    readonly registration_date: number | null;
    readonly liquidation_date: number | null;
    readonly status: TuiDaDataBankStatus | null;
}

export interface TuiDaDataBankData {
    readonly opf: TuiDaDataBankOpf | null;
    readonly name: TuiDaDataBankName | null;
    readonly bic: string | null;
    readonly swift: string | null;
    readonly swifts: readonly string[] | null;
    readonly inn: string | null;
    readonly kpp: string | null;
    readonly okpo: string | null;
    readonly correspondent_account: string | null;
    readonly registration_number: string | null;
    readonly payment_city: string | null;
    readonly address: TuiDaDataAddressSuggestion | null;
    readonly state: TuiDaDataBankState | null;
}

export type TuiDaDataBankSuggestion = TuiDaDataSuggestion<TuiDaDataBankData>;
