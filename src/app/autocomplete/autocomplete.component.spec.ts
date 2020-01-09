import { Location } from './../models/location';
import { LocationResponse } from './../models/locationResponse';
import { LocationsApiService } from './../services/locations-api.service';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { AutocompleteComponent } from './autocomplete.component';
import { ClickOutsideModule } from 'ng-click-outside';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;  
  let inputEl: HTMLInputElement;
  let submitButton: HTMLButtonElement; 
  let langErrorDiv: HTMLElement;    

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ClickOutsideModule ],
      declarations: [ AutocompleteComponent ],
      providers: [
        { provide: LocationsApiService, useClass: MockLocationsApiService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;    
    
    fixture.detectChanges();    
  });

  it('Component should be created', () => {
    expect(component).toBeTruthy();
  });


  it("User input element's value should be binded with locationName field value" , (done) => {

    fixture.whenStable().then(() => {  
      // Simulate user input
      inputEl.value = 'test';

      // Dispatch a DOM event so that Angular learns of input value change.
      inputEl.dispatchEvent(new Event('input'));
      // Tell Angular to update the display binding
      fixture.detectChanges();      
      
      // Assert that the binded field in the TS class is updated
      expect(component.locationName).toBe('test');      

      done();
    });
  }); 

  it('Calling onInputChange method should invoke subject.next', () => {    
    // Arrange
    const nextSpy = spyOn(component.userInpuSubject$, 'next');    
    
    // Act
    component.onInputChange();

    // Assert
    expect(nextSpy).toHaveBeenCalled();   
  });
  

  it('Calling userInpuSubject$.next should invoke doLangSelect method', fakeAsync(() => {    
    // Arrange s
    const doLangSelectSpy = spyOn(component, 'doLangSelect'); 
    
    // Act
    component.userInpuSubject$.next('ab');
    tick(3000);

    // Assert
    expect(doLangSelectSpy).toHaveBeenCalled();
  }));  

  it("Calling userInpuSubject$.next should populate locationArr array with response data retrieved from a successful rest api call and set autocompleteOptionsShow value to true ", fakeAsync(() => {   
    // Arange
    let testLocation: Location = {name: 'test', language: 'test', country: 'test'};
    component.autocompleteOptionsShow = false;
    
    // Act        
    component.userInpuSubject$.next('test');
    tick(3000);
    
    // Assert
    expect(component.locationArr.length).toBe(1);    
    expect(component.locationArr[0]).toEqual(testLocation);
    expect(component.autocompleteOptionsShow).toBeTruthy();
  }));
  

  it("onClickOption method should be invoked by clicking on an autocomplete option after user has given valid input", () => {   
    // Arrange
    const onClickOptionSpy = spyOn(component, 'onClickOption');    
    component.locationArr = [{name: 'test', language: 'test', country : 'test'}];  
    component.autocompleteOptionsShow = true;  
    fixture.detectChanges();
    const autocompleteOption: HTMLButtonElement = fixture.debugElement.query(By.css('#autocompleteOptions')).nativeElement;

    // Act
    autocompleteOption.click();    

    // Assert
    expect(onClickOptionSpy).toHaveBeenCalled();
  });


  it("Invoking onClickOption method should set 'locationName' field's value, autocompleteOptionsShow value to false, submitButtonEnabled value to true", () => {   
    // Arrange   
    const selectedLocationName = 'test';
    component.autocompleteOptionsShow = true;
    component.submitButtonEnabled = false;

    // Act
    component.onClickOption(selectedLocationName);

    // Assert
    expect(component.locationName).toBe('test');
    expect(component.autocompleteOptionsShow).toBeFalsy();
    expect(component.submitButtonEnabled).toBeTruthy();
  });

  it('ngOnInit() should invoke setAutocompleteOptionLimitsByScreenWidth method and create the observable subscriptions', () => {
    // Arrange 
    const setAutocompleteOptionLimitsByScreenWidthSpy = spyOn(component, 'setAutocompleteOptionLimitsByScreenWidth');
    
    // Act
    component.ngOnInit();

    // Assert
    expect(setAutocompleteOptionLimitsByScreenWidthSpy).toHaveBeenCalled();   
  });

  it('Browser window resizing should invoke setAutocompleteOptionLimitsByScreenWidth method', () => {
    // Arrange 
    const setAutocompleteOptionLimitsByScreenWidthSpy = spyOn(component, 'setAutocompleteOptionLimitsByScreenWidth');

    // Act
    window.dispatchEvent(new Event('resize'));    

    // Assert
    expect(setAutocompleteOptionLimitsByScreenWidthSpy).toHaveBeenCalled();   
  });


  it('Calling setAutocompleteOptionLimitsByScreenWidth should set autocompleteOptionLimit value to 10 for small and medium screen sizes (< 992px)', () => { 
    // Arrange       
    const screenWidth = 991;    

    // Act
    component.setAutocompleteOptionLimitsByScreenWidth(screenWidth);

    // Assert
    expect(component.autocompleteOptionLimit).toBe(10);
  });

  
  it('Calling setAutocompleteOptionLimitsByScreenWidth should set autocompleteOptionLimit value to 20 for large screen sizes (>= 992px)', () => {   
    // Arrange   
    const screenWidth = 992;

    // Act
    component.setAutocompleteOptionLimitsByScreenWidth(screenWidth);

    // Assert
    expect(component.autocompleteOptionLimit).toBe(20);
  });


  it('Calling setAutocompleteOptionLimitsByScreenWidth method with argument should change screenWidth field value', () => {
    // Arrange 
    component.screenWidth = 1;

    // Act
    component.setAutocompleteOptionLimitsByScreenWidth(2);   

    // Assert
    expect(component.screenWidth).toBe(2);
  });


  it('Invoking doLangSelect method with argument "el" should change the value of preferredBrowserLanguage accordingly', () => {
    // Arrange
    component.preferredBrowserLanguage = 'test';    

    // Act
    component.doLangSelect('en');

    // Assert
    expect(component.preferredBrowserLanguage).toBe('en');   
    expect(component.langError).toBeNull();  
  });

  
  it('Invoking doLangSelect method with argument "el" should change the value of preferredBrowserLanguage accordingly', () => {
    // Arrange
    component.preferredBrowserLanguage = 'test';    

    // Act
    component.doLangSelect('el');

    // Assert
    expect(component.preferredBrowserLanguage).toBe('el');   
    expect(component.langError).toBeNull();  
  });


  it('Invoking doLangSelect method with argument value other than "en" or "el"  should populate languageError field', () => {
    // Arrange 
    let lang = 'fr';

    // Act
    component.doLangSelect(lang);

    // Assert
    expect(component.langError).not.toBeNull();
  }); 


  it('Should unsubscribe from searchResultSubscription when ngOnDestroy method is invoked', () => {
    // Arrange
    const subscriptionSpy = spyOn(component.userInputSubjectSubscription, 'unsubscribe');
    
    // Act
    component.ngOnDestroy();

    // Assert
    expect(subscriptionSpy).toHaveBeenCalled();
  });


  it('Should unsubscribe from resizeSubscription when ngOnDestroy method is invoked', () => {
    // Arrange 
    const subscriptionSpy = spyOn(component.resizeSubscription, 'unsubscribe');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(subscriptionSpy).toHaveBeenCalled();
  });


  it('Submit button should be disabled when submitButtonEnable value is false', () => {
    // Arrange     
    submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;    
    component.submitButtonEnabled = false;    

    // Act
    fixture.detectChanges();

    // Assert
    expect(submitButton.disabled).toBeTruthy();
  });
  
  it('Submit button should be disabled when submitButtonEnable value is true', () => {
    // Arrange     
    submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;    
    component.submitButtonEnabled = true;    

    // Act
    fixture.detectChanges();

    // Assert
    expect(submitButton.disabled).toBeFalsy();
  });   


  it('onClickSearch() should be invoked when user clicks on submit button', () => {
    // Arrange     
    submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;   
    const onClickSearchSpy = spyOn(component, 'onClickSearch');  
    component.submitButtonEnabled = true;
    fixture.detectChanges();

    // Act
    submitButton.click();

    // Assert
    expect(onClickSearchSpy).toHaveBeenCalled();
  });

  it('onClickOutsideOfForm() should set autocompleteOptionsShow field to false', () => {
    // Arrange     
    component.autocompleteOptionsShow = true;
   
    // Act
    component.onClickOutsideOfForm();
    // Assert
    expect(component.autocompleteOptionsShow).toBeFalsy();
  });

  it('onInputFocus() should set autocompleteOptionsShow field to true', () => {
    // Arrange     
    component.autocompleteOptionsShow = false;
   
    // Act
    component.onInputFocus();

    // Assert
    expect(component.autocompleteOptionsShow).toBeTruthy();
  });

  it('Div displaying langError should be defined if langError field has a string value', () => {
    // Arrange     
    component.langError = 'language error';
    
    // Act
    fixture.detectChanges();
    langErrorDiv = fixture.debugElement.query(By.css('#langError')).nativeElement;

    // Assert
    expect(langErrorDiv).toBeDefined();
  });
  
});

// Create fake LocationsApiService class
class MockLocationsApiService {
  
  testLocation: Location = {name: 'test', language: 'test', country: 'test'};

  getLocationsByParameters(): Observable<LocationResponse>{
    return of({
      entries: [this.testLocation]
    });
  }
};


