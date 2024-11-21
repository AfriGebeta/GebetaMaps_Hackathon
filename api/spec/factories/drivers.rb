FactoryBot.define do
  factory :driver do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    vehicle_type { Faker::Vehicle.make }
    license_plate_number { Faker::Vehicle.license_plate }
  end
end
