export type TuiDaDataLanguage = 'en' | 'ru';

export interface TuiDaDataBaseSuggestRequest {
    readonly query: string;
    readonly count?: number;
}

export interface TuiDaDataSuggestRequest extends TuiDaDataBaseSuggestRequest {
    readonly language?: TuiDaDataLanguage;
}

export type TuiDaDataAddressBoundValue =
    | 'area'
    | 'city'
    | 'country'
    | 'flat'
    | 'house'
    | 'planning_structure'
    | 'region'
    | 'settlement'
    | 'stead'
    | 'street';

export interface TuiDaDataAddressBound {
    readonly value: TuiDaDataAddressBoundValue;
}

export type TuiDaDataAddressDivision = 'administrative' | 'municipal';

export interface TuiDaDataAddressLocation {
    readonly area?: string;
    readonly area_fias_id?: string;
    readonly area_kladr_id?: string;
    readonly area_type_full?: string;
    readonly city?: string;
    readonly city_district?: string;
    readonly city_district_fias_id?: string;
    readonly city_district_kladr_id?: string;
    readonly city_district_type_full?: string;
    readonly city_fias_id?: string;
    readonly city_kladr_id?: string;
    readonly city_type_full?: string;
    readonly country?: string;
    readonly country_iso_code?: string;
    readonly fias_id?: string;
    readonly kladr_id?: string;
    readonly planning_structure?: string;
    readonly planning_structure_fias_id?: string;
    readonly planning_structure_type_full?: string;
    readonly region?: string;
    readonly region_fias_id?: string;
    readonly region_kladr_id?: string;
    readonly region_type_full?: string;
    readonly settlement?: string;
    readonly settlement_fias_id?: string;
    readonly settlement_kladr_id?: string;
    readonly settlement_type_full?: string;
    readonly street?: string;
    readonly street_fias_id?: string;
    readonly street_kladr_id?: string;
    readonly street_type_full?: string;
    readonly sub_area?: string;
    readonly sub_area_fias_id?: string;
    readonly sub_area_kladr_id?: string;
    readonly sub_area_type_full?: string;
}

export interface TuiDaDataAddressGeoLocation {
    readonly lat: number;
    readonly lon: number;
    readonly radius_meters: number;
}

export interface TuiDaDataAddressSuggestRequest extends TuiDaDataSuggestRequest {
    readonly division?: TuiDaDataAddressDivision;
    readonly from_bound?: TuiDaDataAddressBound;
    readonly locations?: readonly TuiDaDataAddressLocation[];
    readonly locations_boost?: readonly TuiDaDataAddressLocation[];
    readonly locations_geo?: readonly TuiDaDataAddressGeoLocation[];
    readonly restrict_value?: boolean;
    readonly to_bound?: TuiDaDataAddressBound;
}

export interface TuiDaDataSuggestion<T> {
    readonly value: string;
    readonly unrestricted_value: string;
    readonly data: T;
}

export interface TuiDaDataResponse<T> {
    readonly suggestions: readonly TuiDaDataSuggestion<T>[];
}

export type TuiDaDataAddressBeltwayHit =
    | 'IN_KAD'
    | 'IN_MKAD'
    | 'OUT_KAD'
    | 'OUT_MKAD';
export type TuiDaDataAddressFiasLevel =
    | '-1'
    | '0'
    | '1'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '65'
    | '75';
export type TuiDaDataAddressQcGeo = '0' | '1' | '2' | '3' | '4' | '5';

export interface TuiDaDataAddressMetro {
    readonly name: string;
    readonly line: string;
    readonly distance: number;
}

export interface TuiDaDataAddressDivisionItem {
    readonly fias_id: string | null;
    readonly kladr_id: string | null;
    readonly name: string | null;
    readonly name_with_type: string | null;
    readonly type: string | null;
    readonly type_full: string | null;
}

