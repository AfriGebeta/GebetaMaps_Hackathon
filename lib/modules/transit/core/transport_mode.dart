enum TransportMode {
  error,
  airplane,
  bicycle,
  bus,
  cableCar,
  car,
  carPool,
  ferry,
  flexible,
  funicular,
  gondola,
  legSwitch,
  rail,
  subway,
  tram,
  transit,
  walk,
  trufi,
  micro,
  miniBus,
  lightRail,
}

const defaultTransportModes = <TransportMode>[
  TransportMode.bus,
  TransportMode.rail,
  TransportMode.subway,
  TransportMode.walk,
];

TransportMode getTransportMode({
  required String mode,
  String? specificTransport,
}) {
  TransportMode value = TransportMode.walk;

  value = _getTransportModeByMode(mode);

  return value;
}

TransportMode _getTransportModeByMode(String mode) {
  return TransportModeExtension.names.keys.firstWhere(
    (key) => key.name == mode,
    orElse: () => TransportMode.walk,
  );
}

extension TransportModeExtension on TransportMode {
  static const names = <TransportMode, String>{
    TransportMode.error: "ERROR",
    TransportMode.airplane: "AIRPLANE",
    TransportMode.bicycle: "BICYCLE",
    TransportMode.bus: "BUS",
    TransportMode.cableCar: "CABLE_CAR",
    TransportMode.car: "CAR",
    TransportMode.carPool: "CARPOOL",
    TransportMode.ferry: "FERRY",
    TransportMode.flexible: "FLEXIBLE",
    TransportMode.funicular: "FUNICULAR",
    TransportMode.gondola: "GONDOLA",
    TransportMode.legSwitch: "LEG_SWITCH",
    TransportMode.rail: "RAIL",
    TransportMode.subway: "SUBWAY",
    TransportMode.tram: "TRAM",
    TransportMode.transit: "TRANSIT",
    TransportMode.walk: "WALK",
    // route name keywords for specific types of transportation
    TransportMode.trufi: "TRUFI",
    TransportMode.micro: "MICROBUS",
    TransportMode.miniBus: "MINIBUS",
    TransportMode.lightRail: "LIGHT RAIL",
  };
}
