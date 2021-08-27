import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BookService } from "src/app/services/book.service";
import { HomeComponent } from "./home.component";
import { Book } from 'src/app/models/book.model';
import { of } from "rxjs";

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

@Pipe({name: 'reduceText'})
class ReduceTextPipeMock implements PipeTransform {
  transform(): string{
    return '';
  }
}


describe('Home Component', () => {
  let homeComponent: HomeComponent
  let fixture: ComponentFixture<HomeComponent>

  let bookService: BookService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      declarations:[
        HomeComponent,
        ReduceTextPipeMock
      ],
      providers:[
        // Para cuando se mockea a través de los spies:
        // desventaja: no podremos comprobar que el metodo se llamo a través del spy
        // BookService,

        // Para cuando se desea mockear desde el provider:
        // ventaja: ya no es necesario crear un spy para simular el comportamiento del metodo
        // o establecer que valor regresa
        {
          provide: BookService,
          useValue: {
            getBooks: () => of(listBooksMock)
          }
        }
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent)
    homeComponent = fixture.componentInstance
    fixture.detectChanges()

    bookService = fixture.debugElement.injector.get(BookService)
  });

  it('Should create Home Component', () => {
    expect(homeComponent).toBeTruthy()
  });

  it('1: Test for getBooks(), get book from a suscribe()', () => {
    // Esto nos da un error poque getBook, no devuelve un Book[]
    // (method) BookService.getBooks(): Observable<Book[]>
    // Devuelve un obsevable de tipo Book[] Observable<Book[]>
    // const getBooksSpy = spyOn(bookService, 'getBooks').and.returnValue(listBook)
    // Retornamos un observable de tipo listBook, así:
    const getBooksServiceSpy = spyOn(bookService, 'getBooks').and.returnValue(of(listBooksMock))

    homeComponent.getBooks()

    expect(getBooksServiceSpy).toHaveBeenCalled()
    expect(homeComponent.listBook.length).toEqual(3)
  });


  // MOCK DE UN SERVICIO (MOCKEAR LOS METODOS DE SERVICIOS)
  // Para cuando se desea mockear desde el provider:
  // ventaja: ya no es necesario crear un spy para simular el comportamiento del metodo
  // o establecer que valor regresa, y en consecuencia tampoco es necesaio instanciar el
  // servicio usando fixture.debugElement.injector.get(BookService)

  // providers:[
  //   {
  //     provide: BookService,
  //     useValue: {
  //       getBooks: () => of(listBooksMock)
  //     }
  //   }
  // ],
  it('2: Test for getBooks(), get book from a suscribe()', () => {
    homeComponent.getBooks()

    expect(homeComponent.listBook.length).toEqual(3)
  });

});