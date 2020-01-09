import { ClickOutsideModule } from 'ng-click-outside';
import { AutocompleteComponent } from './../autocomplete/autocomplete.component';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { LocationsComponent } from './locations.component';
import { HttpClientModule } from '@angular/common/http';


describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;    

  beforeEach(async(() => {       
    TestBed.configureTestingModule({
      imports: [ 
        ClickOutsideModule,
         FormsModule,
         HttpClientModule 
      ],
      declarations: [ 
        LocationsComponent,
        AutocompleteComponent
      ]     
    })
    .compileComponents();    
  }));

  beforeEach(() => {    
    fixture = TestBed.createComponent(LocationsComponent);    
    component = fixture.componentInstance;    
    
    fixture.detectChanges();    
  });

  
  it('Component should be created', () => {
    expect(component).toBeTruthy();
  });
});