export interface TuiDaDataAddressDivisionData {
    readonly area?: TuiDaDataAddressDivisionItem | null;
    readonly city?: TuiDaDataAddressDivisionItem | null;
    readonly city_district?: TuiDaDataAddressDivisionItem | null;
    readonly planning_structure?: TuiDaDataAddressDivisionItem | null;
    readonly settlement?: TuiDaDataAddressDivisionItem | null;
    readonly sub_area?: TuiDaDataAddressDivisionItem | null;
}

export interface TuiDaDataAddressDivisions {
    readonly administrative: TuiDaDataAddressDivisionData | null;
    readonly municipal: TuiDaDataAddressDivisionData | null;
}

export interface TuiDaDataAddressData {
    readonly area: string | null;
    readonly area_fias_id: string | null;
    readonly area_kladr_id: string | null;
    readonly area_type: string | null;
    readonly area_type_full: string | null;
    readonly area_with_type: string | null;
    readonly beltway_distance: string | null;
    readonly beltway_hit: TuiDaDataAddressBeltwayHit | null;
    readonly block: string | null;
    readonly block_type: string | null;
    readonly block_type_full: string | null;
    readonly capital_marker: '0' | '1' | '2' | '3' | '4' | null;
    readonly city: string | null;
    readonly city_area: string | null;
    readonly city_district: string | null;
    readonly city_district_fias_id: string | null;
    readonly city_district_kladr_id: string | null;
    readonly city_district_type: string | null;
    readonly city_district_type_full: string | null;
    readonly city_district_with_type: string | null;
    readonly city_fias_id: string | null;
    readonly city_kladr_id: string | null;
    readonly city_type: string | null;
    readonly city_type_full: string | null;
    readonly city_with_type: string | null;
    readonly country: string | null;
    readonly country_iso_code: string | null;
    readonly divisions: TuiDaDataAddressDivisions | null;
    readonly entrance: string | null;
    readonly federal_district: string | null;
    readonly fias_actuality_state: string | null;
    readonly fias_code: string | null;
    readonly fias_id: string | null;
    readonly fias_level: TuiDaDataAddressFiasLevel | null;
    readonly flat: string | null;
    readonly flat_area: string | null;
    readonly flat_cadnum: string | null;
    readonly flat_fias_id: string | null;
    readonly flat_price: string | null;
    readonly flat_type: string | null;
    readonly flat_type_full: string | null;
    readonly floor: string | null;
    readonly geoname_id: string | null;
    readonly geo_lat: string | null;
    readonly geo_lon: string | null;
    readonly history_values: readonly string[] | null;
    readonly house: string | null;
    readonly house_cadnum: string | null;
    readonly house_fias_id: string | null;
    readonly house_flat_count: string | null;
    readonly house_kladr_id: string | null;
    readonly house_type: string | null;
    readonly house_type_full: string | null;
    readonly house_with_type: string | null;
    readonly kladr_id: string | null;
    readonly metro: readonly TuiDaDataAddressMetro[] | null;
    readonly okato: string | null;
    readonly oktmo: string | null;
    readonly planning_structure: string | null;
    readonly planning_structure_fias_id: string | null;
    readonly planning_structure_kladr_id: string | null;
    readonly planning_structure_type: string | null;
    readonly planning_structure_type_full: string | null;
    readonly planning_structure_with_type: string | null;
    readonly postal_box: string | null;
    readonly postal_code: string | null;
    readonly qc: string | null;
    readonly qc_complete: string | null;
    readonly qc_geo: TuiDaDataAddressQcGeo | null;
    readonly qc_house: string | null;
    readonly region: string | null;
    readonly region_fias_id: string | null;
    readonly region_iso_code: string | null;
    readonly region_kladr_id: string | null;
    readonly region_type: string | null;
    readonly region_type_full: string | null;
    readonly region_with_type: string | null;
    readonly room: string | null;
    readonly room_cadnum: string | null;
    readonly room_fias_id: string | null;
    readonly room_type: string | null;
    readonly room_type_full: string | null;
    readonly settlement: string | null;
    readonly settlement_fias_id: string | null;
    readonly settlement_kladr_id: string | null;
    readonly settlement_type: string | null;
    readonly settlement_type_full: string | null;
    readonly settlement_with_type: string | null;
    readonly source: string | null;
    readonly square_meter_price: string | null;
    readonly stead: string | null;
    readonly stead_cadnum: string | null;
    readonly stead_fias_id: string | null;
    readonly stead_kladr_id: string | null;
    readonly stead_type: string | null;
    readonly stead_type_full: string | null;
    readonly street: string | null;
    readonly street_fias_id: string | null;
    readonly street_kladr_id: string | null;
    readonly street_type: string | null;
    readonly street_type_full: string | null;
    readonly street_with_type: string | null;
    readonly sub_area: string | null;
    readonly sub_area_fias_id: string | null;
    readonly sub_area_kladr_id: string | null;
    readonly sub_area_type: string | null;
    readonly sub_area_type_full: string | null;
    readonly sub_area_with_type: string | null;
    readonly tax_office: string | null;
    readonly tax_office_legal: string | null;
    readonly timezone: string | null;
    readonly unparsed_parts: string | null;
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

export type TuiDaDataEmailSuggestRequest = TuiDaDataBaseSuggestRequest;

export interface TuiDaDataEmailData {
    readonly local: string | null;
    readonly domain: string | null;
    readonly type: string | null;
    readonly source: string | null;
    readonly qc: string | null;
}

export type TuiDaDataEmailSuggestion = TuiDaDataSuggestion<TuiDaDataEmailData>;

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

export interface TuiDaDataFindAddressRequest extends TuiDaDataBaseSuggestRequest {
    readonly division?: TuiDaDataAddressDivision;
    readonly language?: TuiDaDataLanguage;
}

export interface TuiDaDataFindPartyRequest extends TuiDaDataBaseSuggestRequest {
    readonly branch_type?: TuiDaDataPartyBranchType;
    readonly kpp?: string;
    readonly status?: readonly TuiDaDataPartyStatus[];
    readonly type?: TuiDaDataPartyType;
}

export interface TuiDaDataFindBankRequest extends TuiDaDataBaseSuggestRequest {
    readonly kpp?: string;
}

export interface TuiDaDataEndpoint<
    TRequest extends TuiDaDataBaseSuggestRequest,
    TData,
> {
    readonly request: TRequest;
    readonly data: TData;
}

export interface TuiDaDataEndpointMap {
    readonly address: TuiDaDataEndpoint<
        TuiDaDataAddressSuggestRequest,
        TuiDaDataAddressData
    >;
    readonly bank: TuiDaDataEndpoint<TuiDaDataBankSuggestRequest, TuiDaDataBankData>;
    readonly email: TuiDaDataEndpoint<TuiDaDataEmailSuggestRequest, TuiDaDataEmailData>;
    readonly fio: TuiDaDataEndpoint<TuiDaDataFioSuggestRequest, TuiDaDataFioData>;
    readonly party: TuiDaDataEndpoint<TuiDaDataPartySuggestRequest, TuiDaDataPartyData>;
}

export type TuiDaDataEndpointType = keyof TuiDaDataEndpointMap;

export interface TuiDaDataFindByIdEndpointMap {
    readonly address: TuiDaDataEndpoint<TuiDaDataFindAddressRequest, TuiDaDataAddressData>;
    readonly bank: TuiDaDataEndpoint<TuiDaDataFindBankRequest, TuiDaDataBankData>;
    readonly party: TuiDaDataEndpoint<TuiDaDataFindPartyRequest, TuiDaDataPartyData>;
}

export type TuiDaDataFindByIdEndpointType = keyof TuiDaDataFindByIdEndpointMap;
