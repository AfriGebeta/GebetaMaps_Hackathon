# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_19_132927) do
  create_table "api_keys", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "key", null: false
    t.string "name"
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_api_keys_on_key"
    t.index ["user_id"], name: "index_api_keys_on_user_id"
  end

  create_table "drivers", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name"
    t.integer "vehicle_type", null: false
    t.string "license_plate_number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "driver_id"
    t.integer "status", null: false
    t.json "origin"
    t.json "destination"
    t.string "origin_name"
    t.string "destination_name"
    t.float "price"
    t.string "customer_name"
    t.string "customer_phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "driver_on_order_indx"
    t.index ["user_id"], name: "user_on_orders_indx"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "phone_number", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.string "business_name", null: false
    t.string "business_email"
    t.json "primary_address"
    t.json "secondary_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "vehicle_type"
    t.string "license_plate_number"
    t.boolean "is_driver", default: false
    t.index ["license_plate_number"], name: "index_users_on_license_plate_number", unique: true
  end

  add_foreign_key "api_keys", "users"
  add_foreign_key "orders", "users"
  add_foreign_key "orders", "users", column: "driver_id"
end
