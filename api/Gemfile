source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.3.0"

gem "bootsnap", require: false
gem "active_model_serializers"
gem "puma", "~> 6.0"
gem "rails", "~> 7.2.1"
gem "sqlite3", "~> 2.2"
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem "rack-cors", require: "rack/cors"

gem "factory_bot_rails"
gem "faker"
gem "jwt"

group :development, :test do
  gem "bullet"
  gem "debug", platforms: %i[mri mingw x64_mingw]
  gem "rspec-rails"
  gem "standard"
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  gem "spring"
  gem "spring-commands-rspec"
end

group :test do
  gem "shoulda-matchers"
  gem "simplecov"
  gem "timecop"
end

gem "dotenv-rails", groups: %i[development test]
gem "httparty"
gem "bcrypt"
