class DriverSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :vehicle_type, :license_plate_number
end
