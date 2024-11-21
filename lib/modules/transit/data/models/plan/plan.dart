import 'package:flutter/material.dart';
import 'package:equatable/equatable.dart';
import 'package:google_maps_widget/google_maps_widget.dart';
import 'package:collection/collection.dart';

import '../../../../../core/utils/index.dart';
import '../../../core/transport_mode.dart';
import '../../../core/map_utils.dart';

part 'itinerary.dart';
part 'leg.dart';
part 'place.dart';
part 'transport_route.dart';
part 'plan_error.dart';

class Plan extends Equatable {
  static List<Itinerary> removePlanItineraryDuplicates(
    List<Itinerary> itineraries,
  ) {
    final usedRoutes = <String>{};
    // Fold the itinerary list to build up list without duplicates
    return itineraries.fold<List<Itinerary>>(
      <Itinerary>[],
      (itineraries, itinerary) {
        // Get first bus leg
        final firstBusLeg =
            itinerary.legs.firstWhereOrNull((leg) => leg.transitLeg);
        // If no bus leg exist just add the itinerary
        if (firstBusLeg == null) {
          itineraries.add(itinerary);
        } else {
          // If a bus leg exist and the first route isn't used yet just add the itinerary
          if (!usedRoutes.contains(firstBusLeg.shortName)) {
            itineraries.add(itinerary);
            usedRoutes.add(firstBusLeg.shortName!);
          }
        }
        // Return current list
        return itineraries;
      },
    );
  }

  static const _itineraries = "itineraries";
  static const _plan = "plan";
  static const _error = "error";

  final List<Itinerary>? itineraries;
  final PlanError? error;

  const Plan({
    this.itineraries,
    this.error,
  });

  Plan copyWith({
    List<Itinerary>? itineraries,
  }) {
    return Plan(
      itineraries: itineraries ?? this.itineraries,
    );
  }

  factory Plan.fromJson(Map<String, dynamic> json) {
    if (json.containsKey(_error)) {
      return Plan(
          error: PlanError.fromJson(json[_error] as Map<String, dynamic>));
    } else {
      final Map<String, dynamic> planJson = json[_plan] as Map<String, dynamic>;
      return Plan(
        itineraries: removePlanItineraryDuplicates(planJson[_itineraries]
                ?.map<Itinerary>((dynamic itineraryJson) =>
                    Itinerary.fromJson(itineraryJson as Map<String, dynamic>))
                .toList() as List<Itinerary>? ??
            []),
      );
    }
  }

  bool get hasError => error != null;

  @override
  List<Object?> get props => [
        itineraries,
        error,
      ];
}
