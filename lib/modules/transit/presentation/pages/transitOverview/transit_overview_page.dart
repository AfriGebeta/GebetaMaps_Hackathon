import 'package:flutter/material.dart';
import 'package:go_find_taxi/_shared/presentation/widgets/back_btn.dart';
import 'package:go_find_taxi/core/constants.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../data/models/plan/plan.dart';
import '../../../data/models/transport_place_model.dart';
import '../../widgets/route_display_widget.dart';
import 'components/components.dart';

class TransitOverviewPage extends StatefulHookConsumerWidget {
  const TransitOverviewPage(
      {super.key, required this.plan, required this.from, required this.to});

  final Plan plan;
  final TransportPlace from;
  final TransportPlace to;
  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      _TransitOverviewPageState();
}

class _TransitOverviewPageState extends ConsumerState<TransitOverviewPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _buildMap(),
          _buildSelectedRouteDisplay(context),
          _buildRouteInformation()
        ],
      ),
    );
  }

  Positioned _buildRouteInformation() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: SelectedRouteInformation(
          plan: widget.plan, from: widget.from, to: widget.to),
    );
  }

  SafeArea _buildSelectedRouteDisplay(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: kDefaultPadding),
        child: Column(
          children: [
            const Align(
              alignment: Alignment.centerLeft,
              child: BackBtn(),
            ),
            RouteDisplayWidget(
              onTap: () {},
              from: widget.from.name ?? "-",
              to: widget.to.name ?? "-",
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }

  _buildMap() {
    return const BackgroundMap();
  }
}
