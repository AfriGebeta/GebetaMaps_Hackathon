import 'package:google_maps_widget/google_maps_widget.dart';

class Route {
  final String name; // Name of the route
  final double price; // Price for the route
  final List<LatLng>? coordinates; // List of LatLngCoordinates for the route

  Route({
    required this.name,
    required this.price,
    this.coordinates,
  });

  factory Route.fromJson(Map<String, dynamic> json) {
    return Route(
      name: json['name'],
      price: json['price'],
    );
  }
}
