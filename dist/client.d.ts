/**
 * NewDB Client for Node.js and TypeScript.
 */
import { NewDBClientOptions, BalanceResponse, TaskResponse, WaitOptions, PassportMvdParams, PassportFnsParams, FsspPersonParams, ComplexPassportParams, EgrulParams, ComplexInnParams, KadEventMonitorParams, RklParams } from './types.js';
export declare class PersonApi {
    private client;
    constructor(client: NewDBClient);
    checkPassportMvd(params: PassportMvdParams): Promise<TaskResponse>;
    checkPassportFns(params: PassportFnsParams): Promise<TaskResponse>;
    checkFssp(params: FsspPersonParams): Promise<TaskResponse>;
    complexCheck(params: ComplexPassportParams): Promise<TaskResponse>;
    checkBankrot(params: {
        innfiz?: string;
        fio?: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkPledge(params: {
        firstname: string;
        lastname: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkArbitr(params: {
        innfiz?: string;
        fio?: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkNalogDebt(inn: string): Promise<TaskResponse>;
    checkFnsBlock(innfiz: string): Promise<TaskResponse>;
    checkEgrulIp(innfiz: string): Promise<TaskResponse>;
    checkTerrorist(params: {
        firstname: string;
        lastname: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
}
export declare class LegalApi {
    private client;
    constructor(client: NewDBClient);
    checkEgrul(params: EgrulParams): Promise<TaskResponse>;
    checkFnsBlock(params: {
        inn: string;
        bik?: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkBankrot(params: {
        inn?: string;
        ogrn?: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkArbitr(inn: string): Promise<TaskResponse>;
    monitorKadCase(params: KadEventMonitorParams): Promise<TaskResponse>;
    checkFssp(inn: string): Promise<TaskResponse>;
    checkBo(params: {
        inn: string;
        get_screen?: boolean;
        [key: string]: any;
    }): Promise<TaskResponse>;
    complexCheck(params: ComplexInnParams): Promise<TaskResponse>;
}
export declare class ForeignApi {
    private client;
    constructor(client: NewDBClient);
    checkRkl(params: RklParams): Promise<TaskResponse>;
    checkPatent(params: {
        number: string;
        seria?: string;
        region?: 'msk' | 'mo' | 'all';
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkVng(seria: string, number: string): Promise<TaskResponse>;
    checkRnr(number: string): Promise<TaskResponse>;
}
export declare class PropertyApi {
    private client;
    constructor(client: NewDBClient);
    checkRosreestr(params: {
        cadastr_number?: string;
        address?: string;
        [key: string]: any;
    }): Promise<TaskResponse>;
    checkPledgeVin(vin: string): Promise<TaskResponse>;
    checkVin(vin: string, getScreen?: number): Promise<TaskResponse>;
}
export declare class NewDBClient {
    private apiKey;
    private baseUrl;
    private timeoutMs;
    testMode: boolean;
    person: PersonApi;
    legal: LegalApi;
    foreign: ForeignApi;
    property: PropertyApi;
    constructor(options?: NewDBClientOptions);
    getBalance(): Promise<BalanceResponse>;
    generateReport(requestId: string, format?: 'html' | 'pdf', reportType?: string): Promise<ArrayBuffer>;
    generateAggregatedReport(requestIds: string[], reportType: string, format?: 'html' | 'pdf'): Promise<ArrayBuffer>;
    execute(params: Record<string, any>, requestId?: string, webhook?: string): Promise<TaskResponse>;
    getTask(requestId: string): Promise<TaskResponse>;
    waitForResult(requestId: string, options?: WaitOptions): Promise<TaskResponse>;
    private parseTaskResponse;
}
//# sourceMappingURL=client.d.ts.map