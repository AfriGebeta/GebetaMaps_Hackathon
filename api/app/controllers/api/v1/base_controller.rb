module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_api_key

      private

      def authenticate_api_key
        api_key = request.headers["Authorization"]&.split(" ")&.last
        key_record = ApiKey.find_by(key: api_key)

        if key_record.nil?
          render json: { error: "Unauthorized: Invalid or expired API key" }, status: :unauthorized
        else
          @current_user = key_record.user
          debugger
        end
      end
    end
  end
end
