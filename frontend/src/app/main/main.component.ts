import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ApiService } from '../api.service';
import { Movie } from '../models/Movie';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  movies: Movie[] = [];
  selectedMovie = null;
  editedMovie = null;

  ngOnInit(): void {
    const token = this.cookieService.get('movies-rater-token');
    if (!token) { this.router.navigate(['/auth']); }
    else {
      this.apiService.getMovies().subscribe(
        (data: Movie[]) => { this.movies = data; },
        error => console.log(error)
      );
    }
  }

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  logout() {
    this.cookieService.delete('movies-rater-token');
    this.router.navigate(['/auth']);
  }

  selectMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.editedMovie = null;
  }

  editMovie(movie: Movie) {
    this.editedMovie = movie;
    this.selectedMovie = null;
  }

  createNewMovie() {
    this.editedMovie = {title: '', description: '', };
    this.selectedMovie = null;
  }

  deletedMovie(movie: Movie) {
    this.apiService.deleteMovie(movie.id).subscribe(
      data => {
        this.movies = this.movies.filter(obj => obj.id !== movie.id);
      },
      error => console.log(error)
    );
  }

  movieCreated(movie: Movie) {
    this.movies.push(movie);
    this.editedMovie = null;
  }

  movieUpdated(movie: Movie) {
    this.movies = this.movies.map(elm => elm.id === movie.id ? movie : elm);
    this.editedMovie = null;
  }

}
