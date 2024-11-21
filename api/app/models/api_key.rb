class ApiKey < ApplicationRecord
  belongs_to :user

  # Validations
  validates :key, presence: true, uniqueness: true
  validate :expires_at_must_be_in_the_future

  # Callback to generate a unique API key before validation
  before_validation :generate_unique_key, on: :create

  private

  # Generates a unique API key using SecureRandom.
  #
  # This method ensures that the generated key is unique by checking
  # against existing keys in the database. If a duplicate is found,
  # it generates a new key until a unique one is created.
  def generate_unique_key
    self.key ||= loop do
      generated_key = SecureRandom.hex(32)
      break generated_key unless ApiKey.exists?(key: generated_key)
    end
  end

  # Custom validation to ensure the expiration date is in the future.
  #
  # Returns:
  # - Adds an error if the expires_at attribute is present and
  #   is not in the future.
  def expires_at_must_be_in_the_future
    if expires_at.present? && expires_at <= Time.current
      errors.add(:expires_at, "must be in the future")
    end
  end
end
