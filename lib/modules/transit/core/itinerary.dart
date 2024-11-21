import '../data/models/plan/plan.dart';

extension ShortestItinerary on List<Itinerary> {
  Itinerary get shortestDistance {
    if (isEmpty) {
      throw StateError(
          'Cannot get shortest distance from empty itinerary list');
    }
    return first;
    // final shortest =
    //     reduce((curr, next) => curr.distance < next.distance ? curr : next);
    // return shortest;
  }
}
