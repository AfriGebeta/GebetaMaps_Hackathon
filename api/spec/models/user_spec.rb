require 'rails_helper'

RSpec.describe User, type: :model do
  it "has a valid factory" do
    expect(create(:user)).to be_valid
  end

  it "validates that email is unique" do
    user1 = create(:user)
    user2 = build(:user, email: user1.email)
    expect(user2).not_to be_valid
  end

  it "validates that email cannot be nil" do
    user = build(:user, email: nil)
    expect(user).not_to be_valid
  end



  it "validates that license_plate_number is unique" do
    user1 = create(:user, license_plate_number: "ABC123")
    user2 = build(:user, license_plate_number: "ABC123")
    expect(user2).not_to be_valid
  end

  it "defaults is_driver to false" do
    user = create(:user)
    expect(user.is_driver).to be_falsey
  end

  it "can set vehicle_type to car" do
    user = create(:user, vehicle_type: :car)
    expect(user.vehicle_type).to eq("car")
  end

  it "can set vehicle_type to motorcycle" do
    user = create(:user, vehicle_type: :motorcycle)
    expect(user.vehicle_type).to eq("motorcycle")
  end
end
