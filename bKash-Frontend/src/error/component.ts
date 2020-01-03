import { Component, OnInit, AfterViewInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-error',
    templateUrl: './app/error/component.html'
})

export class ErrorComponent implements OnInit, AfterViewInit {
    private subscription: Subscription;
    constructor(
        private router: Router,
        private titleService: Title) {
    }

    ngOnInit() {
        this.titleService.setTitle("Error");
    }

    ngAfterViewInit() {}
}
