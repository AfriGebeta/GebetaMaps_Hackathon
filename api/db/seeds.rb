# # db/seeds.rb

# # Create sample users and drivers if they don't exist
# user = FactoryBot.create(:user)
# driver = FactoryBot.create(:driver)

# # Create 3 sample orders
# 6.times do
#   FactoryBot.create(:order, user: user, driver: driver)
# end

# puts "Created 6 sample orders."


# # test_user = User.find_or_create_by!(
# #   first_name: "Test",
# #   last_name: "User",
# #   email: "test.user@example.com",
# #   phone_number: "123-456-7890",
# #   password_digest: "passwordPassword",
# #   business_name: "Test Business",
# #   business_email: "test.business@example.com"
# # )

# test_user = FactoryBot.create(:user ,email: "test@example.com", password: "passwordPassword")

# puts "Created test user: #{test_user.email}"
