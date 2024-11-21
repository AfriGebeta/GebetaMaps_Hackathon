import 'package:flutter/material.dart';
import 'package:go_find_taxi/modules/transit/presentation/pages/searchPage/search_page.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../modules/transit/data/models/plan/plan.dart';
import '../../../modules/transit/data/models/route_model.dart';
import '../../../modules/transit/data/models/transport_place_model.dart';
import '../../../modules/transit/presentation/pages/start-navigate/start_navigation_screen.dart';
import '../../../modules/transit/presentation/pages/transitOverview/transit_overview_page.dart';
import '../../analytics/observers/observers.dart';
import '../../../_shared/presentation/screens/error_screen.dart';
import '../../barrels/all_screens_barrel.dart';
import 'route_name.dart';

part 'redirection.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
// final _shellNavigatorAKey = GlobalKey<NavigatorState>(debugLabel: 'shellHome');
// final _shellNavigatorBKey = GlobalKey<NavigatorState>(debugLabel: 'shellMap');
// final _shellNavigatorCKey = GlobalKey<NavigatorState>(debugLabel: 'shellBus');
// final _shellNavigatorDKey =
//     GlobalKey<NavigatorState>(debugLabel: 'shellProfile');

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    debugLogDiagnostics: true,
    initialLocation: '/search-screen',
    routes: [
      GoRoute(
        path: RouteName.transitOverview,
        builder: (context, state) {
          final data = state.extra as Map<String, dynamic>;
          final plan = data['plan'] as Plan;
          final from = data['from'] as TransportPlace;
          final to = data['to'] as TransportPlace;

          return TransitOverviewPage(plan: plan, from: from, to: to);
        },
      ),
      GoRoute(
        path: RouteName.search,
        builder: (context, state) => const SearchPage(),
      ),
      GoRoute(
        path: RouteName.startNavigation,
        builder: (context, state) {
          final data = state.extra as Map<String, dynamic>;
          final plan = data['plan'] as Plan;
          final index = data['index'] as int;
          return StartNavigationScreen(plan: plan, index: index);
        },
      ),
      GoRoute(
        path: RouteName.seeAllTransportRoute,
        builder: (context, state) => const SeeAllTransportRoute(),
      ),
      // StatefulShellRoute.indexedStack(
      //   builder: (context, state, navigationShell) {
      //     return AppBottomNavigation(navigationShell: navigationShell);
      //   },
      //   branches: const [
      // StatefulShellBranch(
      //   navigatorKey: _shellNavigatorAKey,
      //   routes: [
      //     GoRoute(
      //       path: '/home',
      //       builder: (context, state) => const Scaffold(
      //         body: Center(
      //           child: HomePage(),
      //         ),
      //       ),
      //       routes: const [],
      //     ),
      //   ],
      // ),
      // StatefulShellBranch(
      //   navigatorKey: _shellNavigatorBKey,
      //   routes: [
      //     GoRoute(
      //       path: '/map',
      //       builder: (context, state) => const Scaffold(
      //         body: Center(
      //           child: Text('Section B'),
      //         ),
      //       ),
      //       routes: const [],
      //     ),
      //   ],
      // ),
      // StatefulShellBranch(
      //   navigatorKey: _shellNavigatorCKey,
      //   routes: [
      //     GoRoute(
      //       path: '/bus',
      //       builder: (context, state) => const Scaffold(
      //         body: Center(
      //           child: Text('Section B'),
      //         ),
      //       ),
      //       routes: const [],
      //     ),
      //   ],
      // ),
      // StatefulShellBranch(
      //   navigatorKey: _shellNavigatorDKey,
      //   routes: [
      //     GoRoute(
      //       path: '/profile',
      //       builder: (context, state) => const Scaffold(
      //         body: Center(child: Text('Profile')),
      //       ),
      //     ),
      //   ],
      // ),
      //     ],
      //   ),
    ],
    redirect: goRouterRedirect,
    observers: [NavigatorObserverAnalytics()],
    errorBuilder: (context, state) => ErrorScreen(state.error),
  );
});
