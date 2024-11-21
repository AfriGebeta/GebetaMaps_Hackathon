import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../core/config/router/route_name.dart';
import '../../../../core/utils/index.dart';
import '../providers/transportRoute/transport_route_notifier.dart';
import 'route_display_widget.dart';

class TransportRoutesList extends HookConsumerWidget {
  const TransportRoutesList({
    super.key,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final transportRoutes = ref.watch(transportRouteNotifierProvider);
    useEffect(() {
      fetchTransportRoutes(ref, context);
      return null;
    }, [0]);
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("TRANSPORT ROUTS",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                )),
            TextButton(onPressed: () {}, child: const Text("See All")),
          ],
        ),
        transportRoutes.maybeWhen(
            orElse: () => const CircularProgressIndicator.adaptive(),
            success: (transportRoutes) {
              return ListView.builder(
                itemCount: transportRoutes.length,
                shrinkWrap: true,
                itemBuilder: (context, index) {
                  final from = transportRoutes[index].initialPoint;
                  final to = transportRoutes[index].destination;
                  return RouteDisplayWidget(
                    onTap: () {
                      context.push(RouteName.transitOverview,
                          extra: transportRoutes[index]);
                    },
                    from: from,
                    to: to,
                  );
                },
              );
            })
      ],
    );
  }

  void fetchTransportRoutes(WidgetRef ref, BuildContext context) async {
    safeUiApiCall(context, () async {
      await ref
          .read(transportRouteNotifierProvider.notifier)
          .getTransportRoutes();
    });
  }
}
