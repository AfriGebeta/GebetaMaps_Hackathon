part of 'plan.dart';

class Itinerary extends Equatable {
  static const String _legs = "legs";
  static const String _startTime = "startTime";
  static const String _endTime = "endTime";
  static const String _duration = "duration";
  static const String _walkTime = "walkTime";
  static const String _walkDistance = "walkDistance";
  static const String _transfers = "transfers";

  final List<Leg> legs;
  final DateTime startTime;
  final DateTime endTime;
  final Duration duration;
  final Duration walkTime;
  final double distance;
  final double walkDistance;
  final int transfers;

  Itinerary({
    required this.legs,
    required this.startTime,
    required this.endTime,
    required this.walkTime,
    required this.duration,
    required this.walkDistance,
    required this.transfers,
  }) : distance = sumDistances(legs);

  factory Itinerary.fromJson(Map<String, dynamic> json) {
    return Itinerary(
      legs: json[_legs]?.map<Leg>((dynamic json) {
            return Leg.fromJson(json as Map<String, dynamic>);
          }).toList() as List<Leg>? ??
          [],
      startTime: DateTime.fromMillisecondsSinceEpoch(
          int.tryParse(json[_startTime].toString()) ?? 0),
      endTime: DateTime.fromMillisecondsSinceEpoch(
          int.tryParse(json[_endTime].toString()) ?? 0),
      duration:
          Duration(seconds: int.tryParse(json[_duration].toString()) ?? 0),
      walkTime:
          Duration(seconds: int.tryParse(json[_walkTime].toString()) ?? 0),
      walkDistance: double.tryParse(json[_walkDistance].toString()) ?? 0,
      transfers: int.tryParse(json[_transfers].toString()) ?? 5,
    );
  }

  List<Leg> get compressLegs {
    final compressedLegs = <Leg>[];
    Leg? compressedLeg;
    for (final Leg currentLeg in legs) {
      if (compressedLeg == null) {
        compressedLeg = currentLeg.copyWith();
        continue;
      }

      if (continueWithNoTransit(compressedLeg, currentLeg)) {
        compressedLeg = compressedLeg.copyWith(
          duration: compressedLeg.duration + currentLeg.duration,
          distance: compressedLeg.distance + currentLeg.distance,
          toPlace: currentLeg.toPlace,
          endTime: currentLeg.endTime,
          transportMode: TransportMode.bicycle,
          accumulatedPoints: [
            ...compressedLeg.accumulatedPoints,
            ...currentLeg.accumulatedPoints
          ],
        );
        continue;
      }

      compressedLegs.add(compressedLeg);
      compressedLeg = currentLeg.copyWith();
    }
    if (compressedLeg != null) {
      compressedLegs.add(compressedLeg);
    }

    return compressedLegs;
  }

  String get startTimeHHmm => durationToHHmm(startTime);

  String get endTimeHHmm => durationToHHmm(endTime);

  double get totalBikingDistance => getTotalBikingDistance(compressLegs);

  Duration get totalBikingDuration => getTotalBikingDuration(compressLegs);

  Leg? get getFirstDeparture {
    final firstDeparture = compressLegs.firstWhereOrNull(
      (element) => element.transitLeg,
    );
    return firstDeparture;
  }

  int getNumberLegHide(double renderBarThreshold) {
    return compressLegs
        .where((leg) {
          final legLength = (leg.duration.inSeconds / duration.inSeconds) * 10;
          return legLength < renderBarThreshold &&
              leg.transportMode != TransportMode.walk;
        })
        .toList()
        .length;
  }

  int getNumberLegTime(double renderBarThreshold) {
    return compressLegs.fold(0, (previousValue, leg) {
      final legLength = (leg.duration.inSeconds / duration.inSeconds) * 10;
      return legLength < renderBarThreshold
          ? previousValue + leg.duration.inSeconds
          : previousValue;
    });
  }

  @override
  List<Object?> get props => [
        legs,
        distance,
        startTime,
        endTime,
        walkTime,
        duration,
        walkDistance,
      ];
}
