import { useState } from "react";
import { useGetActiveRestaurantsQuery } from "@/api/restaurantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination";

const ActiveRestaurants = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [input, setInput] = useState(""); // controlled input field
  const [search, setSearch] = useState(""); // actual search term for API
  const [ratingFilter, setRatingFilter] = useState("all");

  const { data, isLoading, error, isFetching } = useGetActiveRestaurantsQuery({
    page,
    limit,
    search,
    rating: ratingFilter,
  },{
    refetchOnMountOrArgChange: true
  });

  const totalPages = data?.totalPages || 1;

  const handleSearchClick = () => {
    console.log(" input ", input);
    
    setSearch(input);
    setPage(1); 
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load active restaurants.</div>
    );
  }



  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 items-center w-full md:max-w-md">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button size="sm" onClick={handleSearchClick}>
            Search
          </Button>
        </div>

        <div className="flex gap-2 items-center w-1/2 md:max-w-xs">
          <Filter size={20} className="text-muted-foreground" />
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Ratings</option>
            <option value="5">5+</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
            <option value="1">1+</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data && data.data.length === 0 &&
          <div className="text-center    text-gray-500">No active restaurants found.</div>
        }
        {data?.data.map((restaurant) => (
          <Card key={restaurant._id} className="pt-0 overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="h-40 w-full object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p><strong>Address:</strong> {restaurant.location?.address}</p>
              <div className="flex items-center gap-1">
                <strong>Rating:</strong>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(restaurant.rating) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">({restaurant.rating.toFixed(1)})</span>
              </div>
              <Link to={`/restaurants/${restaurant._id}`}>
                <Button size="sm" className="w-full mt-3">View & Order</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
              </PaginationPrevious>
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4 py-2 border rounded-md">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext>
                <Button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ActiveRestaurants;
