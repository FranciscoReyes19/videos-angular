import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, VideoService]
})
export class HomeComponent implements OnInit {
	public page_title:string;
	public identity;
  public token;
  public videos;
  public page:number;
  public next_page:number;
  public prev_page:number;
  public number_pages;

  constructor(
    private _userService:UserService,
    private _videoService: VideoService,
    private _route: ActivatedRoute,
    private _router: Router
    ) {
        this.page_title = "Mis videos";

      }

  ngOnInit(){
    this.loadUser();
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe(params => {  
      var page = +params['page'];
      if (!page) {
        page = 1;
        this.prev_page = 1;
        this.next_page = 2;
      }
      this.getVideos(page);
    });
  }

  loadUser(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.gettoken();
  }
  getVideos(page_param){
    this._videoService.getVideos(this.token,page_param).subscribe(
      response => {
        this.videos = response.videos;

        var number_pages = [];
        for( var i = 1; i<= response.total_pages;i++){
          number_pages.push(i);
        }
        this.number_pages = number_pages;

        if (this.page >= 2) {
          this.prev_page = this.page-1;
        }else{
          this.prev_page = 1;
        }
        if (this.page < response.total_pages) {
          this.next_page = this.page+1;
        }else{
          this.next_page = response.total_pages;
        }
        /*
        items_per_page: 6
        message: "CORRECTO"
        page_current: 1
        status: "success"
        total_items_count: 10
        total_pages: 2
        */
    },
    error => {
        console.log(error);
    });
  }
  getThumb(url, size=null){
      
      let video, results, thumburl;
     
      if (url === null) {
          return '';
      }
      
      results = url.match('[\\?&]v=([^&#]*)');
      video   = (results === null) ? url : results[1];
     
      if(size != null) {
          thumburl = 'http://img.youtube.com/vi/' + video + '/'+ size +'.jpg';
      }else{
          thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
          //thumburl = 'assets/images/background-video.png';
      }
     
       return thumburl;
         
     }
     deleteVideo(id){
       this._videoService.delete(this.token,id).subscribe(
         response => {
           this.actualPage();
         },
         error => {
           console.log(error);
         });
     }

}
