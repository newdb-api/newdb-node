/**
 * Type definitions for NewDB REST API.
 */
export interface NewDBClientOptions {
    apiKey?: string;
    baseUrl?: string;
    timeoutMs?: number;
    testMode?: boolean;
}
export interface BalanceResponse {
    token: string;
    balance: number;
    raw: Record<string, any>;
}
export interface MethodResult<T = any> {
    status: number;
    data?: T;
    error?: string;
    found?: boolean;
    raw: Record<string, any>;
}
export interface TaskResponse {
    requestId: string;
    state: 'queued' | 'in progress' | 'complete' | 'failed' | 'restart' | string;
    results: Record<string, MethodResult>;
    raw: Record<string, any>;
}
export interface WaitOptions {
    timeoutSeconds?: number;
    pollIntervalMs?: number;
}
export interface PassportMvdParams {
    seria: string;
    number: string;
    firstname: string;
    lastname: string;
    country?: string;
    [key: string]: any;
}
export interface PassportFnsParams {
    seria: string;
    number: string;
    firstname: string;
    lastname: string;
    dob: string;
    secondname?: string;
    country?: string;
    [key: string]: any;
}
export interface FsspPersonParams {
    firstname: string;
    lastname: string;
    dob: string;
    regioncode?: string;
    secondname?: string;
    country?: string;
    [key: string]: any;
}
export interface ComplexPassportParams {
    seria: string;
    number: string;
    firstname: string;
    lastname: string;
    dob?: string;
    secondname?: string;
    regioncode?: string;
    country?: string;
    [key: string]: any;
}
export interface EgrulParams {
    inn?: string;
    ogrn?: string;
    country?: string;
    [key: string]: any;
}
export interface ComplexInnParams {
    inn: string;
    country?: string;
    [key: string]: any;
}
export interface RklParams {
    firstname: string;
    lastname: string;
    dob: string;
    id_doc_number: string;
    id_doc_seria?: string;
    secondname?: string;
    country?: string;
    [key: string]: any;
}
export interface KadEventMonitorParams {
    case_number: string;
    country?: string;
    previous_snapshot?: Record<string, any>;
    openai_interpretation?: boolean | number | string;
    [key: string]: any;
}
//# sourceMappingURL=types.d.ts.map