class PriceCalculator {
  static const double BASE_FARE = 5.0; // Base fare in ETB
  static const double FARE_PER_KM = 1; // Fare per kilometer in ETB

  static String calculatePrice(double distanceInKm) {
    if (distanceInKm < 0) {
      throw ArgumentError('Distance cannot be negative');
    }

    final price = (distanceInKm) / 200;

    return "${price.toStringAsFixed(2)} ETB"; // Round to 2 decimal places
  }
}
