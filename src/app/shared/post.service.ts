import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PostModel } from './post-model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {

   }
   getAllPosts(): Observable<Array<PostModel>> {
     console.log('Post Service is called');
    return this.http.get<Array<PostModel>>('http://localhost:9090/api/posts');
  }
}
