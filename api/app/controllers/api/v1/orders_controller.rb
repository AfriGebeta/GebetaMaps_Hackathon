module Api
  module V1
    class OrdersController < ApplicationController
      before_action :authenticate_api_key

      # POST /api/v1/orders/init
      # Initializes a new order for the authenticated user.
      #
      # This method retrieves the user's primary address and creates a new order
      # with the status set to "scheduled" and an initial price of 0.
      #
      # Returns:
      # - JSON response with a success message, order ID, and redirect URL if successful.
      # - JSON response with error messages if the order could not be saved.
      def init
        primary_address = User.where(id: @user_id).pluck(:primary_address).first
        latitude, longitude = primary_address.values_at("latitude", "longitude")

        @order = Order.new(
          order_params.merge(
            user_id: @user_id,
            status: "scheduled",
            origin: "#{latitude}, #{longitude}",
            price: 0 # Set initial price
          )
        )

        if @order.save
          render json: {
            message: "Order has been successfully Initialized",
            order_id: @order.id,
            redirect_url: "https://litetest.vercel.app/Redirect/#{@order.id}"
          }
        else
          render json: @order.errors, status: :unprocessable_entity
        end
      end

      # POST /api/v1/orders/create
      # Completes the order initialization and creates a new order.
      #
      # This method finds the initialized order by ID and updates it with the
      # provided parameters, setting the status to "pending" and ensuring the
      # price is a float.
      #
      # Returns:
      # - JSON response with a success message and the created order if successful.
      # - JSON response with error messages if the order could not be updated.
      def create
        @order = Order.find(params[:id]) # Find the initialized order
        update_params = order_complete_params.merge({
          status: "pending",
          price: params[:order][:price].to_f # Ensure the price is a float
        })

        if @order.update(update_params)
          render json: { message: "Order successfully created", order: @order }, status: :ok
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # Authenticates the API key provided in the request parameters.
      # Sets the @user_id instance variable if the API key is valid.
      #
      # Returns:
      # - JSON response with an error message if the API key is invalid.
      def authenticate_api_key
        api_key = params[:api_key]
        @api_key = ApiKey.find_by(key: api_key)

        unless @api_key
          render json: { error: "Invalid or inactive API key" }, status: :unauthorized
        else
          @user_id = @api_key.user_id
        end
      end

      # Strong parameters for order initialization.
      #
      # Returns:
      # - Permitted parameters for order initialization.
      def order_params
        params.permit(:user_id)
      end

      # Strong parameters for completing an order.
      #
      # Returns:
      # - Required parameters for completing an order.
      def order_complete_params
        params.require(:order).permit(
          :destination,
          :destination_name,
          :customer_name,
          :customer_phone_number
        )
      end
    end
  end
end
