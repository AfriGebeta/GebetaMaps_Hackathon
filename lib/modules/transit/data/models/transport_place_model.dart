import 'package:google_maps_widget/google_maps_widget.dart';

import '../../../../core/services/LocationService/models/geo_coding_response.dart';

class TransportPlace {
  final String? name;
  final LatLng? coordinates;

  TransportPlace({
    this.name,
    this.coordinates,
  });

  factory TransportPlace.fromJson(List<dynamic>? json) {
    if (json == null) return TransportPlace();

    return TransportPlace(
      name: json[0] as String?,
      coordinates: json[3] != null
          ? LatLng(json[3][1].toDouble(), json[3][0].toDouble())
          : null,
    );
  }

  factory TransportPlace.fromGeoCoding(GeoCoding geoCoding) {
    return TransportPlace(
      name: geoCoding.name,
      coordinates: LatLng(geoCoding.latitude?.toDouble() ?? 0,
          geoCoding.longitude?.toDouble() ?? 0),
    );
  }

  @override
  String toString() {
    return '${coordinates?.latitude}, ${coordinates?.longitude}';
  }
}
