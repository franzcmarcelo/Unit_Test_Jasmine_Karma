import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from 'src/app/models/book.model';

// Solo añadimos los obligatorios y los que vamos a necesitar
const listCartBookMock: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    amount: 2,
    price: 12
  },
  {
    name: '',
    author: '',
    isbn: '',
    amount: 1,
    price: 20
  },
  {
    name: '',
    author: '',
    isbn: '',
    amount: 3,
    price: 6
  }
]
const totalPriceMock = 62;


describe('Cart component', () => {
  let component: CartComponent;
  // Nos permite extraer el servicio de nuestro componente (book.service)
  let fixture: ComponentFixture<CartComponent>;

  let bookService: BookService;


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

    bookService = fixture.debugElement.injector.get(BookService)
  });

  // LOS TEST (it) NO SE LANZAN EN ORDEN

  // Comprobamos que el component se ha creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST MÉTODO CON RETURN
  it('Test for getTotalPrice()', () => {
    const listCartBook = listCartBookMock

    const totalPrice = component.getTotalPrice(listCartBook)

    expect(totalPrice).not.toBeNull()
    expect(totalPrice).not.toBe(0)
    expect(totalPrice).toBeGreaterThan(0)
    expect(totalPrice).toEqual(totalPriceMock)
  });

  // TEST MÉTODO SIN RETURN
  // SPIES
  it('Test for onInputNumberChange() when action=plus', () => {
    const action = 'plus'
    const book = {
      name: '',
      author: '',
      isbn: '',
      amount: 2,
    }

    // Formas incorrectas de declarar nuestro servicio _bookService (private):
    const bookService1 = (component as any)._bookService // casteamos a tipo any
    const bookService2 = component["_bookService"] // podemos hacer service2.getBooks()

    // Formar correta:
    // const bookService = fixture.debugElement.injector.get(BookService)

    // Spy para bookService
    const updateAmountBookSpy = spyOn(bookService, 'updateAmountBook').and.callFake(()=>null)
    const getTotalPriceSpy = spyOn(component, 'getTotalPrice').and.callFake(()=>null)

    expect(book.amount).toEqual(2)
    component.onInputNumberChange(action, book)


    expect(updateAmountBookSpy).toHaveBeenCalled()
    expect(getTotalPriceSpy).toHaveBeenCalled()
    expect(book.amount).toEqual(3)
    expect(book.amount === 3).toBeTrue()
  });

  it('Test for onInputNumberChange() when action=minus', () => {
    const action = 'minus'
    const book = {
      name: '',
      author: '',
      isbn: '',
      amount: 2,
    }

    const updateAmountBookSpy = spyOn(bookService, 'updateAmountBook').and.callFake(()=>null)
    const getTotalPriceSpy = spyOn(component, 'getTotalPrice').and.callFake(()=>null)

    expect(book.amount).toEqual(2)
    component.onInputNumberChange(action, book)


    expect(updateAmountBookSpy).toHaveBeenCalled()
    expect(getTotalPriceSpy).toHaveBeenCalled()
    expect(book.amount).toEqual(1)
  });
})

