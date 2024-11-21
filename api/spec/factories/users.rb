FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    phone_number { Faker::PhoneNumber.phone_number }
    email { Faker::Internet.email }
    password { "MyString" }
    business_name { Faker::Company.name }
    business_email { Faker::Internet.email }
    primary_address { { "latitude" => Faker::Address.latitude, "longitude" => Faker::Address.longitude } }
    secondary_address { { "latitude" => Faker::Address.latitude, "longitude" => Faker::Address.longitude } }

    vehicle_type { :car }
    license_plate_number { Faker::Vehicle.license_plate }
    is_driver { false }
  end
end
