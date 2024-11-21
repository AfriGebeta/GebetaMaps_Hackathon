import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../data/models/plan/plan.dart';

part 'get_transport_route_from_two_place_state.freezed.dart';

@freezed
class GetTransportRouteFromTwoPlaceState
    with _$GetTransportRouteFromTwoPlaceState {
  const factory GetTransportRouteFromTwoPlaceState.initial() = _Initial;
  const factory GetTransportRouteFromTwoPlaceState.loading() = _Loading;
  const factory GetTransportRouteFromTwoPlaceState.success(
      {required Plan data}) = _Success;
  const factory GetTransportRouteFromTwoPlaceState.failure(
      {required String error}) = _Failure;
}
