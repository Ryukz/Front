import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.css']
})
export class StarterPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.unfade(document.getElementById('heading'));
  }

  // for that fade in effect
  unfade(element) {
    let op = 0.1;  // initial opacity
    element.style.display = 'block';
    // tslint:disable-next-line:prefer-const only-arrow-functions
    let timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ')';
        op += op * 0.1;
    }, 70);
}

  redirection() {
    this.router.navigate(['/signup']);
  }

}
