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
    amount: 4,
    price: 12
  },
  {
    name: '',
    author: '',
    isbn: '',
    amount: 3,
    price: 20
  },
  {
    name: '',
    author: '',
    isbn: '',
    amount: 7,
    price: 6
  }
]
const totalPriceMock = 150;


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

  // ngOnInit(): void {
  //   this.listCartBook = this._bookService.getBooksFromCart();
  //   this.totalPrice = this.getTotalPrice(this.listCartBook);
  // }

  // Instanciamos el component
  beforeEach(() => {
    // Extraemos el componente del TestBed
    fixture = TestBed.createComponent(CartComponent);
    // Instanciamos el componente
    component = fixture.componentInstance;
    // El component estará entrando y hará lo que tenga que hacer en su método ngOnInit()
    fixture.detectChanges();

    // Declaración de nuestro servicio _bookService (private):
    bookService = fixture.debugElement.injector.get(BookService)

    // para las instrucciones dentro del método ngOnInit()
    spyOn(bookService, 'getBooksFromCart').and.callFake(()=>null)
  });

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

  // TEST MÉTODO PRIVADO
  // La única forma de testearlo correctamente, es testeando desde el método público que lo llama
  it('Test for onClearBooks() when listCartBook.length > 0', () => {
    // spy método privado
    const _clearListCartBookSpy = spyOn((component as any), '_clearListCartBook').and.callThrough()
    const removeBooksFromCartSpy = spyOn(bookService, 'removeBooksFromCart').and.callFake(()=>null)
    component.listCartBook = listCartBookMock;

    component.onClearBooks()

    expect(_clearListCartBookSpy).toHaveBeenCalled()
    expect(component.listCartBook.length).toEqual(0)
    expect(removeBooksFromCartSpy).toHaveBeenCalled()

  });
  // Otra forma, no recomendada es:
  it('Test for _clearListCartBook()', () => {
    const removeBooksFromCartSpy = spyOn(bookService, 'removeBooksFromCart').and.callFake(()=>null)
    component.listCartBook = listCartBookMock;

    // llamada método privado
    component['_clearListCartBook']()

    expect(component.listCartBook.length).toEqual(0)
    expect(removeBooksFromCartSpy).toHaveBeenCalled()
  });

})
