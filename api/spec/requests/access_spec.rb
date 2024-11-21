require 'rails_helper'

RSpec.describe "Accesses", type: :request do
  it "creates a new user and returns a token" do
    params = {
      user: {
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
        email: "john.doe@example.com",
        password: "securepassword",
        business_name: "John's Business",
        business_email: "business@example.com"
      }
    }

    post signup_url, params: params, as: :json

    result = JSON(response.body)

    expect(response).to have_http_status(:created)
    expect(result["token"]).to be_present
    expect(result["user"]["email"]).to eq "john.doe@example.com"
  end

  it "returns errors if user creation fails" do
    params = {
      user: {
        first_name: nil,
        last_name: "Doe",
        phone_number: "1234567890",
        email: nil,
        password: nil,
        business_name: "John's Business",
        business_email: "business@example.com"
      }
    }

    post signup_url, params: params, as: :json

    result = JSON(response.body)

    expect(response).to have_http_status(:unprocessable_entity)
  end
end
