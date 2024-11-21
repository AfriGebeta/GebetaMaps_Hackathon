import 'package:go_find_taxi/core/handlers/result.dart';
import 'package:google_maps_widget/google_maps_widget.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../../core/services/LocationService/location_service.dart';
import '../../../data/repositories/remote/i_route_remote.dart';
import 'state/transport_route_state.dart';
part 'transport_route_notifier.g.dart';

@riverpod
class TransportRouteNotifier extends _$TransportRouteNotifier {
  @override
  TransportRouteState build() {
    // this is your build . you can return any state you want
    return const TransportRouteState.initial();
  }

  Future<void> getTransportRoutes() async {
    state = const TransportRouteState.gettingCurrentLocation();
    LatLng currentLocation;
    try {
      final locationService = LocationService.getInstance();
      currentLocation = await locationService.getCurrentLocation();
    } catch (e) {
      state = TransportRouteState.failure(error: e.toString());
      return;
    }
    state = const TransportRouteState.loading();
    final result = await ref
        .read(routeRepoRemoteProvider)
        .getTransportRoutes(currentLocation: currentLocation);
    result.fold(onSuccess: (data) {
      state = TransportRouteState.success(data.data);
    }, onFailure: (error) {
      state = TransportRouteState.failure(error: error.message ?? "");
    });
  }
}
