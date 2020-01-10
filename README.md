# Location Search
(This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.)

A simple front-end application developed with Angular 8 and Bootstrap 4, where:
- Users can search for a specific location by typing the desired location's name in the input field.
- The app sends an http get request to a restful web service and and if the query is successful, the response data is displayed
on the client.
- There is an autocomplete feature on successful requests.
- Requests to the service are sent only if 1 second passes without user input being modified in order to minimize calls to the service.
- If a user clicks on one of the available autocomplete options and then clicks on "Click To Search" button, he is redirected to Google.com with a search query equal to the selected location's name

## Features 
Location Search is an Angular project which uses:
- [Bootstrap 4](https://getbootstrap.com/) (implemented with [NGX Bootstrap](https://github.com/valor-software/ngx-bootstrap/)).
- [RxJS](https://github.com/ReactiveX/rxjs)

## Running the Application Locally
```
git clone https://github.com/OrestisTanis/Location-Search.git
cd Location-Search/
npm install
ng serve
```

## Running tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
