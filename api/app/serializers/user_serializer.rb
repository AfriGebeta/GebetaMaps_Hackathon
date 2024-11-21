class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :phone_number, :email, :business_name, :business_email, :primary_address, :secondary_address
end
