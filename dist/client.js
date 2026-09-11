"use strict";
/**
 * NewDB Client for Node.js and TypeScript.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewDBClient = exports.PropertyApi = exports.ForeignApi = exports.LegalApi = exports.PersonApi = void 0;
function generateUuid() {
    const gCrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : null;
    if (gCrypto && typeof gCrypto.randomUUID === 'function') {
        return gCrypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const errors_js_1 = require("./errors.js");
const DEFAULT_BASE_URL = 'https://api.newdb.net/v2';
const TEST_BASE_URL = 'https://api.newdb.net/test/v2';
const DEFAULT_TEST_TOKEN = 'test_token_newdb_sandbox';
class PersonApi {
    client;
    constructor(client) {
        this.client = client;
    }
    checkPassportMvd(params) {
        return this.client.execute({ method: 'passport_mvd', country: 'ru', ...params });
    }
    checkPassportFns(params) {
        return this.client.execute({ method: 'passport_fns', country: 'ru', ...params });
    }
    checkFssp(params) {
        return this.client.execute({ method: 'fssp_person', regioncode: '100', country: 'ru', ...params });
    }
    complexCheck(params) {
        return this.client.execute({ method: 'complex_by_passport', regioncode: '100', country: 'ru', ...params });
    }
    checkBankrot(params) {
        return this.client.execute({ method: 'bankrot_person', country: 'ru', ...params });
    }
    checkPledge(params) {
        return this.client.execute({ method: 'pledge_person', country: 'ru', ...params });
    }
    checkArbitr(params) {
        return this.client.execute({ method: 'arbitr_person', country: 'ru', ...params });
    }
    checkNalogDebt(inn) {
        return this.client.execute({ method: 'nalog_debt', inn, country: 'ru' });
    }
    checkFnsBlock(innfiz) {
        return this.client.execute({ method: 'fns_block_person', innfiz, country: 'ru' });
    }
    checkEgrulIp(innfiz) {
        return this.client.execute({ method: 'egrul_ip', innfiz, country: 'ru' });
    }
    checkTerrorist(params) {
        return this.client.execute({ method: 'terrorist', country: 'ru', ...params });
    }
}
exports.PersonApi = PersonApi;
class LegalApi {
    client;
    constructor(client) {
        this.client = client;
    }
    checkEgrul(params) {
        return this.client.execute({ method: 'egrul', country: 'ru', ...params });
    }
    checkFnsBlock(params) {
        return this.client.execute({ method: 'fns_block', country: 'ru', ...params });
    }
    checkBankrot(params) {
        return this.client.execute({ method: 'bankrot_legal', country: 'ru', ...params });
    }
    checkArbitr(inn) {
        return this.client.execute({ method: 'arbitr_legal', inn, country: 'ru' });
    }
    monitorKadCase(params) {
        return this.client.execute({ method: 'kad_event_monitor', country: 'ru', ...params });
    }
    checkFssp(inn) {
        return this.client.execute({ method: 'fssp_legal', inn, country: 'ru' });
    }
    checkBo(params) {
        return this.client.execute({ method: 'fns_bo', country: 'ru', ...params });
    }
    complexCheck(params) {
        return this.client.execute({ method: 'complex_by_inn', country: 'ru', ...params });
    }
}
exports.LegalApi = LegalApi;
class ForeignApi {
    client;
    constructor(client) {
        this.client = client;
    }
    checkRkl(params) {
        return this.client.execute({ method: 'rkl', country: 'ru', ...params });
    }
    checkPatent(params) {
        const method = params.region === 'mo' ? 'patent_mo' : params.region === 'all' ? 'foreign_patent' : 'patent_msk';
        return this.client.execute({ method, country: 'ru', ...params });
    }
    checkVng(seria, number) {
        return this.client.execute({ method: 'foreign_vng', seria, number, country: 'ru' });
    }
    checkRnr(number) {
        return this.client.execute({ method: 'foreign_rnr', number, country: 'ru' });
    }
}
exports.ForeignApi = ForeignApi;
class PropertyApi {
    client;
    constructor(client) {
        this.client = client;
    }
    checkRosreestr(params) {
        return this.client.execute({ method: 'rosreestr', country: 'ru', ...params });
    }
    checkPledgeVin(vin) {
        return this.client.execute({ method: 'pledge_vin', vin, country: 'ru' });
    }
}
exports.PropertyApi = PropertyApi;
class NewDBClient {
    apiKey;
    baseUrl;
    timeoutMs;
    testMode;
    person;
    legal;
    foreign;
    property;
    constructor(options = {}) {
        const envTest = typeof process !== 'undefined' &&
            ['1', 'true', 'yes'].includes(String(process.env?.NEWDB_TEST_MODE || '').toLowerCase());
        this.testMode = Boolean(options.testMode ?? envTest);
        const envKey = typeof process !== 'undefined' ? process.env?.NEWDB_API_KEY : undefined;
        const resolvedKey = options.apiKey || envKey || (this.testMode ? DEFAULT_TEST_TOKEN : '');
        if (!resolvedKey) {
            throw new errors_js_1.AuthenticationError('API Key is required.');
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
    async getBalance() {
        const response = await fetch(`${this.baseUrl}/balance`, {
            method: 'GET',
            headers: {
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 401 || response.status === 403) {
            throw new errors_js_1.AuthenticationError();
        }
        if (!response.ok) {
            throw new errors_js_1.APIResponseError(await response.text(), response.status);
        }
        const data = await response.json();
        return {
            token: data.token || '',
            balance: data.balance || 0,
            raw: data,
        };
    }
    async generateReport(requestId, format = 'html', reportType) {
        const query = new URLSearchParams({ requestId, format });
        if (reportType)
            query.set('report_type', reportType);
        const response = await fetch(`${this.baseUrl}/report?${query.toString()}`, {
            headers: { 'X-API-KEY': this.apiKey },
        });
        if (response.status === 401 || response.status === 403)
            throw new errors_js_1.AuthenticationError();
        if (!response.ok)
            throw new errors_js_1.APIResponseError(await response.text(), response.status);
        return response.arrayBuffer();
    }
    async generateAggregatedReport(requestIds, reportType, format = 'html') {
        const response = await fetch(`${this.baseUrl}/report`, {
            method: 'POST',
            headers: { 'X-API-KEY': this.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestIds, report_type: reportType, format }),
        });
        if (response.status === 401 || response.status === 403)
            throw new errors_js_1.AuthenticationError();
        if (!response.ok)
            throw new errors_js_1.APIResponseError(await response.text(), response.status);
        return response.arrayBuffer();
    }
    async execute(params, requestId, webhook) {
        const reqId = requestId || generateUuid();
        const payload = {
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
                throw new errors_js_1.AuthenticationError();
            }
            if (response.status === 429) {
                throw new errors_js_1.RateLimitError();
            }
            if (!response.ok && response.status >= 500) {
                throw new errors_js_1.APIResponseError(await response.text(), response.status);
            }
            const data = await response.json();
            return this.parseTaskResponse(data);
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    async getTask(requestId) {
        return this.execute({}, requestId);
    }
    async waitForResult(requestId, options = {}) {
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
        throw new errors_js_1.TimeoutError(`Task ${requestId} did not finish within ${timeoutSeconds}s.`);
    }
    parseTaskResponse(data) {
        const requestId = String(data.requestId || data.reqid || '');
        const state = String(data.state || 'unknown');
        const results = {};
        if (data.results && typeof data.results === 'object') {
            for (const [method, payload] of Object.entries(data.results)) {
                if (payload && typeof payload === 'object') {
                    const resObj = payload.result || payload;
                    results[method] = {
                        status: Number(resObj.status ?? 200),
                        data: resObj.data,
                        error: resObj.error,
                        found: resObj.found,
                        raw: payload,
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
exports.NewDBClient = NewDBClient;
//# sourceMappingURL=client.js.map