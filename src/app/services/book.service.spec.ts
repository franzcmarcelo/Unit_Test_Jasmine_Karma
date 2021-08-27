import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from "@angular/core/testing";

import { Book } from '../models/book.model';
import { BookService } from "./book.service";
import { environment } from 'src/environments/environment.prod';
import swal from 'sweetalert2';


const listBooksMock: Book[] = [
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

const bookMock: Book = {
  id: '1',
  name: 'Book name',
  author: 'Author',
  isbn: '3r29r90',
}


describe('BookService', () => {

  let bookService: BookService

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
        BookService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }); // No hace falta el .compileComponents porque no es un componente, sino un servicio
  })

  // INSTANCIAS
  beforeEach(() => {
    bookService = TestBed.inject(BookService)
    // bookService = TestBed.get(BookService) // deprecated

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

  it('should be created BookService', () => {
    expect(bookService).toBeTruthy()
  });

  // getBooks () -> request.method, reponse mock
  it('Test for getBooks(), return a list of book & does a GET method', () => {

    // Test for request data (salta con .flush(response))
    bookService.getBooks().subscribe((resp: Book[]) => {
      expect(resp).toEqual(listBooksMock);
    })

    // Test for request info
    const url = environment.API_REST_URL + `/book`;
    // expectOne, espera que se haya realizado una sola solicitud
    // que coincida con la URL dada
    const requestGetProducts = httpTestingController.expectOne(url);
    expect(requestGetProducts.request.method).toBe('GET')

    // Hasta este momento el request no manda nada
    // Liberamos el response mockeado:
    requestGetProducts.flush(listBooksMock)
    // Al liberar el response, la suscripción que tenemos al método getBooks()
    // va a saltar y se comprobará el expect descrito ahí
  });

  // getBooksFromCart() -> localStorage mock
  it('Test for getBooksFromCart(), when localStorage is empty, return []', () => {
    const listBookCart = bookService.getBooksFromCart()
    expect(listBookCart.length).toBe(0)
  });

  // addBookToCart()
  describe('Test for addBookToCart()', () => {

    const toast = { fire: ()=>{} } as any;

    beforeEach(() => {
      localStorageMock = {}
    });

    it('When listCartBook does not exist in the localStorage, setItem correctly', () => {
      const mixinSwalSpy = spyOn(swal, 'mixin').and.callFake(()=>{
        return toast
      })

      bookService.addBookToCart(bookMock)
      const listBookCart = bookService.getBooksFromCart()

      expect(listBookCart.length).toEqual(1)
      expect(mixinSwalSpy).toHaveBeenCalled()
    });

    it('when listCartBook exist in the localStorage and newBook exist (update amount)', () => {
      const mixinSwalSpy = spyOn(swal, 'mixin').and.callFake(()=>{
        return toast
      })

      bookService.addBookToCart(bookMock)
      bookService.addBookToCart(bookMock)
      let listBookCart: Book[] = bookService.getBooksFromCart()

      expect(listBookCart.length).toEqual(1)
      expect(listBookCart[0].amount).toEqual(2)
      expect(mixinSwalSpy).toHaveBeenCalled()
    });

    it('when listCartBook exist in the localStorage and newBook does not exist (push new book)', () => {
      const mixinSwalSpy = spyOn(swal, 'mixin').and.callFake(()=>{
        return toast
      })
      let newBookMock = {...bookMock}
      newBookMock.id = '2'

      bookService.addBookToCart(bookMock)
      bookService.addBookToCart(newBookMock)
      const listBookCart: Book[] = bookService.getBooksFromCart()

      expect(listBookCart.length).toEqual(2)
      expect(listBookCart[0].amount).toEqual(1)
      expect(listBookCart[1].amount).toEqual(1)
      expect(mixinSwalSpy).toHaveBeenCalled()
    });

  });

  // removeBooksFromCart()
  it('Test for removeBooksFromCart()', () => {
    let listBookCart: Book[]
    bookService.addBookToCart(bookMock)
    listBookCart = bookService.getBooksFromCart()
    expect(listBookCart.length).toEqual(1)

    bookService.removeBooksFromCart()

    listBookCart = bookService.getBooksFromCart()
    expect(listBookCart.length).toEqual(0)
  });

  // updateAmountBook()
  describe('Test for updateAmountBook()', () => {

    beforeEach(() => {
      localStorageMock = {}
    });

    it('When new book amount == 0', () => {
      bookService.addBookToCart(bookMock)
      let listBookCart: Book[]
      listBookCart = bookService.getBooksFromCart()
      expect(listBookCart[0].amount).toEqual(1)

      let updateBookMock = {
        ...bookMock,
        amount: 0 //update amount
      }

      bookService.updateAmountBook(updateBookMock)
      listBookCart = bookService.getBooksFromCart()
      expect(listBookCart.length).toEqual(0)
    });

    it('When new book amount >= 0', () => {
      bookService.addBookToCart(bookMock)
      let listBookCart: Book[]
      listBookCart = bookService.getBooksFromCart()
      expect(listBookCart[0].amount).toEqual(1)

      let updateBookMock = {
        ...bookMock,
        amount: 3 //update amount
      }

      bookService.updateAmountBook(updateBookMock)
      listBookCart = bookService.getBooksFromCart()
      expect(listBookCart[0].amount).toEqual(3)
    });
  });


});