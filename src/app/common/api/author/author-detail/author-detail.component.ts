import { Component, OnInit } from '@angular/core';
import { AuthorService } from 'src/app/services/author.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { Author } from '../Author';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';
@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css']
})
export class AuthorDetailComponent implements OnInit {

  author = new Author();
  books = [];
  id: number;
  authors = [];
  bookStatuses: Array<any> = [];

  BookForm: FormGroup;
  modalRef: BsModalRef;
  updated = true;
    AuthorUpdateForm: FormGroup;
  showModal = true;
  message:string ="";

  constructor(private authorService: AuthorService,
              private bookService: BookService,
              private alert: AlertifyService,
              private route: ActivatedRoute,
              private location: Location,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.staticLoadPage();
    this.LoadAuthorUpdateForm(this.author);
  }
  staticLoadPage(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.BookForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'publisher': [null, [Validators.required]],
      'barcode': [null, [Validators.required]],
      'content': [null, [Validators.required]],
      'bookStatus': [null, [Validators.required]],
      'authorId': [this.id]
    });
    this.BookForm.value['authorId'] = this.id;
    this.loadAuthorDetail();
    this.getAllBookStatus();
  }

  loadAuthorDetail() {
    this.authorService.getById(this.id).subscribe(response => {
      this.author = response;
      this.books = response['books'];
    });
  }
  LoadAuthorUpdateForm(res){
    this.updated=true;
    this.AuthorUpdateForm = this.formBuilder.group({
      'name': [res['name'], [Validators.required]],
      'surname': [res['surname'], [Validators.required]],
      'email': [res['email'], [Validators.required]],
      'phone': [res['phone'], [Validators.required]],
      'about': [res['about']]
    });
  }
  updateAuthor(){
    console.log('loading')
    if (!this.AuthorUpdateForm.valid) {
      return;
    }
    this.authorService.put(this.id,this.AuthorUpdateForm.value).subscribe(
      res => {
        this.staticLoadPage();
        this.LoadAuthorUpdateForm(res);
        if(res['id']==this.id){
          this.updated = false;
          this.alert.success('author Book got updated.');
        }
      },
      error=>{
        this.alert.success('author update failed. <br/>Try again later..');
      }
    );
  }
  saveBook() {
    this.BookForm.value['authorId'] = this.id;
    if (!this.BookForm.valid) {
      return;
    }
    this.bookService.post(this.BookForm.value).subscribe(
      res => {
        this.loadAuthorDetail();
        if(res['id'] > 0 ){
          this.showModal = false;
          this.alert.success('Success.');
        }
        this.BookForm.reset();
      },
      error=>{
        this.staticLoadPage();
        this.LoadAuthorUpdateForm(this.author);
        this.alert.error('Failed to save.');
      }
    );
  }

  deleteBook(id) {
    this.bookService.delete(id).subscribe(
      res => {
        if (res === true) {
          this.loadAuthorDetail();
          this.alert.success('successfully deleted.');
        } else {
          this.loadAuthorDetail();
          this.alert.error('deletion failed. <br/> Try again later.');
        }
      },
      error=>{
        this.alert.error('deletion failed. <br/> Try again later.');
      }
    );
  }
  getAllBookStatus(){
    this.bookService.getAllBookStatus().subscribe( res => {
      this.bookStatuses = res;
    });
  }
  backClicked() {
    this.location.back();
  }
  LoadInsertBookForm() {
    this.showModal = true;
  }
  get f1() { return this.BookForm.controls; }
  get f2() { return this.AuthorUpdateForm.controls; }
}
