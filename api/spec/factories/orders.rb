FactoryBot.define do
  factory :order do
    user
    driver
    status { 0 }
    origin { Faker::Address.full_address }
    destination { Faker::Address.full_address }
    origin_name { Faker::Address.full_address }
    destination_name { Faker::Address.full_address }
    price { Faker::Commerce.price }
    customer_name { Faker::Name.name }
    customer_phone_number { Faker::PhoneNumber.phone_number }
  end
end
