import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('Cart component', () => {
  let component: CartComponent;
  // Nos permite extraer el servicio de nuestro componente (book.service)
  let fixture: ComponentFixture<CartComponent>;

  // Configuración
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Modulos que se usan (p.e.:angularMaterial)
      imports: [
        // para simular las peticiones http
        HttpClientTestingModule
      ],
      // componentes que utilzamos en nuestro test
      declarations: [
        CartComponent
      ],
      // servicios que utiliza nuestro component
      providers: [
        BookService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents()
  });

  // Instanciamos el component
  beforeEach(() => {
    // Extraemos el componente del TestBed
    fixture = TestBed.createComponent(CartComponent);
    // Instanciamos el componente
    component = fixture.componentInstance;
    // El component estará entrando y hará lo que tenga que hacer en su método ngOnInit()
    fixture.detectChanges();
  });

  // Comprobamos que el component se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
})

