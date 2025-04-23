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

  interface BaseRestaurant {
    _id: string;
    name: string;
    location: Location;
    deliveryAreaRadius: number;
    logo: string;
    status: string;
    rating: number;
  }
  
  export interface Restaurant extends BaseRestaurant {
    ownerId: string;
  }

  export interface PopulatedRestaurant extends BaseRestaurant{
    owner: User;
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
    data: PopulatedRestaurant[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }

  export interface GetRestaurantDetailsResponse{
    message: string;
    data: PopulatedRestaurant;
  }

  export interface User {
    _id: string;
    name: string;
    email: string;
    role: [string];
  }