class CreateDrivers < ActiveRecord::Migration[7.2]
  def change
    create_table :drivers do |t|
      t.string :first_name, null: false
      t.string :last_name
      t.integer :vehicle_type, null: false
      t.string :license_plate_number, null: false

      t.timestamps
    end
  end
end
