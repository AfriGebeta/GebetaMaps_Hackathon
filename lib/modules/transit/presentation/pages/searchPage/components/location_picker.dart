import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:gap/gap.dart';
import 'package:go_find_taxi/_shared/presentation/widgets/app_container.dart';
import 'package:go_find_taxi/core/config/theme/color_pallete.dart';
import 'package:go_find_taxi/core/constants/assets.dart';
import 'package:go_find_taxi/_shared/presentation/widgets/border_less_text_field.dart';
import 'package:go_find_taxi/core/utils/index.dart';
import 'package:go_find_taxi/modules/transit/presentation/providers/searchRoute/search_route_notifier.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../data/models/transport_place_model.dart';
import '../../../../core/search_focus_enum.dart';

class LocationPicker extends StatefulHookConsumerWidget {
  const LocationPicker(
      {super.key, this.from, this.to, required this.onFocusChange});
  final TransportPlace? from;
  final TransportPlace? to;
  final Function(SearchFocus focus) onFocusChange;
  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _LocationPickerState();
}

class _LocationPickerState extends ConsumerState<LocationPicker> {
  late Debounce debounce;
  @override
  void initState() {
    debounce = Debounce(milliseconds: 500);
    super.initState();
  }

  @override
  void dispose() {
    debounce.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    void searchKeyword(String keyword) {
      debounce.run(() {
        ref.read(searchRouteNotifierProvider.notifier).search(keyword);
      });
    }

    return AppContainer(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 33),
      width: double.infinity,
      color: Colors.white,
      child: Row(
        children: [
          SvgPicture.asset(Assets.assetsSvgsRouteProgressVertical),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BorderLessTextField(
                    label: "From",
                    hintText: "Enter Starting Point",
                    controller: TextEditingController(text: widget.from?.name),
                    onChanged: (value) {
                      widget.onFocusChange(SearchFocus.from);
                      searchKeyword(value);
                    },
                  ),
                  const Gap(15),
                  const Divider(
                    height: 3,
                    color: Color.fromARGB(255, 215, 215, 215),
                  ),
                  const Gap(15),
                  BorderLessTextField(
                    hintText: "Enter Destination",
                    controller: TextEditingController(text: widget.to?.name),
                    label: "To",
                    onChanged: (value) {
                      widget.onFocusChange(SearchFocus.to);
                      searchKeyword(value);
                    },
                  ),
                ],
              ),
            ),
          ),
          const AppContainer(
              isShadow: false,
              width: 54,
              height: 54,
              padding: EdgeInsets.all(10),
              color: Color(0xFFCCE6FF),
              child: Center(
                  child: Icon(
                Icons.swap_vert,
                color: ColorPallete.primary,
                size: 30,
              ))),
        ],
      ),
    );
  }
}
