# @newdb/sdk

Официальный TypeScript / JavaScript SDK для работы с [NewDB REST API](https://newdb.net) — проверкой физических лиц, юридических лиц, иностранных граждан, залогов, недвижимости и судебных дел по официальным реестрам РФ (ФНС, ФССП, МВД, Федресурс, КАД Арбитр, ЕГРЮЛ, ЕГРИП, Нотариат, ГАС Правосудие).

[![npm version](https://img.shields.io/npm/v/@newdb/sdk.svg)](https://www.npmjs.com/package/@newdb/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Установка

```bash
npm install @newdb/sdk
```
или
```bash
yarn add @newdb/sdk
pnpm add @newdb/sdk
```

---

## Быстрый старт

```typescript
import { NewDBClient } from '@newdb/sdk';

const client = new NewDBClient({
  apiKey: 'your_api_token',
});

async function run() {
  // 1. Проверка баланса токена
  const balance = await client.getBalance();
  console.log(`Остаток: ${balance.balance} запросов`);

  // 2. Проверка действительности паспорта РФ (МВД)
  const passport = await client.person.checkPassportMvd({
    seria: '4510',
    number: '123456',
    firstname: 'Иван',
    lastname: 'Иванов',
  });
  console.log(passport.results);

  // 3. Комплексная проверка организации по ИНН с авто-ожиданием результата
  const companyTask = await client.legal.complexCheck({ inn: '7707083893' });
  const completed = await client.waitForResult(companyTask.requestId, { timeoutSeconds: 60 });
  console.log(completed.results);
}

run().catch(console.error);
```

---

### Тестовый режим (Sandbox / Test Mode)

Для тестирования и локальной отладки интеграции без списания запросов с баланса используйте флаг `testMode: true`:

```typescript
import { NewDBClient } from '@newdb/sdk';

// Активация тестового контура https://api.newdb.net/test/v2
const client = new NewDBClient({ testMode: true });

// Либо через переменную окружения:
// process.env.NEWDB_TEST_MODE = '1';
// const client = new NewDBClient();

async function runTest() {
  const res = await client.person.checkPassportMvd({
    seria: '4510',
    number: '123456',
    firstname: 'Иван',
    lastname: 'Иванов',
  });
  console.log('Тестовый ответ:', res.results);
}
runTest();
```

---

## Поддерживаемые методы

### Физические лица (`client.person.*`)
* `checkPassportMvd({ seria, number, firstname, lastname })` — действительность паспорта (МВД)
* `checkPassportFns({ seria, number, firstname, lastname, dob, secondname? })` — получение ИНН и валидация (ФНС)
* `complexCheck({ seria, number, firstname, lastname, ... })` — комплексная проверка физлица по паспорту (ФНС, ФССП, банкротство, арбитраж, залоги, ЕГРИП)
* `checkFssp({ firstname, lastname, dob, regioncode? })` — исполнительные производства ФССП
* `checkBankrot({ innfiz?, fio? })` — банкротство физлиц и ИП (Федресурс)
* `checkPledge({ firstname, lastname, ... })` — залоги движимого имущества (ФНП)
* `checkArbitr({ innfiz?, fio? })` — арбитражные дела в КАД
* `checkNalogDebt(inn)` — налоговая задолженность
* `checkFnsBlock(innfiz)` — блокировки банковских счетов (ФНС)
* `checkEgrulIp(innfiz)` — выписка ЕГРИП и статус индивидуального предпринимателя

### Юридические лица (`client.legal.*`)
* `checkEgrul({ inn?, ogrn? })` — сведения ЕГРЮЛ и «Прозрачный бизнес»
* `checkFnsBlock({ inn, bik? })` — блокировки счетов (ФНС)
* `checkBankrot({ inn?, ogrn? })` — банкротство юридических лиц
* `checkArbitr(inn)` — арбитражные дела компании
* `monitorKadCase({ case_number })` — процессуальный мониторинг конкретного дела КАД
* `checkFssp(inn)` — исполнительные производства компании
* `complexCheck({ inn })` — комплексная проверка организации + проверка руководства и учредителей

### Иностранные граждане (`client.foreign.*`)
* `checkRkl({ firstname, lastname, dob, id_doc_number, ... })` — реестр контролируемых лиц (РКЛ МВД)
* `checkPatent({ number, seria?, region? })` — трудовой патент (Москва, МО, регионы)
* `checkVng(seria, number)` — вид на жительство (ВНЖ)
* `checkRnr(number)` — разрешение на работу

### Имущество (`client.property.*`)
* `checkRosreestr({ cadastr_number?, address? })` — проверка недвижимости
* `checkPledgeVin(vin)` — проверка автомобиля на залоги по VIN

---

## Документация и контакты

* Документация API: [https://newdb.net/docs](https://newdb.net/docs)
* Запрос токена: [access@newdb.net](mailto:access@newdb.net)
* Лицензия: MIT
