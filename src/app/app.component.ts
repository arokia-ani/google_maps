
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) { }
  zoom: number = 15;
  latitude: number=0; // Latitude for Tamil Nadu
  longitude: number = 0; // Longitude for Tamil Nadu
  lastInfoWindow: any;
  public searchControl!: FormControl;
  address: any;
  web_site: any;
  name: any;
  zip_code: any;

  @ViewChild('search', { static: true })
  public searchElementRef!: ElementRef;
//  Alo 8.191696574280853, 77.39770121126837
  ngOnInit(){
    this.setCurrentLocation();
        //create search FormControl
        this.searchControl = new FormControl();
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
              this.address = place.formatted_address || '';
              this.web_site = place.website || '';
              this.name = place.name || '';
    
              if (place.address_components && place.address_components.length > 0) {
                this.zip_code = place.address_components[place.address_components.length - 1].long_name || '';
              } else {
                this.zip_code = '';
              }
    
              if (place.geometry && place.geometry.location) {
                this.latitude = place.geometry.location.lat ? place.geometry.location.lat() : 0;
                this.longitude = place.geometry.location.lng ? place.geometry.location.lng() : 0;
                console.log(this.latitude,this.longitude,"lonsearch")
              } 
              this.zoom = 18;
            });
          });
        });

        
      }
  
  
      private setCurrentLocation() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.log('Latitude:', this.latitude);
            console.log('Longitude:', this.longitude);
      
            // Reverse Geocoding to get address
            this.mapsAPILoader.load().then(() => {
              const geocoder = new google.maps.Geocoder();
              const latlng = {
                lat: this.latitude,
                lng: this.longitude
              };
      
              geocoder.geocode({ 'location': latlng }, (results, status) => {
                if (status === 'OK') {
                  if (results[0]) {
                    this.address = results[0].formatted_address;
                    console.log('Address:', this.address);
                    // Optionally, you can set this.address to a variable to display in your template
                  } else {
                    console.log('No results found');
                  }
                } else {
                  console.log('Geocoder failed due to: ' + status);
                }
              });
            });
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      }
      
  
  markerClicked(marker: any, index: number, infoWindowRef: any) {
    if (this.lastInfoWindow) {
      this.lastInfoWindow.close();
    }
    this.lastInfoWindow = infoWindowRef;
    console.log(this.lastInfoWindow,"marked");
  }

  marker: Marker = {
    lat: 0,
    lng: 0,
    draggable: true
  };

  mapClicked($event: any) {
    console.log($event)
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;

    console.log(this.latitude,this.longitude,"clicked")
  }

  markerDragEnd($event: any) {
    this.latitude  = $event.coords.lat;
    this.longitude = $event.coords.lng;
  }
}

interface Marker {
  lat: number;
  lng: number;
  draggable: boolean;
}
