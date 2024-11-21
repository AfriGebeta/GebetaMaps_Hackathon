import 'package:go_find_taxi/modules/transit/core/transport_mode.dart';
import 'package:intl/intl.dart';
import '../../../modules/transit/data/models/plan/plan.dart';

NumberFormat _formatOneDecimals({String? localeName}) {
  return NumberFormat('#.0', localeName ?? 'en');
}

bool continueWithNoTransit(Leg leg1, Leg leg2) {
  final bool isBicycle1 = leg1.transportMode == TransportMode.bicycle ||
      leg1.transportMode == TransportMode.walk;
  final bool isBicycle2 = leg2.transportMode == TransportMode.bicycle ||
      leg2.transportMode == TransportMode.walk;
  return isBicycle1 && isBicycle2;
}

double getTotalBikingDistance(List<Leg> legs) =>
    sumDistances(legs.where(isBikingLeg).toList());

double sumDistances(List<Leg> legs) {
  return legs.isNotEmpty
      ? legs.map((e) => e.distance).reduce((value, element) => value + element)
      : 0;
}

Duration getTotalBikingDuration(List<Leg> legs) {
  return _sumDurations(legs.where(isBikingLeg).toList());
}

Duration _sumDurations(List<Leg> legs) {
  return legs.isNotEmpty
      ? legs.map((e) => e.duration).reduce((value, element) => value + element)
      : const Duration();
}

bool isWalkingLeg(Leg leg) {
  return [TransportMode.walk].contains(leg.transportMode);
}

bool isBikingLeg(Leg leg) {
  return [
    TransportMode.bicycle,
  ].contains(leg.transportMode);
}
