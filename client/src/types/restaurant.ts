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
    deliveryAreaRadius: number;
    logo: string;
    status: string
  }
  
  export interface AddRestaurantRequest {
    name: string;
    location: Location;
    deliveryAreas: Number;
    logo: string;
  }
  
  export interface UpdateRestaurantRequest {
    id: string;
    data: Partial<AddRestaurantRequest>;
  }
  
  export interface GenericResponse {
    message: string;
  }
  
  export interface GetRestaurantsResponse {
    message: string;
    allRestaurants: Restaurant[];
  }
  