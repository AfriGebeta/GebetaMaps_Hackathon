class ApiKeysController < ApplicationController
  # GET /api/v1/api_keys
  # Retrieves all API keys associated with the current user.
  #
  # Returns:
  # - JSON response containing an array of API keys for the authenticated user.
  def index
    api_keys = current_user.api_keys
    render json: api_keys, status: :ok
  end

  # POST /api/v1/api_keys
  # Creates a new API key for the current user.
  #
  # Returns:
  # - JSON response with a success message and the created API key if successful.
  # - JSON response with error messages if the API key could not be created.
  def create
    api_key = current_user.api_keys.new(api_key_params)

    if api_key.save
      render json: { message: "API key created successfully", api_key: api_key }, status: :created
    else
      render json: { errors: api_key.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/api_keys/:id
  # Deletes a specific API key associated with the current user.
  #
  # Returns:
  # - JSON response with a success message if the API key is successfully deleted.
  # - JSON response with an error message if the API key could not be found or deleted.
  def destroy
    api_key = current_user.api_keys.find(params[:id])
    api_key.destroy!
    render json: { message: "API key deleted successfully" }, status: :ok
  end

  private

  # Strong parameters for API key creation.
  #
  # Returns:
  # - The permitted parameters for creating an API key.
  def api_key_params
    params.require(:api_key).permit(:name, :expires_at)
  end
end
