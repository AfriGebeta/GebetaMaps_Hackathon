import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:go_find_taxi/core/handlers/result.dart';
import 'package:go_find_taxi/core/handlers/success/success.dart';
import 'package:go_find_taxi/core/services/LocationService/location_service.dart';
import 'package:go_find_taxi/core/services/index.dart';
import 'package:go_find_taxi/core/utils/index.dart';
import 'package:go_find_taxi/modules/transit/data/models/transport_place_model.dart';

import 'package:google_maps_widget/google_maps_widget.dart';

import '../../../../../core/handlers/failure/failure.dart';
import '../../../../../core/utils/src/calculate_distance.dart';
import '../../models/route_model.dart';
import 'i_route_remote.dart';

class RouteRepoRemoteImpl implements IRouteRepoRemote {
  final HttpService _httpService;
  final LocationService locationService;
  final List<TransportPlace> _transportDatas = [];
  RouteRepoRemoteImpl(this._httpService, this.locationService);

  @override
  FutureResult<List<TransportRoute>> getTransportRoutes(
      {required LatLng currentLocation}) async {
    try {
      await Future.delayed(const Duration(seconds: 2));
      final mockJson = [
        {
          "initialPoint": "Current Location",
          "destination": "Downtown Mall",
          "distance": 5.2,
          "availability": true,
          "routes": [
            {
              "name": "Route A",
              "price": 15.50,
              "coordinates": [
                "37.7749,-122.4194",
                "37.7750,-122.4180",
                "37.7752,-122.4170"
              ]
            },
            {
              "name": "Route B",
              "price": 12.75,
              "coordinates": [
                "37.7749,-122.4194",
                "37.7748,-122.4160",
                "37.7752,-122.4170"
              ]
            }
          ],
          "price": 14.25,
          "coordinates": [
            "37.7749,-122.4194",
            "37.7750,-122.4180",
            "37.7752,-122.4170"
          ]
        },
        {
          "initialPoint": "Current Location",
          "destination": "Airport",
          "distance": 12.8,
          "availability": true,
          "routes": [
            {
              "name": "Express Route",
              "price": 25.00,
              "coordinates": [
                "37.7749,-122.4194",
                "37.7780,-122.4180",
                "37.7790,-122.4170"
              ]
            }
          ],
          "price": 25.00,
          "coordinates": [
            "37.7749,-122.4194",
            "37.7780,-122.4180",
            "37.7790,-122.4170"
          ]
        }
      ];

      final response =
          mockJson.map((json) => TransportRoute.fromJson(json)).toList();

      return Success.send(data: response);
    } catch (e) {
      return Failure.send(error: e.toString());
    }
  }

  @override
  FutureResult<TransportPlace> searchFromCurrentLocation() async {
    try {
      //final currentLocation = await locationService.getCurrentLocation();
      const currentLocation = LatLng(9.008692549835711, 38.78857366835482);
      final transportData = await getAllTransportPlaces();
      final nearbyPlaces = transportData
          .map((place) {
            if (place.coordinates == null) return null;
            final distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              place.coordinates!.latitude,
              place.coordinates!.longitude,
            );
            return MapEntry(place, distance);
          })
          .whereType<MapEntry<TransportPlace, double>>()
          .toList()
        ..sort((a, b) => a.value.compareTo(b.value));

      final nearestPlaces = nearbyPlaces.map((e) => e.key).toList();
      printLog(nearestPlaces.first.name);
      printLog(transportData.first.name);
      if (nearbyPlaces.isEmpty) {
        return Failure.send(error: "No nearby places found");
      }

      return Success.send(data: TransportPlace());
    } catch (e) {
      return Failure.send(error: e.toString());
    }
  }

  @override
  FutureResult<List<TransportPlace>> searchTransportPlaceByName(
      {required String name}) async {
    try {
      final predictions = await locationService.geoCoding(name);

      final places =
          predictions.map((e) => TransportPlace.fromGeoCoding(e)).toList();
      return Success.send(data: places);
    } catch (e) {
      return Failure.send(error: e.toString());
    }
  }

  @override
  FutureResult<TransportRoute> searchTransportRouteByNames(
      {required String origin, required String destination}) async {
    throw UnimplementedError();
  }

  Future<List<TransportPlace>> getAllTransportPlaces() async {
    try {
      if (_transportDatas.isNotEmpty) {
        return _transportDatas;
      }
      final String jsonString =
          await rootBundle.loadString('assets/jsons/search.json');
      final Map<String, dynamic> jsonData = json.decode(jsonString);
      final transportPlaces = jsonData['pois'];
      final List<TransportPlace> transportPlacesList = [];
      for (final placeJson in transportPlaces as List) {
        transportPlacesList.add(TransportPlace.fromJson(placeJson));
      }
      _transportDatas.addAll(transportPlacesList);
      return transportPlacesList;
    } catch (e) {
      rethrow;
    }
  }

  @override
  FutureResult<List<TransportRoute>> getTransportRoutesFromTransportPlace(
      {required TransportPlace initialPoint,
      required TransportPlace destination}) async {
    try {
      // final transportData = await getAllTransportPlaces();
      final direction = await locationService.geDirection(
          origin: initialPoint.coordinates!,
          destination: destination.coordinates!);
      final totalDistance = direction?.totalDistance;
      // final totalDuration = direction?.totalDuration;
      final price = (double.tryParse(totalDistance ?? "0") ?? 0.0) *
          1.5; // Assuming price is calculated as distance * 1.5
      final coordinates = direction?.polylinePoints;
      final route = TransportRoute(
          initialPoint: initialPoint.name!,
          destination: destination.name!,
          distance: double.tryParse(totalDistance ?? "0") ?? 0.0,
          availability: true,
          routes: [],
          price: price,
          coordinates: coordinates ?? []);
      return Success.send(data: [route]);
    } catch (e) {
      return Failure.send(error: e.toString());
    }
  }

  @override
  FutureResult<Plan> getTransportRouteFromTwoPoints(
      {required TransportPlace from, required TransportPlace to}) async {
    try {
      final data = {
        "fromPlace": from.coordinates.toString(),
        "toPlace": to.toString(),
        "date": _todayMonthDayYear(),
        "time": '12:00:00',
        "numItineraries": "7",
        "maxWalkDistance": "1500",
        "mode": "TRANSIT,WALK",
      };
      final response = await _httpService.getRequest(
          urlPath: 'https://pt.addismap.com/otp/routers/default/plan',
          queryParam: data);
      printLog(response.data);
      return Success.send(data: Plan.fromJson(response.data));
    } catch (e) {
      return Failure.send(error: e);
    }
  }

  String _todayMonthDayYear() {
    final today = DateTime.now();
    return "${today.month.toString().padLeft(2, '0')}-01-${today.year}";
  }
}
