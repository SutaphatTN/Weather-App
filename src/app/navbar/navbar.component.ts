import { Component } from '@angular/core';
import { faRainbow } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faRainbow:any = faRainbow;

  constructor(public weatherService: WeatherService) {}

  engLanguageClick() {
    this.weatherService.eng = true;
    this.weatherService.thai = false;
  }

  thaiLanguageClick() {
    this.weatherService.thai = true;
    this.weatherService.eng = false;
  }

}
