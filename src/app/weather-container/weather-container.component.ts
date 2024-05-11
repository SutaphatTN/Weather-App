import { Component } from '@angular/core';
import { faMagnifyingGlass, faLocation, faCloud, faCloudRain, faCalendarDays, faLocationArrow, faThumbsUp, faThumbsDown, faFaceSmile, faFaceFrown, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.css']
})
export class WeatherContainerComponent {
  //left
  selectedCity: string = '';

  //left icon
  faLocationDot: any = faLocationDot;
  faMagnifyingGlass: any = faMagnifyingGlass;
  faLocation: any = faLocation;
  faCloud: any = faCloud;
  faCloudRain: any = faCloudRain;
  faCalendarDays: any = faCalendarDays;
  faLocationArrow: any = faLocationArrow;

  //right
  faThumbsUp: any = faThumbsUp;
  faThumbsDown: any = faThumbsDown;
  faFaceSmile: any = faFaceSmile;
  faFaceFrown: any = faFaceFrown;

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherLocationNow();

    document.addEventListener('click', (event) => {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('.search-input')) {
        this.weatherService.closeSearchResults();
      }
    });

  }

  onFahrenheitClick() {
    this.weatherService.fahrenheit = true;
    this.weatherService.celsius = false;
    this.weatherService.LocationChart();
    this.updateCityChart();
  }

  onCelsiusClick() {
      this.weatherService.celsius = true;
      this.weatherService.fahrenheit = false;
      this.weatherService.LocationChart();
      this.updateCityChart();
  }

  updateCityChart() {
    if (this.weatherService.searchResults) {
        this.weatherService.CityChart();
    }
  }

}
