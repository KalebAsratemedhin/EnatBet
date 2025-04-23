import { useGetMenusByRestaurantQuery } from "@/api/menuApi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const MenusCarousel = ({restaurantId}: { restaurantId: string}) => {
    const { data, isLoading: isLoadingMenus, isError: isMenusError,} = useGetMenusByRestaurantQuery(restaurantId);
  return (
    <div>
        {data && data.menus.length > 0 && (
            <div className="space-y-6">
              {data.menus.map((menu, _) => (
                <div key={menu._id} className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">{menu.menuName}</h3>
                  <Carousel 
                  opts={{
                    loop: true,
                    align: 'center',
                    }}
                  className="w-full">
                    <CarouselPrevious className="" />
                    <CarouselContent>
                      {menu.menuItems.map((item, index) => (
                        <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 p-2">
                          <Card className="h-full rounded-xl overflow-hidden shadow pt-0">
                            {item.itemPicture && (
                              <img
                                src={item.itemPicture}
                                alt={item.name}
                                className="w-full h-40 object-cover "
                              />
                            )}
                            <CardContent className="p-4 space-y-1">
                              <h4 className="text-base font-semibold truncate">{item.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{item.description}</p>
                              <p className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>

                              <Button className="mt-2" variant="default">Add to order</Button>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselNext className="" />
                  </Carousel>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export default MenusCarousel