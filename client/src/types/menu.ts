import { Restaurant } from "./restaurant";

export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    rating: number;
    itemPicture?: string; 
  }
  
  export interface CreateMenuRequest {
    menuName: string;
    restaurant: string;
    menuItems: Omit<MenuItem, 'itemPicture'>[]; 
    itemPictures?: File[];
  }
  
  export interface UpdateMenuRequest extends CreateMenuRequest {
    id: string;
  }

  export interface BaseMenu {
    _id: string;
    menuName: string;
    menuItems: MenuItem[];
  }
  
  export interface PopulatedMenuItem extends MenuItem {
    restaurant: Restaurant;
  }
  export interface Menu extends BaseMenu {
    restaurant: string;
  }
  
  export interface MenuResponse {
    menus: Menu[];
  }
  
  export interface GetMenuResponse {
    data: MenuResponse;
  }
  
  export interface GenericResponse {
    message: string;
    data?: any;
  }
