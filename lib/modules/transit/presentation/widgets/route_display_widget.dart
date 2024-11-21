import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:gap/gap.dart';
import 'package:go_find_taxi/core/constants/assets.dart';

import '../../../../_shared/presentation/widgets/app_container.dart';

class RouteDisplayWidget extends StatelessWidget {
  const RouteDisplayWidget({
    super.key,
    required this.onTap,
    required this.from,
    required this.to,
  });
  final VoidCallback onTap;
  final String from;
  final String to;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          child: AppContainer(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                    child: Text(
                  from,
                  maxLines: 2,
                )),
                const Gap(5),
                SvgPicture.asset(Assets.assetsSvgsRouteProgress),
                const Gap(5),
                Expanded(
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: Text(
                      to,
                      maxLines: 2,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const Gap(10)
      ],
    );
  }
}
