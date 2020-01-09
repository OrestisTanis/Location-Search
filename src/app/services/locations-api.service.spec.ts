import { LocationResponse } from './../models/locationResponse';
import { TestBed } from '@angular/core/testing';
import { LocationsApiService } from './locations-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '../models/location';

describe('LocationsApiService', () => {
  let locationsApiService: LocationsApiService;

  beforeEach(() => {    

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, HttpClientModule ],
      providers: [ LocationsApiService ]      
    })

    locationsApiService = TestBed.get(LocationsApiService);
  });

  it('should be created', () => {    
    expect(locationsApiService).toBeTruthy();
  });

  it('should get results from the locationsAPI service', () => {
    // Arrange
    const testLocation: Location = { name: 'testName', language: 'testLanguage', country: 'testCountry' };
    const responseData: LocationResponse = {entries : [testLocation]};     
    const http = TestBed.get(HttpTestingController);    
    const keyword: string = 'test';
    const language: string = "test";
    const autocompleteOptionLimit: number = 1;
    let httpResponse;    

    // Act
    locationsApiService.getLocationsByParameters(keyword, language, autocompleteOptionLimit).subscribe((response) => {
      httpResponse = response; 
    });
    http.expectOne(`${locationsApiService.baseUrl}${locationsApiService.queryUrl}keywords=${keyword}&language=${language}&limit=${autocompleteOptionLimit}`).flush(responseData);

    // Assert
    expect(httpResponse).toBe(responseData);    
  });

});



