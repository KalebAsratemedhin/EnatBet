export interface MenuItem {
    name: string;
    description: string;
    price: number;
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

  export interface Menu {
    _id: string;
    menuName: string;
    restaurant: string;
    menuItems: MenuItem[];
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
  