import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:gap/gap.dart';
import 'package:go_find_taxi/core/config/router/route_name.dart';
import 'package:go_find_taxi/core/config/theme/color_pallete.dart';
import 'package:go_find_taxi/core/constants/assets.dart';
import 'package:go_find_taxi/modules/transit/core/itinerary.dart';
import 'package:go_router/go_router.dart';

import '../../../../../../_shared/presentation/widgets/app_container.dart';
import '../../../../core/price_calculator.dart';
import '../../../../data/models/plan/plan.dart';
import '../../../../data/models/route_model.dart';
import '../../../../data/models/transport_place_model.dart';

class SelectedRouteInformation extends StatelessWidget {
  const SelectedRouteInformation({
    super.key,
    required this.plan,
    required this.from,
    required this.to,
  });
  final Plan plan;
  final TransportPlace from;
  final TransportPlace to;

  @override
  Widget build(BuildContext context) {
    return AppContainer(
        radius: 20,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Gap(20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('To the location',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        )),
                    Text(
                        PriceCalculator.calculatePrice(
                            plan.itineraries?.shortestDistance.distance ?? 0),
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        )),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: ColorPallete.primary.withOpacity(.43),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: const Text("Available after 30 Minutes",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: ColorPallete.primary,
                      )),
                ),
              ],
            ),
            const Gap(10),
            Row(
              children: [
                AppContainer(
                  height: 50,
                  width: 50,
                  color: ColorPallete.primary,
                  child: SizedBox(
                    child: SvgPicture.asset(
                      Assets.assetsSvgsBusService,
                    ),
                  ),
                ),
                const Gap(10),
                Text(from.name ?? "-",
                    style: const TextStyle(
                      fontSize: 18,
                    )),
              ],
            ),
            const Gap(10),
            // ...List.generate(
            //     2,
            //     (index) =>
            const Gap(10),
            Builder(builder: (context) {
              final size = MediaQuery.sizeOf(context);
              if (plan.itineraries == null || plan.itineraries!.isEmpty) {
                return const Center(child: Text("No Transit"));
              }
              return SizedBox(
                height: 200,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                  controller: ScrollController(),
                  primary: false,
                  itemCount: plan.itineraries!.shortestDistance.legs.length,
                  itemBuilder: (context, index) {
                    final itineraryLeg =
                        plan.itineraries!.shortestDistance.legs[index];
                    // final isLast =
                    //     index == plan.itineraries!.first.legs.length - 1;
                    // final isFirst = index == 0;

                    // if (isLast || isFirst) {
                    //   // last leg is "Destination "
                    //   return const SizedBox.shrink();
                    // }

                    return InkWell(
                      onTap: () {
                        context.push(RouteName.startNavigation, extra: {
                          'plan': plan,
                          'index': index,
                        });
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 10),
                            width: 4,
                            height: 20,
                            decoration: BoxDecoration(
                              color: ColorPallete.primary.withOpacity(.43),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              border: Border.all(
                                  color: ColorPallete.primary.withOpacity(.43)),
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    // Container(
                                    //   height: 5,
                                    //   width: 5,
                                    //   decoration: BoxDecoration(
                                    //     color: ColorPallete.primary,
                                    //     borderRadius: BorderRadius.circular(100),
                                    //   ),
                                    // ),
                                    // (itineraryLeg.transportMode ==
                                    //         TransportMode.walk)
                                    //     ? const Icon(Icons.directions_walk,
                                    //         size: 16)
                                    //     :

                                    const Icon(Icons.directions_bus, size: 16),
                                    const Gap(10),

                                    SizedBox(
                                      width: size.width / 6,
                                      child: Text(itineraryLeg.fromPlace.name,
                                          style: const TextStyle(
                                              fontSize: 18,
                                              color: ColorPallete.grey)),
                                    ),
                                    const Gap(10),
                                    const Icon(Icons.arrow_forward),
                                    const Gap(10),
                                    SizedBox(
                                      width: size.width / 6,
                                      child: Text(itineraryLeg.toPlace.name,
                                          style: const TextStyle(
                                              fontSize: 18,
                                              color: ColorPallete.grey)),
                                    ),
                                  ],
                                ),
                                Text(
                                    PriceCalculator.calculatePrice(
                                        itineraryLeg.distance),
                                    style: const TextStyle(
                                      fontSize: 15,
                                    )),
                              ],
                            ),
                          ),
                          if (index == 1)
                            Container(
                              margin:
                                  const EdgeInsets.symmetric(horizontal: 10),
                              width: 4,
                              height: 20,
                              decoration: BoxDecoration(
                                color: ColorPallete.primary.withOpacity(.43),
                              ),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              );
            }),

            SafeArea(
              top: false,
              bottom: true,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        AppContainer(
                          height: 50,
                          width: 50,
                          color: ColorPallete.primary,
                          child: Center(
                            child: SvgPicture.asset(Assets.assetsSvgsLocation),
                          ),
                        ),
                        const Gap(10),
                        Expanded(
                          child: Text(to.name ?? "-",
                              maxLines: 2,
                              style: const TextStyle(
                                fontSize: 18,
                              )),
                        )
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      context.push(RouteName.startNavigation, extra: {
                        'plan': plan,
                        'index': 0,
                      });
                    },
                    child: AppContainer(
                      color: ColorPallete.primary,
                      child: Center(
                        child: Row(
                          children: [
                            SvgPicture.asset(Assets.assetsSvgsNavigate),
                            const Gap(10),
                            const Text("Start Navigate",
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                )),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ));
  }
}
