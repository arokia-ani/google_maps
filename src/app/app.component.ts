
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
  latitude: number = 0;
  longitude:number=0;
  lastInfoWindow: any;
  public searchControl!: FormControl;

  @ViewChild('search', { static: true })
  public searchElementRef!: ElementRef;
//  Alo 8.191696574280853, 77.39770121126837
  ngOnInit(){
    this.setCurrentLocation();
        //create search FormControl
        this.searchControl = new FormControl();

        //set current position
        
        // this.recenterMap()
    
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          });
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
    
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 15;
            });
          });
        });
  }

    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log(this.latitude,this.longitude,"lat-lon");
          
        });
      }
    }
  
    

  markers: any[] = [
    {
      lat: 8.191696574280853,
      lng: 77.39770121126837,
      label: { color: 'white', text: 'P1' },
    },
    {
      lat: 28.625293,
      lng: 79.817926,
      label: { color: 'white', text: 'P2' },
      draggable: false
    },
    {
      lat: 28.625182,
      lng: 79.814640,
      label: { color: 'white', text: 'P3' },
      draggable: true
    }
  ]

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
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;

    console.log(this.marker.lat,this.marker.lng,"clicked")
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
