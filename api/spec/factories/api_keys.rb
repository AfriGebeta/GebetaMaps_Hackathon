FactoryBot.define do
  factory :api_key do
    user
    key { SecureRandom.hex(16) }
    expires_at { 30.days.from_now }
  end
end
