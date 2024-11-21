class AddVehicleTypeAndLicensePlateToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :vehicle_type, :integer, null: true
    add_column :users, :license_plate_number, :string, null: true
    add_column :users, :is_driver, :boolean, default: false

    add_index :users, :license_plate_number, unique: true
  end
end
