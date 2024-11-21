class Driver < ApplicationRecord
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :vehicle_type, presence: true
  validates :license_plate_number, presence: true
end
