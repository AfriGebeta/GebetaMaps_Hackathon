class TokenService
  # Issues a JWT token based on the provided payload.
  #
  # Parameters:
  # - payload: A hash containing the data to be encoded in the token.
  #
  # Returns:
  # - A JWT token as a string.
  def self.issue(payload)
    JWT.encode(payload, key, "HS256")
  end

  # Decodes a JWT token and retrieves the payload.
  #
  # Parameters:
  # - token: The JWT token to be decoded.
  #
  # Returns:
  # - The decoded payload as a hash.
  def self.decode(token)
    JWT.decode(token, key, true, algorithm: "HS256").first
  end

  # Retrieves the secret key used for encoding and decoding tokens.
  #
  # Returns:
  # - The secret key as a string.
  def self.key
    ENV["SECRET_KEY"] || Rails.application.credentials.secret_key_base
  end
end
