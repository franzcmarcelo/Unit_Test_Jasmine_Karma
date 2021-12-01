# Unit Test with Jasmine and Karma

## Development server

Run for a dev server
```
npm run start
```

Navigate to
```
http://localhost:1234
```

#

## Running unit tests

Run to execute the unit tests via [Karma](https://karma-runner.github.io)
```
ng test
```
Running Karma server on
```
http://localhost:9876/
```

#

## Running backend

Run to execute backend via [json-server](https://github.com/typicode/json-server).
```
npm run backend
```
Navigate to
```
http://localhost:3000
```

#




# Unit Test Base (Component)

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe('Home Component', () => {
  let myComponent: MyComponent
  // componentfixture para debugging y testear un componente
  let componentfixture: ComponentFixture<MyComponent>

  let myService: MyService

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Modulos que se usan (p.e.:HttpClientTestingModule, angularMaterial)
      // tanto en nuestro component como los providers
      imports:[
      ],
      // componentes que utilzamos en nuestro test, pipesMocks
      declarations:[
        MyComponent
      ],
      // servicios que utiliza nuestro component
      providers:[
        MyService
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents()
  });

  // Instanciamos el component
  beforeEach(() => {
    // Extraemos el componente del TestBed
    componentfixture = TestBed.createComponent(MyComponent)
    // Instanciamos el componente
    myComponent = componentfixture.componentInstance
    
    // La detección retardada de cambios es intencionada y útil.
    // Le da al tester la oportunidad de inspeccionar y cambiar el estado del componente
    // antes de que Angular inicie el enlace de datos y llame a los hooks del ciclo de vida.
    // Tener cuidado cuando nuestros componentes usan: EventEmitter o Output
    componentfixture.detectChanges()


    // Declaración de un  servicio
    myService = componentfixture.debugElement.injector.get(MyService)
  });

  it('Should create', () => {
    expect(myComponent).toBeTruthy()
  });
});
```

#




# Spies

Creamos un spy para method, este rastreará todas sus llamadas.

```
const methodSpy = spyOn(<component or service>, '<method>')
```
* `<component or service>` donde se instalará el spy
* `<method>` que se reemplazará por el spy

Al encadenar el spy con:

*   `.and.callFake()`
    Todas las llamadas al spy (método rastreado) se delegarán en la función proporcionada
    ```
    spyOn(componentOrService, 'método').and.callFake(()=>{})
    ```

*   `.and.callThrough()`
    Todas las llamadas al espía (método rastreado) se delegarán en la implemetación real
    ```
    spyOn(componentOrService, 'método').and.callThrough()
    ```

*   `.and.returnValue(of(listBooksMock))`
    Las llamadas a la función devolverán un valor específico.

#




# Test to Services

```typescript
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from "@angular/core/testing";

describe('', () => {
  let myService: MyService

  // Para simular las petciciones http
  let httpTestingController: HttpTestingController

  // Para simular el Local Storage
  let localStorageMock = {}

  // CONFIGURACIÓN
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MyService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }); // No hace falta el .compileComponents porque no es un componente, sino un servicio
  })

  // INSTANCIAS
  beforeEach(() => {
    myService = TestBed.inject(MyService)

    httpTestingController = TestBed.inject(HttpTestingController)

    localStorageMock = {}
    // Spy for localStorage (alteramos los metodos get y set del localStorage)
    spyOn(localStorage, 'getItem').and.callFake(( key :string) => {
      return localStorageMock[key] ? localStorageMock[key] : null;
    })
    spyOn(localStorage, 'setItem').and.callFake(( key :string, value :string) => {
      return localStorageMock[key] = value
    })
  });

  afterAll(()=>{
    // Verifica que no haya peticiones pendientes entre cada test
    httpTestingController.verify()
  })

  it('should be created MyService', () => {
    expect(myService).toBeTruthy()
  });

  it('should getBooks, checking response and GET method', () => {
    const dataParamMock = ''
    const URL = environment.api + dataParamMock;

    // Test for request data (salta con .flush(response))
    myService.getBooks().subscribe((resp: Book[]) => {
      expect(resp).toEqual(listBooksMock);
    })

    // Test for request info
    // expectOne, espera que se haya realizado una sola solicitud
    // que coincida con la URL dada
    const requestGetProducts = httpTestingController.expectOne(URL);
    expect(requestGetProducts.request.method).toBe('GET')

    // Hasta este momento el request no manda nada
    // Liberamos el response mockeado:
    requestGetProducts.flush(listBooksMock)
    // Al liberar el response, la suscripción que tenemos al método getBooks()
    // va a saltar y se comprobará el expect descrito ahí
  });
```




# Test for Pipes

1. In My Component .spec

```typescript
@Pipe({name: 'myPipe'})
class MyPipeMock implements PipeTransform {
  transform(): any{
    ...
  }
}

describe('My Component', () => {
  ...
  beforeEach(() => {
    TestBed.configureTestingModule({
      ...
      declarations:[
        MyPipeMock
```

2. In My Pipe .spect

```typescript
import { MyPipe } from "./reduce-text.pipe";

describe('Test Pipe - MyPipe', () => {
  let myPipe: MyPipe

  beforeEach(() => {
    myPipe = new MyPipe()
  });

  it('should create MyPipe', () => {
    expect(myPipe).toBeTruthy()
  });

  it('Use transform correctly', () => {
    // for ReduceTextPipe:
    const text = 'Hello, this is a text to test MyPipe pipe'

    const newText = myPipe.transform(text, 5)

    expect(newText.length).toEqual(5)
  });
});
```
