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

# Unit Test Base

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe('Home Component', () => {
  let myComponent: MyComponent
  // Fixture para debugging y testear un componente
  let fixture: ComponentFixture<MyComponent>

  let myService: MyService

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Modulos que se usan (p.e.:HttpClientTestingModule, angularMaterial)
      // tanto en nuestro component como los providers
      imports:[
      ],
      // componentes que utilzamos en nuestro test
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
    fixture = TestBed.createComponent(MyComponent)
    // Instanciamos el componente
    myComponent = fixture.componentInstance
    // El component estará entrando y hará lo que tenga que hacer en su método ngOnInit()
    fixture.detectChanges()


    // Declaración de un  servicio
    myService = fixture.debugElement.injector.get(MyService)
  });

  it('Should create', () => {
    expect(myComponent).toBeTruthy()
  });
});
```

#

# Spies

*   `.and.callFake()`

    Creamos un espía para método, este rastreará todas las llamdas.

    Y además: estas llamadas al espía (método rastreado) se delegarán en la función proporcionada

    ```
    spyOn(componentOrService, 'método').and.callFake(()=>{})
    ```

*   `.and.callThrough()`

    Creamos un espía para método, este rastreará todas las llamdas.

    y además: estas llamadas al espía (método rastreado) se delegarán en la implemetación real

    ```
    spyOn(componentOrService, 'método').and.callThrough()
    ```

