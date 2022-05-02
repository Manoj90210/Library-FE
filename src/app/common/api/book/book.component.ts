import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/Page';
import { BookService } from 'src/app/services/book.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  rows = [];
  cols = [];
  page = new Page();
  control = true;
  books = [];
  searchBookForm: FormGroup;
  message: string | undefined;

  constructor(private bookService: BookService,
              private alert: AlertifyService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.control = true;
    this.loadStaticPage();
  }
  loadStaticPage() {
    this.setPage({ offset: 0 });
    this.searchBookForm = this.formBuilder.group({
      'name': [null, [Validators.minLength(3), Validators.required]]
    });
  }
  setPage(pageInfo) {
    this.page.page = pageInfo.offset;
    this.bookService.getAllPageable(this.page).subscribe(pagedData => {
      this.page.size = pagedData.size;
      this.page.page = pagedData.page;
      this.page.totalElements = pagedData.totalElements;
      this.rows = pagedData.content;
    });
  }

  searchBook() {
    if (!this.searchBookForm.valid) {
      return;
    }
    this.bookService.findAllByName(this.searchBookForm.value['name']).subscribe(
      res => {
        this.control = false;
        this.books = res;
        this.message = ' Records Found. ';
        this.alert.success(' Records Found. ')
      },
      error => {
        this.control = true;
        this.loadStaticPage();
        this.alert.error('Hey No book recorded.');
        this.message = ' Hey No book recorded.';
      });
  }
  deleteBook(id) {
    this.bookService.delete(id).subscribe(res => {
      this.control = true;
      this.loadStaticPage();
      this.message = ' Book Deleted. ';
      this.alert.success(' Book Deleted. ');
    },
      error => {
        this.alert.error(' No Book found.. ');
        this.message = ' No Book found.. ';
      });
  }
  get sf() { return this.searchBookForm.controls; }
}
