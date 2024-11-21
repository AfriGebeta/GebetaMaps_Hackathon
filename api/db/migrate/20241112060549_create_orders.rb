class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :user, null: false,
        index: { name: "user_on_orders_indx" },
        foreign_key: { to_table: :users }

      t.references :driver, null: true,
        foreign_key: true,
        index: { name: "driver_on_order_indx" },
        foreign_key: { to_table: :users }
      t.integer :status, null: false
      t.json :origin
      t.json :destination
      t.string :origin_name
      t.string :destination_name
      t.float :price
      t.string :customer_name
      t.string :customer_phone_number

      t.timestamps
    end
  end
end
