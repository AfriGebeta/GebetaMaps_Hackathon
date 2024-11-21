class OrdersController < ApplicationController
  before_action :set_order, only: %i[ show update destroy ]

  # GET /location/:name
  # Retrieves the location details based on the provided name.
  #
  # Returns:
  # - JSON response containing the location details.
  def location
    service = OrderService.new
    result = service.get_location(params[:name])
    render json: { payload: result }
  end

  # GET /get_price
  # Calculates the price based on the origin and destination provided.
  #
  # Parameters:
  # - origin: The starting point for the delivery.
  # - destination: The endpoint for the delivery.
  #
  # Returns:
  # - JSON response with the calculated price if both origin and destination are provided.
  # - JSON response with an error message if either origin or destination is missing.
  def get_price
    service = OrderService.new
    origin = params[:origin]
    destination = params[:destination]

    if origin.present? && destination.present?
      result = service.calculate_price(origin, destination)
      render json: { payload: result }
    else
      render json: { error: "Origin and destination must be provided." }, status: :unprocessable_entity
    end
  end

  # GET /orders
  # Retrieves a list of all orders.
  #
  # Returns:
  # - JSON response containing an array of all orders.
  def index
    @orders = Order.all
    render json: @orders
  end

  # GET /orders/1
  # Retrieves the details of a specific order by ID.
  #
  # Returns:
  # - JSON response containing the order details.
  def show
    render json: @order
  end

  # POST /orders
  # Creates a new order with the provided parameters.
  #
  # Returns:
  # - JSON response with the created order if successful.
  # - JSON response with error messages if the order could not be saved.
  def create
    @order = Order.new(order_params)

    if @order.save
      render json: @order, status: :created, location: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /orders/1
  # Updates an existing order with the provided parameters.
  #
  # Returns:
  # - JSON response with the updated order if successful.
  # - JSON response with error messages if the order could not be updated.
  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /orders/1
  # Deletes a specific order by ID.
  #
  # Returns:
  # - No content response if the order is successfully deleted.
  def destroy
    @order.destroy!
  end

  # POST /orders/:order_id/accept/:driver_id
  # Accepts an order for a specific driver.
  #
  # Parameters:
  # - order_id: The ID of the order to be accepted.
  # - driver_id: The ID of the driver accepting the order.
  #
  # Returns:
  # - JSON response with a success message if the order is accepted.
  # - JSON response with error messages if the acceptance fails.
  def accept
    service = OrderService.new
    driver_id = params[:driver_id]
    order_id = params[:order_id]
    result = service.accept(order_id, driver_id)
    render json: result, status: :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # POST /orders/:id/complete
  # Completes an order for a specific driver.
  #
  # Parameters:
  # - order_id: The ID of the order to be completed.
  # - driver_id: The ID of the driver completing the order.
  #
  # Returns:
  # - JSON response with a success message if the order is completed.
  # - JSON response with error messages if the completion fails.
  def complete
    service = OrderService.new
    order_id = params[:order_id]
    driver_id = params[:driver_id]
    result = service.complete(order_id, driver_id)
    render json: result, status: :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # GET /drivers/:driver_id/orders
  # Retrieves all orders assigned to a specific driver.
  #
  # Parameters:
  # - driver_id: The ID of the driver whose orders are to be retrieved.
  #
  # Returns:
  # - JSON response containing the orders for the specified driver.
  # - JSON response with a message if no orders are found.
  def get_orders_by_driver
    service = OrderService.new
    driver_id = params[:driver_id]
    orders = service.get_orders_by_driver(driver_id)

    if orders.empty?
      render json: { message: "No orders found for you currently, try again later." }, status: :ok
    else
      render json: orders
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # GET /users/:user_id/orders
  # Retrieves all orders placed by a specific user.
  #
  # Parameters:
  # - user_id: The ID of the user whose orders are to be retrieved.
  #
  # Returns:
  # - JSON response containing the orders for the specified user.
  # - JSON response with a message if no orders are found.
  def get_orders_by_user
    service = OrderService.new
    user_id = params[:user_id]
    orders = service.get_orders_by_user(user_id)

    if orders.empty?
      render json: { message: "Looks like you haven't placed any orders yet. Create your first order today!" }, status: :ok
    else
      render json: orders
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private
  # Only allow a list of trusted parameters through.
  #
  # Returns:
  # - The permitted parameters for order creation and updates.
  def set_order
    @order = Order.find(params[:id])
  end

  # Strong parameters for order creation and updates.
  #
  # Returns:
  # - The permitted parameters for order creation and updates.
  def order_params
    params.require(:order).permit(:user_id, :driver_id, :status, :origin, :destination, :price, :customer_name, :customer_phone_number, :origin_name, :destination_name)
  end
end
