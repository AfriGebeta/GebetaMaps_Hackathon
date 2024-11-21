class Order < ApplicationRecord
  belongs_to :user
  belongs_to :driver, optional: true

  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true
  # validate :driver_presence_if_in_progress


  enum :status, { pending: 0, scheduled: 1, in_progress: 2, delivered: 3 }


  private

  def driver_presence_if_in_progress
    if status == "in_progress" && driver.nil?
      errors.add(:driver, "must be present if the order is in progress")
    end
  end
end
