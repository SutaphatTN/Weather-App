import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Chart } from 'chart.js/auto';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = 'a35d4d1ae3e22a8c319524cfcfd8f388';

  currentTime = new Date();

  //language
  eng: boolean = true;
  thai: boolean = false;

  //metric
  celsius: boolean = true;
  fahrenheit: boolean = false;

  //condition location and city and search
  isSearching: boolean = false;
  isSearchingSearch: boolean = false;

  //condition show location
  timeline: any[] = [];
  InfoLocation: any;
  weatherNow: any;

  //condition show city
  cityLine: any[] = [];
  InfoCity: any;
  weatherDate: any = [];

  //search city
  searchResults: any[] = [];
  selectedCity: string = '';

  //search city icon
  citySearch!: string;
  weatherSearch: any = [];

  //chart location
  locationChart: any;
  chartTemp: any = [];
  chartFeel: any = [];
  chartDate: any = [];
  chartTempFa: any = [];
  chartFeelFa: any = [];

  //chart city
  cityChart: any;
  chartCityTemp: any = [];
  chartCityFeel: any = [];
  chartCityDate: any = [];
  chartCityTempFa: any = [];
  chartCityFeelFa: any = [];

  //icon background
  iconLocation: any = [];
  iconCity: any = [];

  constructor(private http: HttpClient, private translocoService: TranslocoService) { }

  getWeatherLocation() {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position)
        },
        (error) => {
          observer.next(error)
        }
      )
    }).pipe(
      map((value: any) => {
        return new HttpParams()
          .set('lon', value.coords.longitude)
          .set('lat', value.coords.latitude)
          .set('units', 'metric')
          .set('appid', this.apiKey)
      }),
      switchMap((values) => {
        return this.http.get('https://api.openweathermap.org/data/2.5/forecast', { params: values })
      })
    )
  }

  getWeatherCity(city: string): Observable<any> {
    if (city && city.trim() !== '') {
      return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`);
    } else {
      return of(null);
    }
  }

  searchCity(query: string): Observable<any> {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getEnterCity(citySearch: string): Observable<any> {
    if (citySearch && citySearch.trim() !== '') {
      return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&units=metric&appid=${this.apiKey}`);
    } else {
      return of(null);
    }
  }

  celsiusToFah(celsius: number): number {
    return (celsius * 1.8) + 32;
  }

  fahrenheitToCel(fahrenheit: number): number {
    return (fahrenheit - 32) * 0.555;
  }

  dateRange() {
    const start = new Date();
    start.setHours(start.getHours() + (start.getTimezoneOffset() / 60));
    const to = new Date(start);
    to.setHours(to.getHours() + 2, to.getMinutes() + 59, to.getSeconds() + 59);
    return { start, to }
  }

  //location
  getWeatherLocationNow() {
    this.setSearching(false);
    this.setSearchingForSearch(false);
    this.timeline = [];

    this.getWeatherLocation().subscribe(data => {
      this.getTodayForecast(data);
      this.LocationChart();
      
    })
  }

  getTodayForecast(today: any) {
    this.timeline = [];
    this.InfoLocation = today.city;

    for (const forecast of today.list.slice(0, 8)) {
      this.timeline.push({
        time: forecast.dt_txt,
        temp: forecast.main.temp,
        icon: forecast.weather[0].icon
      });

      const apiDate = new Date(forecast.dt_txt).getTime();

      if (this.dateRange().start.getTime() <= apiDate && this.dateRange().to.getTime() >= apiDate) {
        this.weatherNow = forecast;
        this.iconLocation = forecast.weather[0].icon;
        
      }
    }
    
      const selectedDateData = today.list.filter((item: any) => {
        return item.dt_txt.includes('00:00:00');
      });

      this.chartTemp = selectedDateData.map((item: any) => item.main.temp);
      this.chartFeel = selectedDateData.map((item: any) => item.main.feels_like);

      const selectedDates = selectedDateData.map((item: any) => {
        const dateTimeParts = item.dt_txt.split(' ');
        const dateParts = dateTimeParts[0].split('-');
        return dateParts[2];
      });

      this.chartDate = selectedDates;
      this.chartTempFa = this.chartTemp.map((temp:any) => this.celsiusToFah(temp));
      this.chartFeelFa = this.chartFeel.map((feel:any) => this.celsiusToFah(feel));

      this.getBackgroundImage();
    
  }

  LocationChart() {
    if (this.locationChart) {
      this.locationChart.destroy();
    }

    const chartTempLabel = this.translocoService.translate('chartTemp');
    const chartFeelLabel = this.translocoService.translate('chartFeel');

    if(this.celsius) {
      this.locationChart = new Chart("LocationChart", {
        type: 'line',
        data: {
          labels: this.chartDate,
          datasets: [
            {
              label: chartTempLabel,
              data: this.chartTemp,
              borderWidth: 2,
              borderColor: 'rgba(32, 128, 161, 1)'
            },
            {
              label: chartFeelLabel ,
              data: this.chartFeel,
              borderWidth: 2,
              borderColor: 'rgba(74, 174, 255, 1)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      this.locationChart = new Chart("LocationChart", {
        type: 'line',
        data: {
          labels: this.chartDate,
          datasets: [
            {
              label: chartTempLabel,
              data: this.chartTempFa,
              borderWidth: 2,
              borderColor: 'rgba(32, 128, 161, 1)'
            },
            {
              label: chartFeelLabel,
              data: this.chartFeelFa,
              borderWidth: 2,
              borderColor: 'rgba(74, 174, 255, 1)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  //city
  getWeatherSearch(city: string) {
    this.setSearching(true);
    this.setSearchingForSearch(true);
    this.cityLine = [];
    this.selectedCity = city;
    this.searchResults = [];
    
    this.closeSearchResults();
    if (city && city.trim() !== '') {
      this.getWeatherCity(city).subscribe((data: any) => {
        this.futureForecast(data);
        this.CityChart();
      }, error => {
        console.log('Error occurred while fetching weather data:', error);
        alert('No weather data found for the entered city. Please try again with a different city name.');
        this.getWeatherLocationNow();
      })
    } else {
        console.log('Please enter a valid city name.');
        alert('Please enter a valid city name.');
        this.getWeatherLocationNow();
    }
  }

  futureForecast(city: any) {
    this.cityLine = [];
    this.InfoCity = city.city;

    for (const forecast of city.list.slice(0, 8)) {
      this.cityLine.push({
        time: forecast.dt_txt,
        temp: forecast.main.temp,
        icon: forecast.weather[0].icon
      });

      const apiDate = new Date(forecast.dt_txt).getTime();

      if (this.dateRange().start.getTime() <= apiDate && this.dateRange().to.getTime() >= apiDate) {
        this.weatherDate = forecast;
        this.iconCity = forecast.weather[0].icon;
      }
    }

    const selectedDateData = city.list.filter((item: any) => {
      return item.dt_txt.includes('00:00:00');
    });

    this.chartCityTemp = selectedDateData.map((item: any) => item.main.temp);
    this.chartCityFeel = selectedDateData.map((item: any) => item.main.feels_like);

    const selectedDates = selectedDateData.map((item: any) => {
      const dateTimeParts = item.dt_txt.split(' ');
      const dateParts = dateTimeParts[0].split('-');
      return dateParts[2];
    });

    this.chartCityDate = selectedDates;
    this.chartCityTempFa = this.chartCityTemp.map((temp:any) => this.celsiusToFah(temp));
    this.chartCityFeelFa = this.chartCityFeel.map((feel:any) => this.celsiusToFah(feel));

    this.getBackgroundImage();

  }

  CityChart() {
    if (this.cityChart) {
      this.cityChart.destroy();
    }
  
    const chartTempLabel = this.translocoService.translate('chartTemp');
    const chartFeelLabel = this.translocoService.translate('chartFeel');

    if(this.celsius) {
      this.cityChart = new Chart("CityChart", {
        type: 'line',
        data: {
          labels: this.chartCityDate,
          datasets: [
            {
              label: chartTempLabel,
              data: this.chartCityTemp,
              borderWidth: 2,
              borderColor: 'rgba(32, 128, 161, 1)'
            },
            {
              label: chartFeelLabel,
              data: this.chartCityFeel,
              borderWidth: 2,
              borderColor: 'rgba(74, 174, 255, 1)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      this.cityChart = new Chart("CityChart", {
        type: 'line',
        data: {
          labels: this.chartCityDate,
          datasets: [
            {
              label: chartTempLabel,
              data: this.chartCityTempFa,
              borderWidth: 2,
              borderColor: 'rgba(32, 128, 161, 1)'
            },
            {
              label: chartFeelLabel,
              data: this.chartCityFeelFa,
              borderWidth: 2,
              borderColor: 'rgba(74, 174, 255, 1)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  convertTimes(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours} : ${minutes}`;
  }

  convertKM(visibility: number): number {
    return visibility / 1000;
  }

  setSearching(isSearching: boolean) {
    this.isSearching = isSearching;
  }

  setSearchingForSearch(isSearchingSearch: boolean) {
    this.isSearchingSearch = isSearchingSearch;
  }

  searchCityWeather(query: string) {
    this.searchCity(query).subscribe((data: any[]) => {
      this.searchResults = data;
    });
  }

  closeSearchResults() {
    this.searchResults = [];
  }

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  getBackgroundImage() {
    if (this.iconLocation === '01d' || this.iconCity === '01d') {
      return 'url(./../../assets/sky/clear-sky.jpg)';
    } else if (this.iconLocation === '01n' || this.iconCity === '01n') {
      return 'url(./../../assets/sky/clear-sky-night.jpg)';
    } else if (this.iconLocation === '02d' || this.iconCity === '02d') {
      return 'url(./../../assets/sky/few-clouds.jpg)';
    } else if (this.iconLocation === '02n' || this.iconCity === '02n') {
      return 'url(./../../assets/sky/few-clouds-night.jpg)';
    } else if (this.iconLocation === '03d' || this.iconCity === '03d') {
      return 'url(./../../assets/sky/scattered-clouds.jpg)';
    } else if (this.iconLocation === '03n' || this.iconCity === '03n') {
      return 'url(./../../assets/sky/scattered-clouds-night.jpg)';
    } else if (this.iconLocation === '04d' || this.iconCity === '04d') {
      return 'url(./../../assets/sky/broken-clouds.jpg)';
    } else if (this.iconLocation === '04n' || this.iconCity === '04n') {
      return 'url(./../../assets/sky/broken-clouds-night.jpg)';
    } else if (this.iconLocation === '09d' || this.iconCity === '09d') {
      return 'url(./../../assets/sky/shower-rain.jpg)';
    } else if (this.iconLocation === '09n' || this.iconCity === '09n') {
      return 'url(./../../assets/sky/shower-rain-night.jpg)';
    } else if (this.iconLocation === '10d' || this.iconCity === '10d') {
      return 'url(./../../assets/sky/rain.jpg)';
    } else if (this.iconLocation === '10n' || this.iconCity === '10n') {
      return 'url(./../../assets/sky/rain-night.jpg)';
    } else if (this.iconLocation === '11d' || this.iconCity === '11d') {
      return 'url(./../../assets/sky/thunderstorm.jpg)';
    } else if (this.iconLocation === '11n' || this.iconCity === '11n') {
      return 'url(./../../assets/sky/thunderstorm-night.png)';
    } else if (this.iconLocation === '13d' || this.iconCity === '13d') {
      return 'url(./../../assets/sky/snow.jpg)';
    } else if (this.iconLocation === '13n' || this.iconCity === '13n') {
      return 'url(./../../assets/sky/snow-night.png)';
    } else if (this.iconLocation === '50d' || this.iconCity === '50d') {
      return 'url(./../../assets/sky/mist.jpg)';
    } else if (this.iconLocation === '50n' || this.iconCity === '50n') {
      return 'url(./../../assets/sky/mist-night.jpg)';
    } else {
        return 'url(./../../assets/sky/none.jpg)';
    }
  }

}