class User < ApplicationRecord
  has_secure_password
  has_many :api_keys, dependent: :destroy

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone_number, presence: true
  validates :business_name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :license_plate_number, uniqueness: true, allow_nil: true

  # Enum for vehicle types
  enum vehicle_type: { car: 0, motorcycle: 1 }

  # Setter for primary_address
  # Accepts a hash with latitude and longitude and sets the primary_address attribute.
  #
  # If the coordinates are valid, it stores them; otherwise, it sets them to nil.
  def primary_address=(coordinates)
    if coordinates.is_a?(Hash) && coordinates["latitude"].present? && coordinates["longitude"].present?
      self[:primary_address] = { "latitude" => coordinates["latitude"], "longitude" => coordinates["longitude"] }
    else
      self[:primary_address] = { "latitude" => nil, "longitude" => nil }
    end
  end

  # Setter for secondary_address
  # Accepts a hash with latitude and longitude and sets the secondary_address attribute.
  #
  # If the coordinates are valid, it stores them; otherwise, it sets them to nil.
  def secondary_address=(coordinates)
    if coordinates.is_a?(Hash) && coordinates["latitude"].present? && coordinates["longitude"].present?
      self[:secondary_address] = { "latitude" => coordinates["latitude"], "longitude" => coordinates["longitude"] }
    else
      self[:secondary_address] = nil
    end
  end
end
