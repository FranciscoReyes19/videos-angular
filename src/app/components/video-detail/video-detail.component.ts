import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';
import { User } from '../../models/user';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css'],
  providers: [UserService, VideoService]
})
export class VideoDetailComponent implements OnInit {

    //public page_title:string;
	public identity;
	public token;
	public video: Video;
	public status:string;
	public message:string;

  constructor(
  	private _route: ActivatedRoute,
  	private _router: Router,
  	private _userService: UserService,
  	private _videoService: VideoService,
    private _sanitizer: DomSanitizer
  	) {

  //this.page_title = "Editar video favorito";
  this.identity = this._userService.getIdentity();
  this.token = this._userService.gettoken();
  }
  ngOnInit(): void {
	this.getVideo();  		
  }

  getVideo(){
  	this._route.params.subscribe(params => {
  		var id = +params['id'];
  		this._videoService.getVideo(this.token,id).subscribe(
  			response => {
  				if (response.status == 'success') {
  					this.video = response.video;
  				}
  				else{
  					this._router.navigate(['/inicio']);
  				}
  			},
  			error => {
  				console.log(error);
  				this.status = 'error';
  			}
  			);
  	});
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
  }

}
