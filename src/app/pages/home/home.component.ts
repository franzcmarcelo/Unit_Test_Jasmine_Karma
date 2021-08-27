import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

import { take } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public listBook: Book[] = [];

  constructor(
    public readonly bookService: BookService
  ) { }

  ngOnInit(): void {

    this.getBooks();

  }

  public getBooks(): void {
    // .pipe(take(1)) -> se subscribe solo una vez,
    // no cada vez que entrase en el ngOnInit()
    this.bookService.getBooks().pipe(take(1)).subscribe((resp: Book[]) => {
      this.listBook = resp;
    });
  }

}
