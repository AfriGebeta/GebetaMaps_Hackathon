class OrderSerializer < ActiveModel::Serializer
  attributes :id, :status, :origin, :destination, :price, :customer_name, :customer_phone_number
  has_one :user
  has_one :driver
end
