import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { Page } from 'src/app/shared/Page';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  message: string | undefined;
  rows = [];
  page = new Page();
  control = true;

  cities: Array<any> = [];
  StudentInsertForm: FormGroup;
  showModal = true;
  constructor(private route: ActivatedRoute,
              private alert: AlertifyService,
              private studentService: StudentService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadStaticPage();
  }
  loadStaticPage(){
    this.setPage({ offset: 0 });
    this.LoadStudentInsertForm();
  }
  setPage(pageInfo) {
    this.control = true;
    this.page.page = pageInfo.offset;
    this.studentService.getAllPageable(this.page).subscribe(pagedData => {
      this.page.size = pagedData.size;
      this.page.page = pagedData.page;
      this.page.totalElements = pagedData.totalElements;
      this.rows = pagedData.content;
    });
  }

  LoadStudentInsertForm(){
    this.getAllCities();
    this.showModal = true;
    this.StudentInsertForm = this.formBuilder.group({
      'fullname':     [null, [Validators.required]],
      'tcNo':         [null, [Validators.min(10000000000),Validators.max(100000000000),Validators.required]],
      'email':        [null, [Validators.required,Validators.email]],
      'phone':        [null, [Validators.required]],
      'address':      [null, [Validators.required]],
      'city':         [null, [Validators.required]],
      'university':   [null, [Validators.required]],
      'department':   [null, [Validators.required]],
    });
  }

  insertStudent(){
    if (!this.StudentInsertForm.valid) {
      return;
    }
    this.studentService.post(this.StudentInsertForm.value).subscribe(res=>{
      this.loadStaticPage();
      console.log("insert student");
      this.message = ' Registered.. ';
      this.showModal = false;
      this.alert.success(' Registered.. ');
      this.message = ' Save Successfully.';
    }, error => {
      this.alert.error(' Registration Failed.Error in Email address or Phone Number ' );
      this.message = ' Registration Failed.Error in Email address or Phone Number .' ;
    });
  }

  getAllCities(){
    this.studentService.getAllCities().subscribe(res => {
      this.cities = res;
    });
  }
  deleteStudent(id){
    console.log(id);
    this.studentService.delete(id).subscribe(res => {
      this.loadStaticPage();
      this.message = ' Book deleted. ';
      this.alert.warning(' Book deleted. ');
    }, error => {
      this.alert.error(' Unable to Delete Book. ' );
      this.message = ' Unable to Delete Book. ' ;
    });
  }
  get sif() { return this.StudentInsertForm.controls; }
}
