class OrderService
  # Retrieves location details based on the provided name.
  #
  # Parameters:
  # - name: The name of the location to be geocoded.
  #
  # Returns:
  # - The response from the geocoding API.
  def get_location(name)
    api_key = ENV["GEBETA_API_KEY"]
    result = HTTParty.get("https://mapapi.gebeta.app/api/v1/route/geocoding?name=#{name}&apiKey=#{api_key}")
  end

  # Calculates the price for a delivery based on origin and destination.
  #
  # Parameters:
  # - origin: The starting point for the delivery.
  # - destination: The endpoint for the delivery.
  #
  # Returns:
  # - A hash containing the total price and directions for the delivery.
  def calculate_price(origin, destination)
    distance_meters, time_taken_seconds = get_distance_and_time(origin, destination)
    directions = get_directions(origin, destination)
    distance_km = distance_meters / 1000.0
    rate_per_km = 5.0
    time_rate = 0.05
    total_price = (distance_km * rate_per_km) + (time_taken_seconds * time_rate)
    { "total_price" => total_price, "directions" => directions }
  end

  # Retrieves the distance and time taken for a route between origin and destination.
  #
  # Parameters:
  # - origin: The starting point for the delivery.
  # - destination: The endpoint for the delivery.
  #
  # Returns:
  # - An array containing the total distance in meters and time taken in seconds.
  def get_distance_and_time(origin, destination)
    # Extract latitude and longitude from the origin and destination
    origin_lat, origin_lon = parse_location(origin)
    destination_lat, destination_lon = parse_location(destination)

    # Call the API to get distance and time
    api_key = ENV["GEBETA_API_KEY"]
    response = HTTParty.get("https://mapapi.gebeta.app/api/v1/route/driving/direction/?la1=#{origin_lat}&lo1=#{origin_lon}&la2=#{destination_lat}&lo2=#{destination_lon}&apiKey=#{api_key}")

    # Parse the response
    total_distance = response.parsed_response["totalDistance"]
    time_taken = response.parsed_response["timetaken"]
    [total_distance, time_taken]
  end

  # Retrieves driving directions between origin and destination.
  #
  # Parameters:
  # - origin: The starting point for the delivery.
  # - destination: The endpoint for the delivery.
  #
  # Returns:
  # - The directions for the route.
  def get_directions(origin, destination)
    # Extract latitude and longitude from the origin and destination
    origin_lat, origin_lon = parse_location(origin)
    destination_lat, destination_lon = parse_location(destination)

    # Call the API to get directions
    api_key = ENV["GEBETA_API_KEY"]
    response = HTTParty.get("https://mapapi.gebeta.app/api/v1/route/driving/direction/?la1=#{origin_lat}&lo1=#{origin_lon}&la2=#{destination_lat}&lo2=#{destination_lon}&apiKey=#{api_key}")

    directions = response.parsed_response["direction"]
    directions
  end

  # Accepts an order for a specific driver.
  #
  # Parameters:
  # - order_id: The ID of the order to be accepted.
  # - driver_id: The ID of the driver accepting the order.
  #
  # Returns:
  # - A message indicating the order has been accepted.
  def accept(order_id, driver_id)
    order = Order.find(order_id)
    raise(StandardError, "Order has already been accepted.") unless order.status == "pending"
    driver = User.find(driver_id)
    raise(StandardError, "Driver not found.") unless driver

    order.update!(status: "in_progress")
    { message: "Your Order with id #{order.id} has been accepted by our driver #{driver.first_name}" }
  end

  # Completes an order for a specific driver.
  #
  # Parameters:
  # - order_id: The ID of the order to be completed.
  # - driver_id: The ID of the driver completing the order.
  #
  # Returns:
  # - A message indicating the order has been completed.
  def complete(order_id, driver_id)
    order = Order.find(order_id)
    raise(StandardError, "Order has already been completed.") unless order.status == "in_progress"
    driver = User.find(driver_id)
    raise(StandardError, "Driver not found.") unless driver

    order.update!(status: "delivered", driver_id: driver.id)
    { message: "Order has been completed by #{driver.first_name}" }
  end

  # Retrieves all orders assigned to a specific driver.
  #
  # Parameters:
  # - driver_id: The ID of the driver whose orders are to be retrieved.
  #
  # Returns:
  # - An array of orders assigned to the specified driver.
  def get_orders_by_driver(driver_id)
    driver = User.find(driver_id)
    raise(StandardError, "Driver not found.") unless driver
    orders = Order.where(driver_id: driver.id)
    orders
  end

  # Retrieves all orders placed by a specific user.
  #
  # Parameters:
  # - user_id: The ID of the user whose orders are to be retrieved.
  #
  # Returns:
  # - An array of orders placed by the specified user.
  def get_orders_by_user(user_id)
    user = User.find(user_id)
    raise(StandardError, "User not found.") unless user
    orders = Order.where(user_id: user.id)
    orders
  end

  private

  # Parses a location string into latitude and longitude.
  #
  # Parameters:
  # - location: A string in the format "latitude,longitude".
  #
  # Returns:
  # - An array containing the latitude and longitude as strings.
  def parse_location(location)
    # Assuming location is a string in the format "latitude,longitude"
    lat, lon = location.split(",").map(&:strip)
    [lat, lon]
  end
end
