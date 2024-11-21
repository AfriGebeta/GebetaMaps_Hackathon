require 'rails_helper'

RSpec.describe ApiKey, type: :model do
  it "has a valid factory" do
    expect(create(:api_key)).to be_valid
  end

  it "validates that the key is unique" do
    existing_key = create(:api_key, key: "unique_key_123")
    api_key = build(:api_key, key: existing_key.key)
    expect(api_key).not_to be_valid
    expect(api_key.errors[:key]).to include("has already been taken")
  end

  it "validates that the user is present" do
    api_key = build(:api_key, user: nil)
    expect(api_key).not_to be_valid
    expect(api_key.errors[:user]).to include("must exist")
  end

  it "validates that the expiration date is in the future" do
    api_key = build(:api_key, expires_at: 1.day.ago)
    expect(api_key).not_to be_valid
    expect(api_key.errors[:expires_at]).to include("must be in the future")

    api_key.expires_at = 1.day.from_now
    expect(api_key).to be_valid
  end

  it "generates a unique key before creation" do
    api_key = build(:api_key, key: nil)
    expect(api_key.key).to be_nil
    api_key.save
    expect(api_key.key).not_to be_nil
    expect(api_key.key.length).to be >= 20
  end
end
