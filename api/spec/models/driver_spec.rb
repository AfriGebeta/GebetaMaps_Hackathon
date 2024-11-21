require 'rails_helper'

RSpec.describe Driver, type: :model do
  it "has a valid factory" do
    expect(create(:driver)).to be_valid
  end

  it "validates that first name cannot be nil" do
    driver = build(:driver, first_name: nil)
    expect(driver).not_to be_valid
  end

  it "validates that last name cannot be nil" do
    driver = build(:driver, last_name: nil)
    expect(driver).not_to be_valid
  end

  it "validates that vehicle type cannot be nil" do
    driver = build(:driver, vehicle_type: nil)
    expect(driver).not_to be_valid
  end

  it "validates that license plate number cannot be nil" do
    driver = build(:driver, license_plate_number: nil)
    expect(driver).not_to be_valid
  end
end
