import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { StudentService } from 'src/app/services/student.service';
import { Student } from '../Student';
import { Book } from '../../book/Book';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {
  message: string | undefined;
  id: number;
  student = new  Student();
  books: Array<Book>;

  StudentUpdateForm: FormGroup;
  updated = true;
  cities: Array<any> = [];


  leaveBookForm: FormGroup;
  constructor(private route: ActivatedRoute,
              private location: Location,
              private alert: AlertifyService,
              private studentService: StudentService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadStudentDetails();
    this.LoadStudentUpdateForm(this.student);
  }

  loadStudentDetails() {
    this.getAllCities();

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.leaveBookForm = this.formBuilder.group({
      'bookId': [null, [Validators.required]],
      'studentId': [this.id, [Validators.required]]
    });
    
    this.studentService.getById(this.id).subscribe(
      res => {
      this.student = res;
      this.books = res['books'];
      },
      error => {
        this.message = 'This id : ' + this.id + ' No user Failed.';
    });
  }

  LoadStudentUpdateForm(res){
    this.updated = true;
    this.StudentUpdateForm = this.formBuilder.group({
      'fullname':     [res.fullname, [Validators.required]],
      'tcNo':         [res.tcNo, [Validators.min(10000000000), Validators.max(100000000000), Validators.required]],
      'email':        [res.email, [Validators.required,Validators.email]],
      'phone':        [res.phone, [Validators.required]],
      'address':      [res.address, [Validators.required]],
      'city':         [res.city, [Validators.required]],
      'university':   [res.university, [Validators.required]],
      'department':   [res.department, [Validators.required]],
    });
  }

  updateStudent(){
    if (!this.StudentUpdateForm.valid) {
      return;
    }
    this.studentService.put(this.id, this.StudentUpdateForm.value).subscribe(
      res =>{
        this.loadStudentDetails();
        if(this.id == res['id']){
          this.alert.success(' Successfully Registered.');
          this.message = ' Registrations has been done successfully.';
          this.updated = false;
        }
      },
      error =>{
        this.alert.error(' Registration failed');
        this.message = ' Unable to register';
      });
  }
  getAllCities(){
    this.studentService.getAllCities().subscribe(res => {
      this.cities = res;
    });
  }

  leaveBook(bookId){
    this.leaveBookForm = this.formBuilder.group({
      'bookId': [bookId, [Validators.required]],
      'studentId': [this.id, [Validators.required]]
    });
    this.studentService.leaveBook(this.leaveBookForm.value).subscribe(
      res => {
        this.loadStudentDetails();
        this.LoadStudentUpdateForm(this.student);
        this.alert.success( ' Deleted successfully. ');
        this.message = ' Deleted successfully. ';
      }
      , error => {
        this.alert.error(' Failed to delete. : ' + error);
        this.message = ' Failed to delete. : ' + error;
      }
    );
  }
  get suf() { return this.StudentUpdateForm.controls; }
  backClicked() {
    this.location.back();
  }
}
