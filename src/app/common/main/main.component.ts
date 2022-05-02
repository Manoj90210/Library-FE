import { Component, OnInit } from '@angular/core';
import { User } from '../api/user-detail/User';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  currentUser = {}  as User;
  constructor() { }

  ngOnInit() { this.currentUser = JSON.parse(localStorage.getItem('currentUser')); }
}
