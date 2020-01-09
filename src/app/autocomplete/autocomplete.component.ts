import { NgForm } from '@angular/forms';
import { LocationsApiService } from './../services/locations-api.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, of, Observable, fromEvent } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Location } from './../models/location';
import { LocationResponse } from './../models/locationResponse';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  // Variable for saving the http response data
  locationArr: Location[] = [];

  userInputSubjectSubscription: Subscription;
  // A subject is both an observable and an observer
  userInpuSubject$: Subject<string> = new Subject();

  // Variable binded with user input value with two-way binding
  locationName: string = '';
  // Autocomplete option limits
  autocompleteOptionLimit: number;  
  limitForSmallAndMediumScreens: number = 10;
  limitForLargeScreens: number = 20;      
  preferredBrowserLanguage: string; 

  // Delay in getting user input in ms
  searchDebounceTime: number = 1000; 

  // Screen width
  screenWidth: number;  
  // Screen resize observable
  resizeObservable$: Observable<any>;
  resizeSubscription: Subscription; 

  // For displaying errors to the user
  langError: string;
  serviceError: string;

  // Flag for enabling/disabling submit button
  submitButtonEnabled: boolean = false;  
  // Flag for showing hiding the autocomplete options div element
  autocompleteOptionsShow: boolean = false;
  // Saves selected autocomplete option
  selectedLocationName: string;

  constructor(private locationsApiService: LocationsApiService) { }

  ngOnInit() {  
    // Create a subscription to the subject
    this.userInputSubjectSubscription = this.userInpuSubject$.pipe(
      // Waits for a specified number of miliseconds and executes the following lines of code only if there is NO new value emitted from the subject within the specified time
      debounceTime(this.searchDebounceTime))
      .pipe(
        switchMap(locationName => { 
          if (locationName.length > 1){            
            // Modifies the value of the language field or populates the langError field according to browser's most preferred language         
            this.doLangSelect(window.navigator.language.slice(0, 2)); 
            
            // Performs a get request to the server
            return this.locationsApiService.getLocationsByParameters(locationName, this.preferredBrowserLanguage, this.autocompleteOptionLimit)
          }
          else return of([]);
      }))
      .subscribe((responseData: LocationResponse) => {
        // Save response response data      
        this.locationArr = responseData.entries;        

        // Show autocomplete options div
        this.autocompleteOptionsShow = true;
      },
      error =>{
        // Handle request error
        this.serviceError = `Error: ${error.status} - ${error.statusText}`;
      });

      // Set initial autocomplete option limit according to screen width
      this.setAutocompleteOptionLimitsByScreenWidth();

      // Create observable from the window resize event
      this.resizeObservable$ = fromEvent(window, 'resize');

      // Subscribe to the resize observable
      this.resizeSubscription = this.resizeObservable$        
      .subscribe( evt => { 
        // Change autocomplete option limit on resize
        this.setAutocompleteOptionLimitsByScreenWidth(evt.target.innerWidth);                            
      },
        // Handle error
        error =>  console.log(error)
      )

  }

  // Called when the user input changes
  onInputChange(){ 
    // Hide autocomplete options div
    this.autocompleteOptionsShow = false;     

    // Trim whitespaces from the beginning of the string 
    const trimmedLocationName = this.locationName.trim();   
    
    // Disable submit button
    if (trimmedLocationName !== this.selectedLocationName) this.submitButtonEnabled = false;      
    
    // Emit value
    this.userInpuSubject$.next(trimmedLocationName);
  }

  // Called when the user clicks on an autocomplete option
  onClickOption(selectedLocationName){
    // Save selected option and display it on the user input field
    this.selectedLocationName = selectedLocationName;
    this.locationName = selectedLocationName; 

    // Hide autocomplete options div
    this.autocompleteOptionsShow = false;

    // Make selected location the only available option
    this.locationArr = [];
    this.locationArr.push({name: selectedLocationName});

    //Enalbe submit button
    this.submitButtonEnabled = true;
  } 
  
  // Sets autocomplete option limit according to screen width
  setAutocompleteOptionLimitsByScreenWidth(screenWidthFromResizeEvent?: number){    
     // If there is an argument passed in, it means there is a resize event raised
     this.screenWidth = screenWidthFromResizeEvent? screenWidthFromResizeEvent : window.innerWidth
     
     // Set autocomplete option limit, according to screen width
     this.autocompleteOptionLimit = (this.screenWidth >= 992)? this.limitForLargeScreens : this.limitForSmallAndMediumScreens; 
  }
  
  // Sets the preferredBrowserLanguage field or populates the langError field according to argument value
  doLangSelect(lang: string){    
    switch(lang){
      case 'el':        
        this.preferredBrowserLanguage = 'el';
        this.langError = null;  
        break;
      case 'en':       
        this.preferredBrowserLanguage = 'en';   
        this.langError = null;     
        break;
      default:
        this.langError = "Please set English or Greek as the browser's preferred language to use this feature."
    }       
  }

  // Called when user clicks on submit button
  onClickSearch(form: NgForm) {     
    // Redirect user to google
    window.location.href = `https://www.google.com/search?source=hp&ei=SI0PXrykMsG6kwXKlZlI&q=${form.value.locationName}&btnK=Google+Search`;

    // Clear form from input values
    form.resetForm();
  }
 
  // Called when the user clicks outside the form element
  onClickOutsideOfForm(){    
    this.autocompleteOptionsShow = false;
  }

  // Called when the input field is focused
  onInputFocus(){
    this.autocompleteOptionsShow = true;   
  }
 
  // Unsubscribe from the observarbles
  ngOnDestroy(){
    if ( this.userInputSubjectSubscription) this.userInputSubjectSubscription.unsubscribe();
    if ( this.resizeSubscription) this.resizeSubscription.unsubscribe();
  }

}
