require 'rails_helper'

RSpec.describe "/orders", type: :request do
  let(:valid_attributes) {
    {
      user_id: create(:user).id,
      driver_id: create(:driver).id,
      status: :pending,
      origin: Faker::Address.full_address,
      destination: Faker::Address.full_address,
      price: Faker::Commerce.price,
      customer_name: Faker::Name.name,
      customer_phone_number: Faker::PhoneNumber.phone_number
    }
  }

  let(:invalid_attributes) {
    {
      user_id: nil,
      driver_id: nil,
      status: nil,
      origin: nil,
      destination: nil,
      price: nil,
      customer_name: nil,
      customer_phone_number: nil
    }
  }

  let(:valid_headers) {
    {}
  }

  describe "GET /index" do
    it "renders a successful response" do
      Order.create! valid_attributes
      get orders_url, headers: valid_headers, as: :json
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      order = Order.create! valid_attributes
      get order_url(order), as: :json
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Order" do
        expect {
          post orders_url,
               params: { order: valid_attributes }, headers: valid_headers, as: :json
        }.to change(Order, :count).by(1)
      end

      it "renders a JSON response with the new order" do
        post orders_url,
             params: { order: valid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Order" do
        expect {
          post orders_url,
               params: { order: invalid_attributes }, as: :json
        }.to change(Order, :count).by(0)
      end

      it "renders a JSON response with errors for the new order" do
        post orders_url,
             params: { order: invalid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        {
          user_id: create(:user).id,
          driver_id: create(:driver).id,
          status: :scheduled,
          origin: Faker::Address.full_address,
          destination: Faker::Address.full_address,
          price: Faker::Commerce.price,
          customer_name: Faker::Name.name,
          customer_phone_number: Faker::PhoneNumber.phone_number
        }
      }

      it "updates the requested order" do
        order = Order.create! valid_attributes
        patch order_url(order),
              params: { order: new_attributes }, headers: valid_headers, as: :json
        order.reload
        expect(order.user_id).to eq(new_attributes[:user_id])
        expect(order.driver_id).to eq(new_attributes[:driver_id])
        expect(order.status).to eq("scheduled")
        expect(order.origin).to eq(new_attributes[:origin])
        expect(order.destination).to eq(new_attributes[:destination])
        expect(order.price).to eq(new_attributes[:price])
        expect(order.customer_name).to eq(new_attributes[:customer_name])
        expect(order.customer_phone_number).to eq(new_attributes[:customer_phone_number])
      end

      it "renders a JSON response with the order" do
        order = Order.create! valid_attributes
        patch order_url(order),
              params: { order: new_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the order" do
        order = Order.create! valid_attributes
        patch order_url(order),
              params: { order: invalid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested order" do
      order = Order.create! valid_attributes
      expect {
        delete order_url(order), headers: valid_headers, as: :json
      }.to change(Order, :count).by(-1)
    end
  end
end
