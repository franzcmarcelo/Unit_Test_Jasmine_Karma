# Unit Test with Jasmine and Karma

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:1234`.

---

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

---

## Running backend

Run `ng back` to execute backend via [json-server](https://github.com/typicode/json-server). Navigate to `http://localhost:3000`

---
---

## SPIES

*   .and.callFake()

    Creamos un espía para método, este rastreará todas las llamdas.

    Y además: estas llamadas al espía (método rastreado) se delegarán en la función proporcionada

    `spyOn(componentOrService, 'método').and.callFake(()=>{})`

*   .and.callThrough()

    Creamos un espía para método, este rastreará todas las llamdas.

    y además: estas llamadas al espía (método rastreado) se delegarán en la implemetación real

    `spyOn(componentOrService, 'método').and.callThrough()`
