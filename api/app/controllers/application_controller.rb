class ApplicationController < ActionController::API
  # before_action :authenticate

  def current_user
    return if token.nil?

    user = User.find(auth["id"])
    @current_user ||= user
  end

  def authenticate
    render json: { error: "Unauthorized" }, status: 401 if current_user.nil?
  end

  def token
    return nil if request.env["HTTP_AUTHORIZATION"].nil?

    request.env["HTTP_AUTHORIZATION"].scan(/Bearer (.*)$/).flatten.last
  end

  def auth
    TokenService.decode(token)
  end

  def authenticate_api_key
    api_key = request.headers["Authorization"]&.split(" ")&.last
    key_record = ApiKey.find_by(key: api_key)

    if key_record.nil?
      render json: { error: "Unauthorized: Invalid or expired API key" }, status: :unauthorized
    else
      @current_user = key_record.user
    end
  end
end
