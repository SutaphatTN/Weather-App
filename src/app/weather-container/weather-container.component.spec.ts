import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherContainerComponent } from './weather-container.component';

describe('WeatherContainerComponent', () => {
  let component: WeatherContainerComponent;
  let fixture: ComponentFixture<WeatherContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherContainerComponent]
    });
    fixture = TestBed.createComponent(WeatherContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
