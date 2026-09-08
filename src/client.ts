/**
 * NewDB Client for Node.js and TypeScript.
 */

declare const process: any;

function generateUuid(): string {
  const gCrypto = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : null;
  if (gCrypto && typeof gCrypto.randomUUID === 'function') {
    return gCrypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
import {
  NewDBClientOptions,
  BalanceResponse,
  TaskResponse,
  MethodResult,
  WaitOptions,
  PassportMvdParams,
  PassportFnsParams,
  FsspPersonParams,
  ComplexPassportParams,
  EgrulParams,
  ComplexInnParams,
  KadEventMonitorParams,
  RklParams,
} from './types.js';
import {
  AuthenticationError,
  RateLimitError,
  TimeoutError,
  APIResponseError,
} from './errors.js';

const DEFAULT_BASE_URL = 'https://api.newdb.net/v2';
const TEST_BASE_URL = 'https://api.newdb.net/test/v2';
const DEFAULT_TEST_TOKEN = 'test_token_newdb_sandbox';

export class PersonApi {
  constructor(private client: NewDBClient) {}

  checkPassportMvd(params: PassportMvdParams) {
    return this.client.execute({ method: 'passport_mvd', country: 'ru', ...params });
  }

  checkPassportFns(params: PassportFnsParams) {
    return this.client.execute({ method: 'passport_fns', country: 'ru', ...params });
  }

  checkFssp(params: FsspPersonParams) {
    return this.client.execute({ method: 'fssp_person', regioncode: '100', country: 'ru', ...params });
  }

  complexCheck(params: ComplexPassportParams) {
    return this.client.execute({ method: 'complex_by_passport', regioncode: '100', country: 'ru', ...params });
  }

  checkBankrot(params: { innfiz?: string; fio?: string; [key: string]: any }) {
    return this.client.execute({ method: 'bankrot_person', country: 'ru', ...params });
  }

  checkPledge(params: { firstname: string; lastname: string; [key: string]: any }) {
    return this.client.execute({ method: 'pledge_person', country: 'ru', ...params });
  }

  checkArbitr(params: { innfiz?: string; fio?: string; [key: string]: any }) {
    return this.client.execute({ method: 'arbitr_person', country: 'ru', ...params });
  }

  checkNalogDebt(inn: string) {
    return this.client.execute({ method: 'nalog_debt', inn, country: 'ru' });
  }

  checkFnsBlock(innfiz: string) {
    return this.client.execute({ method: 'fns_block_person', innfiz, country: 'ru' });
  }

  checkEgrulIp(innfiz: string) {
    return this.client.execute({ method: 'egrul_ip', innfiz, country: 'ru' });
  }

  checkTerrorist(params: { firstname: string; lastname: string; [key: string]: any }) {
    return this.client.execute({ method: 'terrorist', country: 'ru', ...params });
  }
}

export class LegalApi {
  constructor(private client: NewDBClient) {}

  checkEgrul(params: EgrulParams) {
    return this.client.execute({ method: 'egrul', country: 'ru', ...params });
  }

  checkFnsBlock(params: { inn: string; bik?: string; [key: string]: any }) {
    return this.client.execute({ method: 'fns_block', country: 'ru', ...params });
  }

  checkBankrot(params: { inn?: string; ogrn?: string; [key: string]: any }) {
    return this.client.execute({ method: 'bankrot_legal', country: 'ru', ...params });
  }

  checkArbitr(inn: string) {
    return this.client.execute({ method: 'arbitr_legal', inn, country: 'ru' });
  }

  monitorKadCase(params: KadEventMonitorParams) {
    return this.client.execute({ method: 'kad_event_monitor', country: 'ru', ...params });
  }

  checkFssp(inn: string) {
    return this.client.execute({ method: 'fssp_legal', inn, country: 'ru' });
  }

  complexCheck(params: ComplexInnParams) {
    return this.client.execute({ method: 'complex_by_inn', country: 'ru', ...params });
  }
}

export class ForeignApi {
  constructor(private client: NewDBClient) {}

  checkRkl(params: RklParams) {
    return this.client.execute({ method: 'rkl', country: 'ru', ...params });
  }

  checkPatent(params: { number: string; seria?: string; region?: 'msk' | 'mo' | 'all'; [key: string]: any }) {
    const method = params.region === 'mo' ? 'patent_mo' : params.region === 'all' ? 'foreign_patent' : 'patent_msk';
    return this.client.execute({ method, country: 'ru', ...params });
  }

  checkVng(seria: string, number: string) {
    return this.client.execute({ method: 'foreign_vng', seria, number, country: 'ru' });
  }

  checkRnr(number: string) {
    return this.client.execute({ method: 'foreign_rnr', number, country: 'ru' });
  }
}

export class PropertyApi {
  constructor(private client: NewDBClient) {}

  checkRosreestr(params: { cadastr_number?: string; address?: string; [key: string]: any }) {
    return this.client.execute({ method: 'rosreestr', country: 'ru', ...params });
  }

  checkPledgeVin(vin: string) {
    return this.client.execute({ method: 'pledge_vin', vin, country: 'ru' });
  }
}

export class NewDBClient {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;
  public testMode: boolean;

  public person: PersonApi;
  public legal: LegalApi;
  public foreign: ForeignApi;
  public property: PropertyApi;

  constructor(options: NewDBClientOptions = {}) {
    const envTest =
      typeof process !== 'undefined' &&
      ['1', 'true', 'yes'].includes(String(process.env?.NEWDB_TEST_MODE || '').toLowerCase());
    this.testMode = Boolean(options.testMode ?? envTest);

    const envKey = typeof process !== 'undefined' ? process.env?.NEWDB_API_KEY : undefined;
    const resolvedKey = options.apiKey || envKey || (this.testMode ? DEFAULT_TEST_TOKEN : '');

    if (!resolvedKey) {
      throw new AuthenticationError('API Key is required.');
    }
    this.apiKey = resolvedKey.trim();

    const envBaseUrl = typeof process !== 'undefined' ? process.env?.NEWDB_BASE_URL : undefined;
    const defaultUrl = this.testMode ? TEST_BASE_URL : (envBaseUrl || DEFAULT_BASE_URL);
    this.baseUrl = (options.baseUrl || defaultUrl).replace(/\/$/, '');
    this.timeoutMs = options.timeoutMs || 60000;

    this.person = new PersonApi(this);
    this.legal = new LegalApi(this);
    this.foreign = new ForeignApi(this);
    this.property = new PropertyApi(this);
  }

  public async getBalance(): Promise<BalanceResponse> {
    const response = await fetch(`${this.baseUrl}/balance`, {
      method: 'GET',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError();
    }
    if (!response.ok) {
      throw new APIResponseError(await response.text(), response.status);
    }

    const data = await response.json();
    return {
      token: data.token || '',
      balance: data.balance || 0,
      raw: data,
    };
  }

  public async execute(params: Record<string, any>, requestId?: string, webhook?: string): Promise<TaskResponse> {
    const reqId = requestId || generateUuid();
    const payload: Record<string, any> = {
      requestId: reqId,
      params,
    };
    if (webhook) {
      payload.webhook = webhook;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError();
      }
      if (response.status === 429) {
        throw new RateLimitError();
      }
      if (!response.ok && response.status >= 500) {
        throw new APIResponseError(await response.text(), response.status);
      }

      const data = await response.json();
      return this.parseTaskResponse(data);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async getTask(requestId: string): Promise<TaskResponse> {
    return this.execute({}, requestId);
  }

  public async waitForResult(requestId: string, options: WaitOptions = {}): Promise<TaskResponse> {
    const timeoutSeconds = options.timeoutSeconds || 120;
    const pollIntervalMs = options.pollIntervalMs || 2000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutSeconds * 1000) {
      const task = await this.getTask(requestId);
      if (task.state === 'complete' || task.state === 'failed') {
        return task;
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new TimeoutError(`Task ${requestId} did not finish within ${timeoutSeconds}s.`);
  }

  private parseTaskResponse(data: any): TaskResponse {
    const requestId = String(data.requestId || data.reqid || '');
    const state = String(data.state || 'unknown');
    const results: Record<string, MethodResult> = {};

    if (data.results && typeof data.results === 'object') {
      for (const [method, payload] of Object.entries(data.results)) {
        if (payload && typeof payload === 'object') {
          const resObj = (payload as any).result || payload;
          results[method] = {
            status: Number(resObj.status ?? 200),
            data: resObj.data,
            error: resObj.error,
            found: resObj.found,
            raw: payload as any,
          };
        }
      }
    }

    return {
      requestId,
      state,
      results,
      raw: data,
    };
  }
}
