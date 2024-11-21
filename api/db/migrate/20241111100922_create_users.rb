class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :phone_number, null: false
      t.string :email, null: false
      t.string :password_digest
      t.string :business_name, null: false
      t.string :business_email
      t.json :primary_address
      t.json :secondary_address

      t.timestamps
    end
  end
end
