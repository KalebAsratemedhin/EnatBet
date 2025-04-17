export interface Promotion {
    title: string;
    description: string;
    discount: number;
    validuntil: string;
  }
  
  export interface Location {
    type?: string;
    coordinates: number[];
    address: string;
  }
  
  export interface Restaurant {
    _id: string;
    name: string;
    location: Location;
    ownerId: string;
    deliveryAreas: Number;
    promotion: Promotion[];
  }
  
  export interface AddRestaurantRequest {
    name: string;
    location: Location;
    deliveryAreas: Number;
    promotion: Promotion[];
  }
  
  export interface UpdateRestaurantRequest extends Partial<AddRestaurantRequest> {
    id: string;
  }
  
  export interface GenericResponse {
    message: string;
  }
  
  export interface GetRestaurantsResponse {
    message: string;
    data: Restaurant[];
  }
  