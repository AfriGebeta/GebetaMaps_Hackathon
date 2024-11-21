class AccessController < ApplicationController
  # skip_before_action :authenticate, only: [:login, :signup]

  # POST /login
  # Authenticates a user and issues a JWT token if successful.
  #
  # Returns:
  # - JSON response containing the JWT token and user details if authentication is successful.
  # - JSON response with an error message if the user does not exist or the password is invalid.
  def login
    user = User.find_by(email: auth_params[:email])
    unless user
      render json: { error: "User does not exist, please sign up and try again" }, status: :not_found
      return
    end

    if user.authenticate(auth_params[:password])
      payload = {
        id: user.id,
        email: user.email,
        is_driver: user.is_driver
      }
      jwt = TokenService.issue(payload)
      render json: { token: jwt, user: payload }
    else
      render json: { error: "Invalid password." }, status: 400
    end
  end

  # POST /signup
  # Registers a new user and issues a JWT token upon successful creation.
  #
  # Returns:
  # - JSON response containing the JWT token and user details if registration is successful.
  # - JSON response with error messages if the user could not be created.
  def signup
    @user = User.new(signup_params)

    if @user.save
      payload = {
        id: @user.id,
        email: @user.email
      }
      jwt = TokenService.issue(payload)
      render json: { token: jwt, user: payload }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Strong parameters for authentication.
  #
  # Returns:
  # - The permitted parameters for user authentication.
  def auth_params
    params.require(:auth).permit(:email, :password)
  end

  # Strong parameters for user registration.
  #
  # Returns:
  # - The permitted parameters for user signup.
  def signup_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :phone_number, :business_name, :business_email, primary_address: [ :latitude, :longitude ], secondary_address: [ :latitude, :longitude ])
  end
end
