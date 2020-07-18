import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Movie } from '../../models/Movie';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css']
})
export class MovieFormComponent implements OnInit {

  movieForm;
  id = null;

  @Output() movieCreated = new EventEmitter<Movie>();
  @Output() movieUpdated = new EventEmitter<Movie>();

  @Input() set movie(val: Movie) {
    this.id = val.id;
    console.log(this.id);
    this.movieForm = new FormGroup({
      title: new FormControl(val.title),
      description: new FormControl(val.description),
    })
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  saveForm() {
    console.log(this.movieForm.value);
    const {title, description} = this.movieForm.value;

    if(this.id) {
      this.apiService.updateMovie(this.id, title, description).subscribe(
        (data: Movie) => this.movieUpdated.emit(data),
        error => console.log(error)
      );
    }
    else {
      this.apiService.createMovie(title, description).subscribe(
        (data: Movie) => this.movieCreated.emit(data),
        error => console.log(error)
      );
    }
  }

}
