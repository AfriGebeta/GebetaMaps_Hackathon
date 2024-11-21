/// This file defines the interface for the remote repository of the `route` module.
///
/// The `IRouteRepoRemote` interface is intended to provide a contract for
/// remote data operations related to the `route` module. Implementations
/// of this interface should handle all remote data interactions, such as API calls, network
/// requests, or any other form of remote data fetching.
///
/// Usage:
///
/// ```dart
/// class RouteRepoRemoteImpl implements IRouteRepoRemote {
///   // Implement the methods defined in the interface
/// }
///
/// final remoteRepository = RouteRepoRemoteImpl();
/// // Use remoteRepository to perform remote data operations
/// ```
///
/// This approach ensures that the remote data operations are abstracted and can be easily
/// swapped or mocked for testing purposes.
library;

import 'package:go_find_taxi/core/handlers/result.dart';
import 'package:google_maps_widget/google_maps_widget.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../../core/services/LocationService/location_service.dart';
import '../../../../../core/services/index.dart';
import '../../models/route_model.dart';
import '../../models/transport_place_model.dart';
import 'route_remote_impl.dart';

part 'i_route_remote.g.dart';

@Riverpod(keepAlive: true)
IRouteRepoRemote routeRepoRemote(RouteRepoRemoteRef ref) {
  // dependencies
  final httpService = ref.read(httpServiceProvider);

  final locationService = LocationService.getInstance();
  return RouteRepoRemoteImpl(httpService, locationService)
    ..getAllTransportPlaces();
}

abstract class IRouteRepoRemote {
  FutureResult<List<TransportRoute>> getTransportRoutes(
      {required LatLng currentLocation});
  FutureResult<List<TransportRoute>> getTransportRoutesFromTransportPlace(
      {required TransportPlace initialPoint,
      required TransportPlace destination});
  FutureResult<TransportRoute> searchTransportRouteByNames(
      {required String origin, required String destination});
  FutureResult<List<TransportPlace>> searchTransportPlaceByName(
      {required String name});
  FutureResult<TransportPlace> searchFromCurrentLocation();
  FutureResult<Plan> getTransportRouteFromTwoPoints(
      {required TransportPlace from, required TransportPlace to});
}
